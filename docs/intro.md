---
sidebar_position: 1
id: intro
title: 🚀 Welcome to GnosisEngine
description: AI Notes Engine & Interactive MDX Documentation
---

# 🚀 Welcome to GnosisEngine

**GnosisEngine** is your intelligent, interactive repository designed for generating, viewing, and managing **AI Notes (`.mdx`)** powered by Docusaurus.

:::tip Key Objective

This platform allows you to create AI-generated or custom **.mdx notes** and documentation locally, push them directly to GitHub, and render them with rich UI, dark mode, React components, and dynamic **Mermaid diagrams**.

:::

---

## 🌟 Core Features

- 🧠 **AI Notes Engine**: Dedicated `.mdx` workflow tailored for structured AI note generation and rendering.
- 📐 **Background Grid Canvas**: Designed with a subtle engineering grid background for enhanced reading comfort.
- 🎨 **Modern Aesthetics**: Built with `Plus Jakarta Sans`, `JetBrains Mono`, glassmorphism UI components, and rich color palettes.
- 📊 **Native Mermaid Integration**: Render complex architecture flows, state machines, sequence diagrams, and mind maps directly inside Markdown & MDX.
- 📦 **Skill & Note Pipeline**: Modular organization designed for AI agent skills, MDX components, and GitHub version control.

---

## ⚡ Quick Navigation

| Topic | Description | Link |
| :--- | :--- | :--- |
| **System Architecture** | AI Notes pipeline & Mermaid diagrams | [View Architecture](./system-architecture) |
| **MDX & Mermaid Demo** | Live MDX diagram rendering | [View MDX Demo](./mermaid-mdx-demo) |
| **Skill Creator Guide** | Structure skill & note files | [View Skill Guide](./skill-templates/skill-creator-guide) |

---

## 💻 Example Code Snippet

```typescript
interface AINote {
  id: string;
  title: string;
  category: 'AI-Notes' | 'Architecture' | 'Skills';
  tags: string[];
  lastUpdated: string;
}

const currentNote: AINote = {
  id: 'gnosis-101',
  title: 'GnosisEngine AI Notes Setup',
  category: 'AI-Notes',
  tags: ['docusaurus', 'mdx', 'mermaid', 'gnosisengine'],
  lastUpdated: new Date().toISOString(),
};

console.log(`Loaded AI note in GnosisEngine: ${currentNote.title}`);
```

:::info Pro Tip

You can write any standard GitHub-Flavored Markdown (GFM) file and save it inside the `docs/` directory. The sidebar will auto-generate the navigation structure automatically!

:::
