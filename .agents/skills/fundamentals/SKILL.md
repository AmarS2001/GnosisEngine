---
name: teach
description: Builds a structured, from-scratch self-study curriculum on a technical topic, written as Docusaurus MDX docs. Triggers on requests to learn or get notes on a technical topic, e.g. "teach me Kafka" or natural questions like "how does LLM inference work" — infer the topic from phrasing like that.
---

## Determine the topic
The user's request may be a bare topic ("Kafka") or a natural sentence
("How does LLM inference work"). Either way, extract a concise canonical
topic — a short noun phrase, not the full sentence (e.g. "How does LLM
inference work" → **LLM Inference**). Use that canonical name for the
folder slug and for titles throughout.

The reader is a senior software engineer with strong general CS/engineering
fundamentals but ZERO prior knowledge of this specific topic. Do not explain
generic programming concepts (what an API is, what a queue is, etc.) — do
explain everything specific to this topic, assuming nothing. Where useful,
anchor new concepts to things a senior dev already knows (e.g. "unlike a
traditional message queue, Kafka retains messages after they're read").

**Quality bar:** this is the whole point of the skill — prioritize
correct, concrete, well-explained content over speed or file count. Every
concept needs at least one real example (real code, a real config, a real
scenario), not just an abstract description. If a section would otherwise
be filler, cut it rather than pad it.

## Step 0 — Research first
Before writing anything, research the current state of the topic (latest
stable version, current best practices, anything that's changed recently or
is commonly outdated in older tutorials). Don't rely purely on memory —
verify anything version-specific or fast-moving.

## Step 1 — Set up the folder
All topics live under a single top-level `Fundamentals/` directory (create
it if it doesn't exist yet, and reuse it across runs — don't recreate it per
topic). Inside it, create a subfolder named after the canonical topic in
kebab-case, e.g. `Fundamentals/kafka/` or `Fundamentals/llm-inference/`. If
that subfolder already exists, ask whether to overwrite or extend it rather
than silently clobbering it.

All file paths in the steps below are relative to this topic subfolder,
i.e. `Fundamentals/<topic>/00-index.mdx`,
`Fundamentals/<topic>/assets/...`, etc.

Also create `Fundamentals/<topic>/_category_.json` for Docusaurus sidebar
grouping:
```json
{
  "label": "<Readable Topic Title>",
  "position": 1,
  "link": { "type": "doc", "id": "00-index" }
}
```

## Step 2 — Design the curriculum
Break the topic into a logical sequence of modules, ordered from
foundational → intermediate → advanced → operational/production concerns →
comparisons & further resources.

Don't target a fixed module count. Instead, first list out every concept a
practitioner genuinely needs to be competent in this topic, then group
closely related concepts into modules. The right number of modules is
whatever that produces — a narrow topic might need 5, a broad one might
genuinely need 15+. What matters is that every module earns its place:
- No module should be filler — if it doesn't carry a distinct, important
  concept, merge it into another module instead of padding the count.
- No important concept should be missing just to keep the list short —
  thoroughness matters more than brevity here. If you're unsure whether
  something is important enough to include, err toward including it.
- Sanity-check the final list against how the topic is actually taught or
  discussed by practitioners (docs, courses, interviews) — if something
  universally considered core is missing, add it.

## Step 3 — Write the index
Create `00-index.mdx` with Docusaurus frontmatter:
```
---
id: index
title: 🧭 <Topic> — Overview
sidebar_position: 0
description: <one-line summary>
---
```
Body contents:
- 🎯 One-paragraph "why this exists / what problem it solves"
- 📋 Assumed background (state it explicitly)
- 🗺️ A table of contents linking every module file, in order
- ⏱️ A rough time estimate per module
- 📖 A short glossary of terms that will recur across modules

## Step 4 — Write each module
One file per module: `01-<slug>.mdx`, `02-<slug>.mdx`, etc. Each starts
with Docusaurus frontmatter:
```
---
id: <slug>
title: <Emoji> <Module Title>
sidebar_position: <n>
description: <one-line summary>
---
```
Body contents, in this order:
1. **🎯 Learning objectives** (3–5 bullet points)
2. **Core explanation** — calibrated for a senior dev, no fluff. Use one
   or two emojis per section heading, not per line — enough to scan
   quickly, not enough to feel noisy.
3. **Visuals** — two kinds, used for different jobs, both allowed in the
   same file:
   - **Mermaid diagrams** for anything you are explaining yourself:
     architecture, data flow, sequence/timing, state machines. Emojis are
     welcome inside node labels where they aid quick recognition (e.g.
     `📥 Producer`, `🗄️ Broker`, `📤 Consumer`) — use them as visual anchors,
     not decoration on every node.
   - **Real images** for anything better shown than redrawn: official
     architecture diagrams from the project's own docs, real console/UI
     screenshots, published benchmark charts. Search the web for these,
     download them into `assets/` inside the topic folder, and embed them
     with a relative path: `![caption](./assets/broker-topology.png)`.
     Caption every image with its source (e.g. "Source: Apache Kafka
     official docs") directly beneath it. If an image can't be downloaded
     (blocked, paywalled, low quality), link out to it instead of skipping
     the visual entirely, and say so.
   Don't force either kind in — use Mermaid when the diagram doesn't exist
   anywhere and needs to be built, use a real image when a good one already
   exists and redrawing it would lose information.
4. **Working examples** — real, runnable code/config/commands, not
   pseudocode, in the language/tooling most relevant to the topic. Every
   non-trivial concept in this file should be backed by at least one
   concrete example — this is more important than covering more ground.
5. **⚠️ Common pitfalls / misconceptions**
6. **🔀 How it compares to alternatives** (where relevant)
7. **✅ Cheat-sheet / quick reference** at the end
8. Navigation footer: `← Previous | Index | Next →` linking the actual
   files (use their `id`, e.g. `[← Previous](./00-index)`)

## Step 5 — Wrap up
After all files are written, print a short summary in chat: the folder
path, the list of modules, and one suggested starting point. Do not dump the
file contents into chat — the user will read the files directly.

## Notes
- Output is MDX (`.mdx`), not `.md` — the project is a Docusaurus site.
  Keep MDX-safe syntax: no stray `<` or `{` outside code fences (MDX parses
  them as JSX/expressions), and don't rely on raw HTML unless necessary.
- Mermaid rendering in Docusaurus requires `@docusaurus/theme-mermaid`
  enabled in `docusaurus.config.js` (`markdown: { mermaid: true }` and the
  theme added) — mention this once in the top-level summary if it isn't
  already configured, don't assume it silently.
- Emojis: use sparingly and consistently — as section/heading landmarks and
  mnemonic labels, not as line decoration. If in doubt, leave it out.
- Downloading images requires web access and a way to save binary files —
  if that isn't available in this environment, fall back to linking the
  image URL with a note that it couldn't be downloaded locally.
- Keep each module focused — split rather than let one file balloon.
- If the topic has a fast-moving ecosystem (new major versions, breaking
  changes), call that out explicitly in the index so notes don't go stale
  silently.