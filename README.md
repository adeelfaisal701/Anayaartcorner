# Anaya Art Gallery

Premium Art Gallery & Custom Portraits — Frontend Website.

This project is a standalone, client-side Next.js web application. It allows users to browse custom portrait categories, featured paintings, and pricing. All contact and order inquiries are submitted directly via WhatsApp redirect messages or email links, eliminating the need for a database or backend server.

## Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS / Vanilla CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Toasts**: Sonner

## Prerequisites

- Node.js 20+
- npm

## Getting Started

### 1. Installation

Navigate to the `frontend/` directory and install the dependencies:

```bash
cd frontend
npm install
```

### 2. Configuration

Create a `.env.local` file inside the `frontend/` directory:

```bash
cp .env.example .env.local
```

### 3. Run Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build for Production

To build the project for production:

```bash
npm run build
```

This will output a optimized, production-ready bundle.
