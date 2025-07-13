# **Is Software Engineering Doomed?**

For people who are constantly exposed to LinkedIn and tech news, now is both a scary and exhilarating time. New technologies and advances in AI seem to emerge every second. Major players keep releasing models that outperform each other in performance and efficiency, and every day brings new ways to integrate LLMs into your daily workflow.

As someone with limited tolerance for hype before it starts tipping into anxiety, I wanted to flesh out my thoughts on what this all means for me: a software/ML engineer trying to navigate today’s tech landscape. Before diving deeper, let me answer the title of this post right up front:

**No, I don’t think so.**

Now with that out of the way, let’s talk about why.

## Don’t Buy into the Hype

It’s easy to get swept up in the waves of both enthusiasm and fear. When the stakes feel high, every rumor becomes an emergency. And if a piece of news might directly affect your job or career, your filters for reasoning and fact-checking can drop fast.

Looking at current AI news, a lot of what I see is hype. That doesn’t mean there’s no real progress. But the *complete changes* everyone keeps promising? Those are much more complex and slower to arrive than they seem.

Andrej Karpathy, in his talk [_Software is changing (again)_](https://www.youtube.com/watch?v=LCEmiRjPEtQ), mentions how he had a perfect ride in a driver-less Waymo car back in 2012 and thought “autonomous driving is imminent.” Yet here we are, over a decade later—smart cars are more common, but full autonomy still isn’t here. What felt imminent is proving to be much more complex to be widely implemented and adopted.

## So What Do You Do as a Software Engineer?

If you’ve worked as a developer, you know that **writing code** has never been the real bottleneck. [Here](https://ordep.dev/posts/writing-code-was-never-the-bottleneck), Pedro Tavares argues this, and I think most engineers would agree. Coding a feature is often the *easiest* part of your job. It’s the planning, integration, coordination across teams, debugging, testing, and maintenance that eat up your time — and those things are much harder to automate.

Even in side projects: sure, you can get some code going fast with a quick vibe coding session. But to make it actually work in the real world you still need to deal with deployment, monitoring, security, payments, auth, logging, and so on.

## But Will I *Eventually* Be Replaced?

I don’t think so — at least not any time soon.

Karpathy again lays out a fascinating [observation](https://karpathy.bearblog.dev/power-to-the-people/): LLMs have *reversed* the usual direction of technological advantage. Historically, technologies benefited large institutions first. But with LLMs, **individuals** are seeing the biggest gains early on.

Why is that? LLMs provide wide (if fallible) expertise, something individuals have never had access to before. As one person, you can now *simulate* the knowledge of experts across multiple fields. Although it's not perfect, still this remains a huge gain for an individual. But big organizations already *have* experts. What they need is consistency and reliability—something LLMs don’t (yet) provide well.

Robin Sloan gives a great [example](https://www.robinsloan.com/lab/what-are-we-even-doing-here/): a lot of websites now offer AI-powered documentation bots. But if you ask a slightly complex question, chances are it’ll make up an answer that *sounds* correct but actually doesn’t work. (I personally ran into this with Supabase's support bot during a side project. I was confidently presented with some code snippet to add in my project for an integration which didn’t even exist).

This is part of the reason why AI hasn't yet been delivering the great promise it holds. Real integration and dependable progress will take much longer to achieve.

## What About AI Agents?

“A thinking machine that executes tasks—that has to replace me, right?”

Not quite.

AI agents suffer from the same fallibility issues, but worse. Hugo Bowen-Anderson breaks this down in ["Stop Building AI Agents"](https://decodingml.substack.com/p/stop-building-ai-agents), when you let LLMs make decisions, things get messy fast. To quote directly from the post:

> “Everyone reaches for agents first. They set up memory systems. They add routing logic. They create tool definitions and character backstories. It feels powerful and it feels like progress.
> Until everything breaks. And when things go wrong (which they always do), nobody can figure out why.”

Agents *feel* magical—until they fall apart. Leaving decision-making to an LLMs often makes processes more fragile. Your best bet is to keep LLMs on a tight leash to ensure they deliver consistent results. They’re amazing assistants, but their unpredictability means they still need tight supervision.

## OK, So What Now?

Despite everything I’ve said, I *do* believe LLMs are amazing sidekicks and you can generate great momentum leveraging their powers. Tools are evolving rapidly, and we should learn to use them to amplify our strengths.

Here are couple of articles I have found useful to use AI as a multiplier of force. Worth the time to go through them in detail:

- https://blog.nilenso.com/blog/2025/05/29/ai-assisted-coding/
- https://austen.info/blog/github-copilot-agent-mcp

## Final Thoughts

Adib Ghorbani, in his [music literacy course](https://decodingml.substack.com/p/stop-building-ai-agents) (highly recommended btw), talks about how humans tend to react to new technologies in three ways:

- The opposed: Those that feel threatened by the coming change, chances are they have established practices in the previous way of doing things and the looming change brings feelings of anxiety.
- The excited: Those welcoming and utilizing the coming change, they identify potential ways of using the new technology to unlock opportunities that weren’t previously possible.
- The indifferent: Those whose lives will not be changed significantly by the change, they remain mere observers.

The “opposed” group often argues that the old way was better. Take John Philip Sousa, an American composer, who in 1854 railed against invention of the phonograph:

> “These talking machines are going to ruin the artistic development of music in this country. When I was a boy... in front of every house in the summer evenings, you would find young people together singing the songs of the day or old songs. Today you hear these infernal machines going night and day. We will not have a vocal cord left. The vocal cord will be eliminated by a process of evolution, as was the tail of man when he came from the ape.”

Fast-forward 150+ years: recording didn’t kill music. It just *transformed* it. And I think the same is true for LLMs. Here’s what I’m most excited about:

- **New roles and jobs**: Just like there were not web devs before the dot-com boom, the AI boom will need builders, integrators, and maintainers of AI systems.
- **Democratized learning**: LLMs have become great sounding boards. I’ve used them to study papers or topics I struggled to understand before.
- **Access for underserved communities**: Lower operational costs for services can unlock access in places that couldn’t afford them otherwise.
- **Lower barriers to creation**: AI unlocks capabilities for individuals that used to require whole teams. What was once completely inaccessible for a person to achieve is now within reach, opening up a world of possibilities.

---

Thanks for reading. I'd love to hear your thoughts — whether you're skeptical, optimistic, or somewhere in between.
