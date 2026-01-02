
i want to build codepen clone, Recommended Tech Stack 
🌐 Frontend

React + Vite → fast, modern UI

Monaco Editor → VS Code-level editor experience

iframe sandbox → secure live preview

Tailwind CSS → quick, clean UI styling

Zustand → simple state management

🖥 Backend

Node.js + Express

Socket.IO → live sync / autosave

JWT Authentication

PM2 → keep backend running on VPS . 

use mysql database: db-name=code-lab, db-user=code-lab, db-pass=code-lab.


code-lab/
│
├── apps/
│   ├── client/                    # Frontend (React + Vite)
│   │   ├── public/
│   │   │   └── index.html
│   │   │
│   │   ├── src/
│   │   │   ├── assets/             # Images, icons, fonts
│   │   │   ├── components/
│   │   │   │   ├── editor/
│   │   │   │   │   ├── MonacoEditor.jsx
│   │   │   │   │   ├── EditorTabs.jsx
│   │   │   │   │   └── EditorToolbar.jsx
│   │   │   │   │
│   │   │   │   ├── preview/
│   │   │   │   │   ├── IframePreview.jsx
│   │   │   │   │   └── PreviewErrorBoundary.jsx
│   │   │   │   │
│   │   │   │   ├── layout/
│   │   │   │   │   ├── Navbar.jsx
│   │   │   │   │   ├── Sidebar.jsx
│   │   │   │   │   └── SplitPane.jsx
│   │   │   │   │
│   │   │   │   └── ui/              # Buttons, Modals, Dropdowns
│   │   │   │       ├── Button.jsx
│   │   │   │       ├── Modal.jsx
│   │   │   │       └── Tooltip.jsx
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Editor.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Profile.jsx
│   │   │   │
│   │   │   ├── store/               # Zustand
│   │   │   │   ├── authStore.js
│   │   │   │   ├── editorStore.js
│   │   │   │   └── settingsStore.js
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── api.js            # Axios config
│   │   │   │   ├── socket.js         # Socket.IO client
│   │   │   │   └── authService.js
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── debounce.js
│   │   │   │   ├── sandbox.js        # iframe isolation helpers
│   │   │   │   └── formatCode.js
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useSocket.js
│   │   │   │   ├── useAutosave.js
│   │   │   │   └── useAuth.js
│   │   │   │
│   │   │   ├── styles/
│   │   │   │   └── globals.css
│   │   │   │
│   │   │   ├── App.jsx
│   │   │   ├── main.jsx
│   │   │   └── router.jsx
│   │   │
│   │   ├── tailwind.config.js
│   │   ├── postcss.config.js
│   │   ├── vite.config.js
│   │   └── package.json
│   │
│   ├── server/                      # Backend (Node + Express)
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   ├── db.js
│   │   │   │   ├── jwt.js
│   │   │   │   └── socket.js
│   │   │   │
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── pen.controller.js
│   │   │   │   └── user.controller.js
│   │   │   │
│   │   │   ├── models/
│   │   │   │   ├── User.model.js
│   │   │   │   └── Pen.model.js
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.js
│   │   │   │   ├── pen.routes.js
│   │   │   │   └── user.routes.js
│   │   │   │
│   │   │   ├── middlewares/
│   │   │   │   ├── auth.middleware.js
│   │   │   │   ├── error.middleware.js
│   │   │   │   └── rateLimit.middleware.js
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── socket.service.js
│   │   │   │   ├── pen.service.js
│   │   │   │   └── auth.service.js
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── logger.js
│   │   │   │   └── sanitize.js
│   │   │   │
│   │   │   ├── app.js
│   │   │   ├── server.js
│   │   │   └── socketServer.js
│   │   │
│   │   ├── ecosystem.config.js      # PM2
│   │   ├── package.json
│   │   └── .env
│
├── packages/                        # Shared (optional but recommended)
│   ├── shared-types/
│   │   ├── pen.js
│   │   └── user.js
│   │
│   └── shared-utils/
│       ├── debounce.js
│       └── validators.js
│
├── .env
├── .env.example                   # Example env file
├── package.json                     # Root scripts
├── README.md
└──                                # docker-compose.yml (optional)
