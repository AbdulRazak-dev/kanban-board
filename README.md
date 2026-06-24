# 📋 Kanban Board — Drag & Drop Task Management

A visually stunning, fully functional Kanban board built with **React** and **Vite**. Features smooth drag-and-drop between columns, localStorage persistence, and a premium dark glassmorphism design.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **Three Columns**: "To Do", "In Progress", and "Done" — a classic Kanban workflow
- **Drag & Drop**: Seamlessly move cards between columns using the HTML5 Drag and Drop API
- **Task Creation**: Create cards with title, description, and priority level (Low / Medium / High)
- **Persistent State**: Board state automatically saved to `localStorage` and restored on page load
- **Responsive Design**: Works on desktop, tablet, and mobile layouts
- **Premium UI**: Dark glassmorphism theme with smooth animations and micro-interactions

---

## 🚀 Running Locally

### Prerequisites

- **Node.js** 18+ and **npm** 9+

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/kanban-board.git
cd kanban-board

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Building for Production

```bash
npm run build
npm run preview   # Preview the production build locally
```

---

## 🔧 Implementation Details

### Drag-and-Drop

The drag-and-drop system uses the **HTML5 Drag and Drop API** — no external libraries required.

**How it works:**

1. **`onDragStart`** (TaskCard): When a user grabs a card, `e.dataTransfer.setData()` stores the task ID and `effectAllowed` is set to `'move'`. The parent `App` component receives the dragged task reference and its source column via state.

2. **`onDragOver`** (Column): Each column acts as a drop target. `e.preventDefault()` allows the drop and triggers a visual glow effect (column border + background change).

3. **`onDrop`** (Column): When a card is dropped, the `App` component:
   - Removes the task from the source column's array
   - Appends it to the target column's array
   - Updates state, which triggers a `useEffect` to persist to localStorage

4. **`onDragEnd`** (TaskCard): Resets all drag visual states regardless of whether the drop succeeded.

**Visual Feedback:**
- Source card fades to 40% opacity and rotates slightly
- Target column gets a colored glow border matching its theme (blue for To Do, amber for In Progress, green for Done)
- Empty columns show "Drop here" text during an active drag

### State Persistence

State is managed with React's `useState` hook and persisted using a `useEffect` that watches for changes:

```jsx
// Load: runs once on mount (lazy initializer)
const [tasks, setTasks] = useState(() => {
  const stored = localStorage.getItem('kanban-board-state');
  return stored ? JSON.parse(stored) : DEFAULT_TASKS;
});

// Save: runs on every state change
useEffect(() => {
  localStorage.setItem('kanban-board-state', JSON.stringify(tasks));
}, [tasks]);
```

The data structure is a simple object with three arrays:
```json
{
  "todo": [{ "id": "...", "title": "...", "description": "...", "priority": "...", "createdAt": "..." }],
  "progress": [...],
  "done": [...]
}
```

---

## 🎨 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **HTML5 DnD API** (no library) | Zero-dependency approach; native browser support; sufficient for 3-column boards |
| **Vanilla CSS** (no Tailwind) | Full control over glassmorphism effects, custom animations, and design tokens |
| **React `useState`** (no Redux) | Flat, simple state shape doesn't warrant a state management library |
| **Lazy state initializer** | Avoids parsing localStorage on every render; only runs on mount |
| **CSS custom properties** | Centralized design tokens for easy theming and consistency |
| **Dark glassmorphism theme** | Modern, premium aesthetic with frosted-glass surfaces and subtle gradients |
| **Emoji icons** | No icon library dependency; universal cross-platform support |

---

## 🔮 Potential Improvements

With more time, these enhancements would significantly improve the project:

- **Within-column reordering**: Allow dragging cards to reorder within the same column
- **Touch support**: Add `touchstart`/`touchmove`/`touchend` handlers for full mobile drag support
- **Task editing**: Click a card to open an edit modal and update title/description/priority
- **Due dates**: Add date picker and display overdue indicators
- **Subtasks/checklists**: Nested to-do items within each card
- **Multi-board support**: Create and switch between multiple boards
- **Search & filter**: Filter tasks by priority or search by title
- **Undo/redo**: Track action history for undoing accidental deletions or moves
- **Backend sync**: Replace localStorage with a real database (Supabase, Firebase) for multi-device access
- **Animations**: Use Framer Motion for physics-based drag animations and layout transitions
- **Accessibility**: Full keyboard DnD support using `aria-grabbed`, `aria-dropeffect`, and keyboard handlers
- **Dark/Light toggle**: Theme switching with system preference detection

---

## 📦 Tech Stack

- **React 19** — Component-based UI
- **Vite 8** — Fast build tool and dev server
- **Vanilla CSS** — Custom design system with CSS custom properties
- **localStorage** — Browser-native persistence
- **HTML5 Drag & Drop API** — Native drag-and-drop

---

## 🚢 Deployment

This project is configured for **Vercel**:

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Vercel auto-detects Vite and deploys — no additional config needed

A `vercel.json` is included for explicit configuration.

---

## 📄 License

MIT
