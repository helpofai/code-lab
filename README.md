# Code Lab - Advanced Code Editor & Blog Platform

A powerful, full-stack development workspace and community platform inspired by CodePen, featuring a high-performance code editor, live preview, and a modern rich-text blog system.

## 🚀 Key Features

### 💻 Development Workspace
- **Real-time Monaco Editor**: Experience the full power of VS Code in your browser with IntelliSense and syntax highlighting.
- **Live Preview Sandbox**: Instant, zero-latency rendering of your HTML, CSS, and JavaScript in a secure iframe.
- **Code Formatter**: Built-in **Prettier** integration to beautify your code with a single click.
- **Project Management**: Create, save, edit, and delete "Pens". Supports public and private visibility.
- **Live Sync**: Socket.IO integration for real-time updates and multiplayer potential.
- **Export to ZIP**: Download your projects as a structured ZIP file ready for deployment.

### ✍️ Modern Blog System
- **Tiptap Rich Text Editor**: A professional writing experience with support for bold, italics, headings, and more.
- **Notion-style Menus**:
  - **Bubble Toolbar**: Appears when you select text for quick formatting.
  - **Floating Menu**: Appears on empty lines to quickly add blocks like headings or code.
- **Smart Features**: 
  - **Auto Reading Time**: Automatically calculates estimated reading time.
  - **Tagging System**: Categorize your thoughts with customizable tags.
  - **Responsive Layout**: Optimized reading experience with Tailwind Typography.

### 🛡️ Platform & UX
- **Secure Authentication**: JWT-based login and registration system.
- **Role-based Access**: Custom dashboard access restricted to authenticated users.
- **Modern Dashboard**: Manage all your projects and blog posts in one centralized hub.
- **Theming**: Full Dark and Light mode support with smooth transitions.
- **Responsive UI**: Built with Framer Motion for beautiful, fluid animations.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + @tailwindcss/typography
- **Editor**: Monaco Editor (@monaco-editor/react)
- **Rich Text**: Tiptap Editor (StarterKit, BubbleMenu, FloatingMenu)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Formatting**: Prettier

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize (MySQL)
- **Real-time**: Socket.IO
- **Security**: JWT, BcryptJS
- **Database**: MySQL (Port 3306)

## 📦 Installation & Setup

### 1. Prerequisites
- **Node.js**: v18+ recommended
- **MySQL Server**: Running locally or on a VPS
- **MySQL Configuration**:
  - **DB Name**: `code-lab`
  - **User**: `code-lab`
  - **Password**: `code-lab`

### 2. Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd code-lab

# Install root and workspace dependencies
npm install

# Setup environment variables
# Ensure apps/server/.env contains your JWT_SECRET and DB credentials

# Run development servers (Frontend + Backend)
npm run dev
```

### 3. Accessing the App
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API Health**: [http://localhost:5000/health](http://localhost:5000/health)

## 📂 Project Structure
```text
code-lab/
├── apps/
│   ├── client/         # React + Vite Application
│   │   ├── src/components/ui/      # Custom UI components (Tiptap, etc.)
│   │   ├── src/pages/blog/         # Public blog features
│   │   └── src/services/           # API interaction layer
│   └── server/         # Node.js + Express API
│       ├── src/models/             # Sequelize models (User, Pen, Post)
│       └── src/controllers/        # Business logic
└── packages/           # Shared workspace utilities
```

## 📜 Database Synchronization
The server uses `sequelize.sync()` to automatically create tables. If you update models (e.g., adding columns), the server will ensure the schema is updated safely.

---

Built with ❤️ by the CodeLab Team.