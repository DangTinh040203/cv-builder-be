# CV Builder - Backend Documentation

> AI-powered CV Builder with Mock Interview capabilities

## Overview

**CV Builder** is a comprehensive platform that provides CV templates for users to create professional resumes.

### Key Features

- 🎨 **CV Templates** - Professional, customizable CV templates
- 🤖 **AI Integration** - AI-powered suggestions and UI modifications
- 🎤 **Mock Interview** - AI-driven mock interviews via voice/video

## Tech Stack

| Layer              | Technologies        |
| ------------------ | ------------------- |
| **Frontend**       | Next.js, Turborepo  |
| **Backend**        | NestJS, Nx Monorepo |
| **Database**       | PostgreSQL          |
| **Cache**          | Redis               |
| **Storage**        | MinIO               |
| **Auth**           | Keycloak            |
| **Message Broker** | NATS                |

## Architecture

### Domain Services

```text
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                      │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway                                   │
│  • Authentication & Authorization (Keycloak)                    │
│  • Request routing to internal services                         │
│  • Data aggregation                                             │
│  • Rate limiting                                                │
└─────────────────────────────┬───────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ User Service  │    │Resume Service │    │Interview Svc  │
│  • Profile    │    │  • CRUD CV    │    │  • Sessions   │
│  • Sync from  │    │  • Templates  │    │  • Scoring    │
│    Keycloak   │    │  • Export PDF │    │  • Voice/Video│
│  • Portfolio  │    │  • Versioning │    │  • WebRTC     │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI Gateway Service                         │
│  • LLM Wrapper (OpenAI, Anthropic, Gemini)                     │
│  • Prompt Templates                                             │
│  • Context Management                                           │
│  • BullMQ for async processing                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        ▼                                           ▼
┌───────────────┐                          ┌───────────────┐
│Storage Service│                          │Notification   │
│  • MinIO      │                          │  Service      │
│  • Presigned  │                          │  • Email      │
│    URLs       │                          │  • Realtime   │
└───────────────┘                          └───────────────┘
```

### Service Responsibilities

| Service                  | Responsibilities                                                 |
| ------------------------ | ---------------------------------------------------------------- |
| **API Gateway**          | Entry point, auth, routing, data aggregation, rate limiting      |
| **User Service**         | Sync Keycloak users, extended profile data, portfolio management |
| **Resume Service**       | CV CRUD, templates, PDF export (Puppeteer), version history      |
| **AI Gateway**           | LLM wrapper, prompt management, context handling, async queue    |
| **Interview Service**    | Session management, Q&A logs, scoring, WebRTC signaling, STT/TTS |
| **Storage Service**      | MinIO wrapper, file upload/download, presigned URLs              |
| **Notification Service** | Email notifications, realtime events via NATS                    |

## Quick Links

- [Getting Started](getting-started.md) - Quick start guide
- [Folder Structure](folder-structure.md) - Project folder structure
- [Code Conventions](code-conventions.md) - Coding conventions and standards
