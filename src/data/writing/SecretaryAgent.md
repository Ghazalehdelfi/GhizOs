# Automating Scheduling with Secretary Agent: A Deep Dive into the Architecture and Implementation

In an age where productivity tools are everywhere, scheduling remains one of the most frustrating micro-tasks. It's not technically difficult, but the back-and-forth nature of coordinating between people—especially across organizations—makes it an annoying mental drain. I wanted to explore whether this could be gracefully automated using modern AI tooling — and more importantly, in a way that supports both fully digital workflows and real human interactions.

**Secretary Agent** is a modular, multi-agent system built to handle this pain point. It automates the entire scheduling workflow: negotiating times, checking availability, handling human responses, and booking events. It uses Google's Agent Development Kit (ADK) to structure communication between agents and external services.

In this post, we'll walk through the system architecture and explain how each part works.

## 🤓 What's the big idea?

![High level system](/static/img/agent-system.png)

The core concept is simple: treat scheduling as a task that can be delegated to intelligent agents.

Imagine a world where you—and everyone in your contact list—have a personal secretary agent, much like having an email address. Your agent connects to your Google Calendar and Gmail, with the ability to retrieve availability, create events, and send or receive messages.

You could say something like, “Hey, I want to have a meeting with John tomorrow.” Your secretary agent would check your contacts for John’s agent URL (if he has one) and initiate a conversation with his agent. If John’s availability aligns with yours, your agent books the meeting directly through the Google Calendar API.

Now what if John doesnt have an agent? Let's assume John's contact in your phonebook only has an email, then the agent will send an email to John with something like: “Hi, I’m Ghazaleh’s assistant—she’d like to meet this week. When are you free?”. Now John will act as _his own secretary_ and interact with your agent. Every email reply is tied to the same session, so context is preserved until an agreement is reached and the meeting is booked.

## 📊 High-Level Architecture

![Secretary Agent System Architecture](/static/img/system-components.png)

At a glance, Secretary Agent consists of three specialized agents:

1. **Host Agent**: Point of contact with core user, accepts user input and delegates tasks.
2. **Sync Agent**: Coordinates meeting time with invitees via A2A (agent-to-agent) or email.
3. **Calendar Agent**: Integrates with the Google Calendar API to check availability and create events.

```
[User] ➔ UI ➔ Host Agent
                ├─➔ Sync Agent ➔ [A2A | Email]
                └─➔ Calendar Agent ➔ Google Calendar
```

The system determines whether the invitee has an agent (via a "phone book") and chooses the right communication channel: automated negotiation or human-in-the-loop via email.

## 💪 Core Components and Code Walkthrough

### 1. Host Agent: The Orchestrator

**File:** `host_agent/orchestrator.py`

The Host Agent handles all incoming scheduling requests from the UI or API. Its main job is to delegate tasks to the right sub-agent. It has two key tools:

- `list_agents`: Looks up available agents in the registry (currently Sync and Calendar), fetches their metadata using A2A .well-known endpoints, and caches their capabilities.
- `delegate_task`: Passes the task to the appropriate agent based on what’s available.

This modular design makes the system extensible—you can plug in more agents as the ecosystem grows.

### 2. Sync Agent: The Negotiator

**File:** `sync_agent/agent.py`

This agent is the most complex and intelligent component. It:

- Checks the private phone book to see if the invitee has an agent. This phone book works like contact info: not public, but shared among people who know each other.
- If the invitee has an agent, it initiates an A2A negotiation.
- If not, generates an email and handles replies.

To handle asynchronous human replies, the Sync Agent logs email session data to a database. It also runs a parallel thread that monitors the user’s inbox and forwards any new replies in active threads back to the appropriate agent session.

```python
if invitee.has_agent():
    response = send_agent_to_agent_request(invitee)
else:
    response = email_human(invitee_email, proposed_times)
```

#### 🔄 Asymmetrical Sync Design

