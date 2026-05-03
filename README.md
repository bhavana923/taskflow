# TaskFlow 🟢

A multi-user task management app built with React — an internship project showcasing full-stack-like features with just the frontend.

## 🚀 Features

- **Multi-user authentication** — sign up / log in, demo accounts included
- **Kanban board** — drag-and-drop tasks across To Do / In Progress / Done
- **Dashboard** — stats, progress bar, team overview
- **Task details** — edit, comment, assign, tag, set priority & due dates
- **Team page** — see each member's workload and completion rate
- **Persistent state** — all data saved to localStorage (no backend needed!)
- **Beautiful dark UI** — custom design system with lime + violet accent palette

## 🧪 Demo Accounts

| Name | Email | Password |
|------|-------|----------|
| Aanya Sharma | aanya@taskflow.app | demo123 |
| Rohan Mehta | rohan@taskflow.app | demo123 |
| Priya Nair | priya@taskflow.app | demo123 |

Or create your own account from the Sign Up page!

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Opens at [http://localhost:3000](http://localhost:3000)

## 📦 Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: Vercel Dashboard
1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Framework preset: **Create React App**
5. Click **Deploy**

`vercel.json` is already configured for client-side routing.

## 🏗️ Project Structure

```
src/
├── context/
│   ├── AuthContext.js     # Multi-user auth (localStorage)
│   └── TaskContext.js     # Task CRUD + state management
├── components/
│   ├── Navbar.js          # Sticky navigation bar
│   ├── TaskModal.js       # Create task modal
│   ├── TaskDetailModal.js # View/edit/comment on tasks
│   └── ProtectedRoute.js  # Route guard for auth
├── pages/
│   ├── Home.js            # Landing page
│   ├── Login.js           # Sign in
│   ├── Signup.js          # Register
│   ├── Dashboard.js       # Stats + task list
│   ├── Board.js           # Kanban board (drag & drop)
│   └── Team.js            # Team members & workload
├── App.js                 # Router + providers
└── index.css              # Global design tokens & styles
```

## 🎨 Tech Stack

- **React 18** — hooks, context API, functional components
- **React Router v6** — client-side routing
- **UUID** — unique IDs for tasks/comments
- **localStorage** — persistence (no backend!)
- **Google Fonts** — Syne (display) + DM Sans (body)
- **CSS custom properties** — design token system
- **HTML5 Drag and Drop API** — Kanban drag & drop

## 📖 Key Concepts Demonstrated

- Context API for global state (Auth + Tasks)
- Custom hooks pattern
- Protected routes
- Drag and drop interactions
- CRUD operations
- Component composition
- Responsive design

---

Built with ❤️ as an internship project. Feel free to fork and extend!
