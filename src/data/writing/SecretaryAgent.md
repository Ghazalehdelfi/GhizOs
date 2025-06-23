# Automating Scheduling with Secretary Agent: A Deep Dive into the Architecture and Implementation

In an age where productivity tools are everywhere, scheduling remains one of the most frustrating micro-tasks. It's not technically difficult, but the back-and-forth nature of coordinating between people—especially across organizations—makes it an annoying mental drain.

**Secretary Agent** is a modular, multi-agent system built to handle this pain point. It automates the entire scheduling workflow: negotiating times, checking availability, handling human responses, and booking events. It uses Google's Agent Development Kit (ADK) to structure communication between agents and external services.

In this post, we'll walk through the system architecture and explain how each part works in code.

---

## 📊 High-Level Architecture

![Secretary Agent System Architecture](/static/img/diagram.svg)

At a glance, Secretary Agent consists of three specialized agents:

1. **Host Agent**: Accepts user input and delegates scheduling tasks.
2. **Sync Agent**: Coordinates meeting time with invitees via A2A (agent-to-agent) or email.
3. **Calendar Agent**: Integrates with the Google Calendar API to check availability and create events.

```
[User] ➔ UI ➔ Host Agent
                ├─➔ Sync Agent ➔ [A2A | Email]
                └─➔ Calendar Agent ➔ Google Calendar
```

The system determines whether the invitee has an agent (via a "phone book") and chooses the right communication channel: automated negotiation or human-in-the-loop via email.

![Secretary Agent System Diagram](/static/img/diagram.svg)

---

## 💪 Core Components and Code Walkthrough

### 1. Host Agent: The Orchestrator

**File:** `host_agent/orchestrator.py`

The Host Agent receives scheduling requests from the UI/API. Its job is to decide which sub-agent is responsible:

```python
# Simplified pseudo-logic
if task.type == "schedule_meeting":
    sync_agent.handle(task)
elif task.type == "confirm_time":
    calendar_agent.schedule(task)
```

It acts as a dispatcher, keeping the flow clear and responsibilities modular.

### 2. Sync Agent: The Negotiator

**File:** `sync_agent/agent.py`

This agent is the most complex and intelligent component. It:
- Checks the phone book to see if the invitee has an agent.
- If yes, uses A2A messaging to propose times.
- If not, generates an email and handles replies.

```python
if invitee.has_agent():
    response = send_agent_to_agent_request(invitee)
else:
    response = email_human(invitee_email, proposed_times)
```

#### 🔄 Asymmetrical Sync Design

One of the key implementation challenges was **preventing infinite A2A negotiation loops** between two symmetric Sync Agents. To solve this, Secretary Agent introduces an **asymmetrical role assignment**:

- The **initiator** Sync Agent begins the negotiation process.
- The **responder** simply acknowledges and replies with availability.

This design ensures a clear direction for the communication flow and eliminates recursive back-and-forths that could otherwise occur between two identical agents trying to negotiate simultaneously.

The role is determined based on agent identity or task origin and is enforced in logic handling the request type.

### 3. Calendar Agent: The Executor

**File:** `calendar_agent/agent.py`

This component interacts directly with the Google Calendar API. It:
- Checks the user's availability.
- Schedules an event once time is finalized.

```python
def schedule_event(start_time, end_time, participants):
    service = build_calendar_service()
    service.events().insert(...).execute()
```

The agent abstracts Google API interaction so that other agents never need to deal with credentials or response parsing.

---

## 🎓 Using Google ADK

Secretary Agent is powered by **Google's Agent Development Kit**, which offers:

- **Agent-to-Agent protocol support**: Lightweight inter-agent messaging.
- **Context/state management**: Each agent maintains its own task session.
- **Built-in connectors**: Email, calendar, and other tools integrate cleanly.

The ADK allows each agent to focus on *what* to do, not *how* it communicates or stores state.

---

## ⚛️ Execution Flow

Here is how a full task flows through the system:

1. **User Input**: "Schedule a meeting with Alex next week"
2. **Host Agent** receives the request and routes it to Sync Agent.
3. **Sync Agent** checks if Alex has an agent.
   - If yes: sends A2A message and agrees on time.
   - If no: sends an email, parses the reply.
4. Once a time is finalized, Sync Agent sends it to Calendar Agent.
5. **Calendar Agent** books the meeting via Google Calendar API.

---

## 🌐 Hybrid Automation: Agents + Humans

What makes Secretary Agent powerful is its hybrid model:
- When everyone has an agent, it's *fully automated*.
- When someone doesn't, it still works by gracefully switching to human-friendly channels like email.

This is a prime example of **agent collaboration across boundaries**: systems where automation enhances human interaction rather than replaces it.

---

## ✨ Conclusion

Secretary Agent turns an annoying part of modern life—scheduling—into a seamless background process. With modular agents built using Google ADK, it showcases:
- Clean separation of responsibilities
- Smart fallback strategies
- Seamless integration with real-world tools like Gmail and Google Calendar
- A thoughtful approach to avoiding symmetrical negotiation loops

As we move toward more intelligent systems, this project serves as a strong example of how agent-based architecture can bridge AI and real-world productivity.

---

*Want to see the code? Check out [Secretary Agent on GitHub](https://github.com/Ghazalehdelfi/secretary_agent)*