One of the key implementation challenges was **preventing infinite A2A negotiation loops** between two symmetric Sync Agents. If both users have identical agents, one agent’s request could trigger the other to respond in kind—causing a back-and-forth loop. To solve this, Secretary Agent introduces an **asymmetrical role assignment**. Each Sync Agent can act in one of two roles, each defined by a distinct system prompt and behavior. When a request is received, the Sync Agent’s task manager inspects the request's metadata and assigns the appropriate role before invoking the agent:

- The **initiator** is the agent that starts the process. It takes responsibility for driving the scheduling conversation: contacting the other party (via A2A or email), proposing times, managing the negotiation, and ultimately calling the Calendar Agent to create the event.
- The **responder** takes a more passive role. It simply replies to incoming scheduling requests with availability information and does not attempt to initiate a conversation or delegate tasks in return.

This design ensures a clear direction for the communication flow and eliminates recursive back-and-forths that could otherwise occur between two identical agents trying to negotiate simultaneously.

### 3. Calendar Agent: The Executor

**File:** `calendar_agent/agent.py`

This component interacts directly with the Google Calendar API. It:

- Checks the user's availability.
- Schedules an event once time is finalized.

The agent abstracts Google API interaction so that other agents never need to deal with credentials or response parsing.

## ⚛️ Execution Flow

Here is how a full task flows through the system:

1. **User Input**: "Schedule a meeting with Alex next week"
2. **Host Agent** receives the request and routes it to Sync Agent.
3. **Sync Agent** checks if Alex has an agent.
   - If yes: sends A2A message and agrees on time.
   - If no: sends an email, parses the reply.
4. Once a time is finalized, Sync Agent sends it to Calendar Agent.
5. **Calendar Agent** books the meeting via Google Calendar API.

## 🤓 What I Learned

Building this project taught me a great deal about:

- **Multi-agent architecture with Google ADK:** While each user runs a multi-agent setup, the system’s potential truly shines when adopted at scale. Imagine a world where every individual has their own secretary agents, communicating seamlessly with others’ agents across organizations (an example of this is shown in the video demo). In this model, your "contact method" isn't just an email—it’s an intelligent interface.
- **The importance of asymmetry in agent communication:** A key architectural challenge was preventing infinite negotiation loops between two identically programmed Sync Agents. The solution was an asymmetrical design, where the Sync Agent distinguishes between an initiator (who sends the request) and a responder (who replies with options). Without this, a request from Person A to B could trigger B to query A again, creating an endless loop. This role distinction keeps the logic coherent and convergent.
- **Designing robust fallback systems:** Autonomous systems need to account for imperfect environments. Just like in autonomous vehicles literature, we talk about different 'levels' of automation to handle environments and systems that aren't fully smart, my agent system needed to work when the other party doesn’t have an agent. I designed the Sync Agent to detect whether the invitee has a known agent; if not, it gracefully falls back to sending an email. Responses to that email thread are parsed and routed back to the original Sync Agent, which treats them as if they were agent-generated responses.
- **Real-world service integration:** Working with the Google Calendar API and Gmail meant managing state, authentication, and edge cases in event scheduling and communication —all while keeping the complexity abstracted from the other agents.
- **The power of composable, task-specific agents:** Rather than building a single, all-knowing agent, I focused on creating smaller, focused agents that collaborate—each with a clear responsibility. This keeps the system modular and easier to debug, scale, and extend.

This project also deepened my appreciation for human-AI hybrid systems. The most satisfying moments often came from designing transitions—when agents hand off to humans and vice versa—without breaking the flow or losing context.

## ✨ Conclusion

Secretary Agent turns an annoying part of modern life—scheduling—into a seamless background process. With modular agents built using Google ADK, it showcases:

- Clean separation of responsibilities
- Smart fallback strategies
- Seamless integration with real-world tools like Gmail and Google Calendar
- A thoughtful approach to avoiding symmetrical negotiation loops

As we move toward more intelligent systems, this project serves as a strong example of how agent-based architecture can bridge AI and real-world productivity.

## 🎥 Video demo

[![alt text](https://img.youtube.com/vi/-IONj-v1sXg/0.jpg)](https://youtu.be/-IONj-v1sXg)

---

_Want to see the code? Check out [Secretary Agent on GitHub](https://github.com/Ghazalehdelfi/secretary_agent)_
