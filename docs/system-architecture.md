---
sidebar_position: 2
id: system-architecture
title: 🧠 System Architecture & Workflow
description: Visualizing the Self-Study pipeline and GitHub sync using Mermaid diagrams.
---

# 🧠 System Architecture & Workflow

This page demonstrates the interactive rendering capabilities of **GnosisEngine**, showcasing how **AI Notes (`.mdx`)**, Skill Files, Markdown documentation, and GitHub synchronization work together seamlessly.

---

## 🔄 AI Notes Lifecycle Flowchart

Below is a live **Mermaid Flowchart** illustrating the step-by-step lifecycle from creating a local AI note file to rendering it on your Docusaurus documentation site.

```mermaid
graph TD
    A[✍️ AI Notes / .mdx File] -->|Edit MDX & Markdown| B[📂 docs/ Directory]
    B -->|Git Commit & Push| C[🐙 GitHub Repository]
    C -->|Trigger GitHub Action| D[⚙️ Build & Validate Site]
    D -->|Deploy Static Site| E[🌐 GnosisEngine Web Application]
    
    subgraph GnosisEngine Features
        E --> F[📊 Interactive Mermaid Diagrams]
        E --> G[🌙 Dark / Light Mode Toggle]
        E --> H[🔍 Full-text Search & Navigation]
    end

    style A fill:#6366f1,stroke:#4338ca,color:#fff,stroke-width:2px
    style C fill:#2563eb,stroke:#1d4ed8,color:#fff,stroke-width:2px
    style E fill:#059669,stroke:#047857,color:#fff,stroke-width:2px
```

---

## ⚡ Skill Execution Sequence Diagram

Here is a **Mermaid Sequence Diagram** showing how AI agents or self-study workflows interact with the repository:

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Learner / Developer
    participant AGY as 🤖 Agent / Gnosis Engine
    participant Git as 🐙 GitHub Repo
    participant Doc as 📘 GnosisEngine Docusaurus

    User->>AGY: Request new AI Note / Skill file
    AGY->>AGY: Generate MDX & Mermaid schema
    AGY->>Git: Push `docs/notes/my-note.mdx`
    Git->>Doc: Trigger Automatic Web Build
    Doc-->>User: Rendered interactive documentation page
```

---

## 📑 Component Class Structure

```mermaid
classDiagram
    class GnosisEngine {
        +String title
        +String tagline
        +ThemeConfig theme
        +buildSite()
        +renderMermaid()
    }
    class AINote {
        +String id
        +String title
        +String description
        +List~String~ content
        +toMDX()
    }
    class GitHubSync {
        +String repoUrl
        +String branch
        +pushChanges()
    }

    GnosisEngine "1" *-- "many" AINote : renders
    AINote ..> GitHubSync : synchronized via
```

---

## 📋 Summary of Architecture

:::note Key Takeaway

By combining **Docusaurus**, **Mermaid**, and **GitHub**, you get:
1. Version-controlled knowledge management.
2. Zero-friction visual diagrams embedded directly in text.
3. Production-ready web interface with grid background aesthetics.

:::
