---
title: Do More Options Make a Better Game? Designing Meaningful Choices
date: 2026-10-15 09:00:00 +0900
categories:
- Game Design
tags:
- gdc-notes
- gdc
- game design
- meaningful choice
- level design
description: Explore meaningful choice, possibility spaces, agency, and game systems through Matthias Worch’s GDC 2014 talk.
reviewed_at: 2026-11-06
lang: en
layout: lily-post
original_url: /posts/meaningful-choice-gdc-2014/
permalink: /en/posts/meaningful-choice-gdc-2014/
comments: true
translation_key: meaningful-choice-gdc-2014
previous:
  url: /en/posts/unity-0/
  title: Unity — 0. A Complete Beginner’s Installation Guide
---
> **Subtitle:** Exploring meaningful choice through Matthias Worch’s GDC 2014 talk, “Decisions That Matter.”

Does giving players more options necessarily make a game more enjoyable?

A game may have ten weapons, five branching paths, and a different action on every button. That looks like a broad set of choices. But if one option is always stronger and safer, the player does not really need to deliberate. They simply find the best answer and repeat it.

Matthias Worch’s GDC 2014 talk, “Decisions That Matter — Meaningful Choice in Game and Level Design,” examines interesting decisions and meaningful choice. His published introduction describes psychological background followed by DOOM II combat, enemy possibility spaces, prioritization, and the complex patterns produced by interacting systems. This entry draws on that introduction and the GDC session overview, then applies the ideas to game design and hypothetical Delivery Simulator scenarios. Details that have not been checked against the full recording are not presented as direct claims by the speaker.

## 1. Available options are not the same as meaningful choices

Consider two fictional weapons. These numbers are invented to illustrate the idea.

| Weapon | Damage | Attack interval |
| --- | ---: | ---: |
| A | 10 | 1 second |
| B | 20 | 1 second |

If accuracy, range, ammunition cost, and every other condition are equal, B is twice as powerful. A menu offers two options, but the reasonable answer is effectively predetermined.

Now suppose A deals less damage but fires rapidly, while B delivers a powerful shot with a long interval between attacks. A rapid weapon might help against several weak enemies; a heavy shot might suit a single durable target. The decision can change with enemy count, position, and ammunition.

This does not guarantee that the second version is more fun. The point is that alternatives need reasons to matter in different circumstances. Adding options is not enough: we must consider what each gives up, what it gains, and why the current situation makes those differences significant.

## 2. A good choice depends on the situation

A **possibility space** is the range of actions and outcomes permitted by the rules and systems. Its depth is not determined only by listing actions such as jumping, attacking, and hiding. Those actions produce different situations when combined with enemy behavior, terrain, and resources.

Worch’s introduction explicitly identifies DOOM II as a case study and mentions an enemy possibility-space map and prioritization choices. This suggests looking at enemies as different kinds of threats rather than simply targets to eliminate. Enemy types and placement, distance, ammunition, the equipped weapon, and available movement space can together create the question: “What should I deal with first?”

For example, if one enemy attacks from a distance while another closes in quickly, the best target can depend on remaining health, ammunition, and position. The same enemy combination may call for a different response when there is less room to dodge. This is my interpretation of the published description, rather than a reconstruction of a particular combat sequence from the talk.

The possibility space is therefore more than a count of available actions. We should also ask how many combinations the interacting systems create that deserve the player’s judgment. Existing enemy behaviors, terrain, and weapon resources can already combine into situations requiring different strategies, without adding another rule.

> Interactions between systems can produce richer choices than the complexity of each system alone.

This is my own interpretation of the introduction’s discussion of systems combining into complex patterns, not a verified quotation from the presentation. Increasing the number of systems and improving the quality of choices are different tasks. What matters is whether the systems meaningfully change one another.

## 3. The player’s decision should affect the outcome

**Player agency** describes the extent to which players can act intentionally and feel that their actions affect the game state or experience. A large set of controls does little for agency if every action leads to the same result, or if players cannot understand why the outcomes differ.

Compare a short, risky route A with a longer, safer route B. A may get the player to the destination faster but increase the risk of a collision or missed deadline. B may take more time while reducing risk. The choice affects play when the player considers time, resources, and acceptable risk, chooses a route, and can recognize the consequences.

Those consequences do not need to be different endings or enormous story branches. Small decisions, such as which enemy to attack first or when to spend scarce ammunition, can change later positioning, resources, and difficulty. The connection between decision and outcome matters more than its scale. Nor does every result need to be completely predictable: players need enough information to understand the risk they accepted and reflect on what happened.

## 4. Applying this to Delivery Simulator

This section presents a **hypothetical design exercise**, not a description of verified implemented features. The available project introduction does not establish that orders, deadlines, or route selection have already been implemented.

Imagine two delivery requests arriving together:

- Delivery A is nearby and pays a small reward.
- Delivery B is farther away and pays more.
- Choosing which to complete first changes the chance of missing the other deadline.

Comparing rewards alone might make B appear to be the correct answer. Add deadlines, distance, and delivery order, and the judgment can change. Completing A first secures a modest reward and removes one time pressure, but uses time needed for B. Heading straight to B aims for the larger reward while risking A’s deadline. Which option is reasonable depends on remaining time and route risk.

For this to feel like a choice, players need to understand the information that influences the result. Without useful indications of travel time, deadlines, rewards, and risks, they are guessing. On the other hand, showing every outcome with certainty may reduce the situation to arithmetic. The right level of uncertainty depends on the intended tension and how information is communicated.

Adding traffic or customer reputation is not an end in itself. Traffic can matter if it changes route timing or risk; reputation can matter if it changes the cost of failure or future opportunities. If the systems merely add independent scores, the list of things to track grows without making the choices clearer. Applying these ideas to the actual project would require checking the current order, movement, and time systems against the intended experience first.

## 5. Questions to ask before adding more options

Before adding a weapon, route, or interaction, consider:

1. **Is there a real reason to deliberate?** If one alternative is always stronger and safer, the others may be decorative.
2. **Do alternatives have distinct strengths and weaknesses?** Look beyond numerical differences to changes in play and risk.
3. **Does the reasonable choice change with the situation?** Enemy combinations, position, resources, and time should be able to change an option’s value.
4. **Can players understand the relationship between choice and outcome?** Without feedback, consequences may feel like arbitrary punishment.

The published talk overview connects meaningful choice to possibility spaces, motivation, agency, and level design. Individually simple rules, such as enemy behavior and spatial layout, can combine into situations that require prioritization. The useful question is whether players can read those situations, compare alternatives, and connect the outcome to their decisions.

Good game design is less about offering as many options as possible than about creating situations with a reason to choose.

## References

- Matthias Worch, [GDC 2014: “Decisions That Matter – Meaningful Choice In Game And Level Design”](https://www.worch.com/2014/03/23/decisions-that-matter/) — the speaker’s introduction, outlining psychology, DOOM II, prioritization, and interacting systems.
- GDC Vault, [Level Design in a Day: Decisions That Matter — Meaningful Choice in Game and Level Design](https://www.gdcvault.com/play/1021073/Level-Design-in-a-Day) — session title, speaker, year, and overview.
- [YouTube recording](https://www.youtube.com/watch?v=BEF4GVNzkUw) — the recording linked in the original publishing request. The original review did not directly inspect its transcript or verify timestamps, so no detailed remarks are quoted from it.

The speaker’s introduction and session overview were available for verification. Detailed presentation sequences and specific combat scenes are reflected only within the scope of those summaries. Weapon statistics, delivery situations, and route examples are fictional examples created for this article.
