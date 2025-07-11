# Moving With Your Team Out of Legacy

If you’re working on a long-running project, there’s a good chance you’ll encounter what I'm calling a _legacy codebase_: code that has grown like wild gardens, some systems evolve in ways their original design didn’t anticipate. The logic may be tangled and hard to follow, and the only people who truly understand how things work are those who’ve been around long enough to navigate its quirks by instinct.

Being in this kind of environment can be draining, both mentally and emotionally. But here’s the good news: you don’t have to accept defeat. With a proactive mindset and some resilience, you can make life significantly better — not just for yourself, but for your whole team.

The key thing to remember is this: modernizing a legacy system isn’t just about rewriting code. It’s about shifting culture, improving communication, and learning to compromise where needed.

Here’s some lessons I've learnt.

## 1. Start Small – The Broken Windows Analogy

The Broken Windows Theory suggests that visible signs of disorder invite more disorder. The same holds true in large development teams. When the build is constantly broken, commits are chaotic, linting is ignored, and outdated patterns linger, inertia takes over. It’s hard to drive improvement alone when the environment resists it.

But small acts of discipline send a powerful signal:

- Change is underway.
- The team’s tolerance for chaos is shrinking.

Add a linter. Write better tests. Refactor that gnarly function. Block pushes if checks fail. These may seem like small steps, but they’re not. They’re the cracks where daylight gets in.

## 2. Find and Cultivate Advocates of Change

You don’t need everyone on board from day one — but you do need a few believers. Find the team members who are frustrated by the status quo yet still hopeful. Give them space to experiment. Celebrate their wins. These are your internal champions — the ones who can help spark cultural change.

Chances are, most of the team has built up a lot of inertia against change. So stop waiting for unanimous approval. Don’t ask for permission — start taking action. With support from your advocates, make small, visible improvements. As the benefits become clear, others will follow.

## 3. Build Bridges with the Business

You can’t invest significant time into any effort if the business doesn’t understand _why_ it matters.

Build feedback loops. Frame the conversation in terms they care about: risk, delivery speed, customer impact. Modernization efforts fail when they’re seen as “tech for tech’s sake.” They succeed when the business sees real outcomes — faster delivery, greater stability, more room to adapt.

You need the business on board. Because at the end of the day, your team can’t tackle tech debt unless the product owner allocates the story points. No buy-in, no bandwidth.

## 4. Don’t Be a Perfectionist

Purism kills momentum. Legacy systems rarely afford the luxury of greenfield ideals.

Learn to compromise. Aim for _better_, not _perfect_. That might mean living with some old patterns longer than you'd like, or adopting tools that aren't your favorite. Progress > purity.

## 5. Tidy Up – Even if It’s Not Glamorous

Naming conventions, folder structures, README files.
They might seem minor, but they matter — especially in legacy systems, where they’re often treated as an afterthought. Clarity and tidiness act as force multipliers. A well-structured repo makes onboarding easier, collaboration smoother, and technical debt more visible. It’s the software equivalent of clearing paths through an overgrown garden.

Here are a few practical improvements I’ve seen make a real difference:

- **Automated repo hygiene with GitHub Actions**

Set up automations to remove stale branches, auto-label PRs, and detect unused code (e.g., using Vulture). Small touches like these keep your repos lean and easier to manage.

- **Smarter tooling**

Look at similar upgrades in all major areas of the project e.g. dependency management, config management, experiment tracking, etc. Faster pipelines allow faster feedback loops, helping team catch and address issues earlier.

- **Consolidating repositories**

Splitting components across multiple repos can feel clean in theory — clear boundaries, clear ownership. But if the same team owns all of them, this quickly turns into overhead. In my experience, a well-organized monorepo is often the better option. It reduces complexity, simplifies tooling, and centralizes documentation.

## 6. Get a High-Level Map

Before you can change a system, you need to understand it. Not every detail but the key flows, boundaries, and pain points.

Visual diagrams help. So do walking through user journeys and talking with domain experts. Without a shared mental model, teams make local improvements that conflict or backfire.

---

## Final Thoughts

Key word here is a mindset: **pragmatic optimism**.

Focus on visible wins, build internal momentum, and keep your eyes on the bigger picture. It’s messy work — but it can be some of the most impactful you do.
