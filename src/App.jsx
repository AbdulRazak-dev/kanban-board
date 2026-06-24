import { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import AddTaskModal from './components/AddTaskModal';

const STORAGE_KEY = 'kanban-board-state';

const DEFAULT_TASKS = {
  todo: [
    {
      id: 'demo-1',
      title: 'Design system architecture',
      description: 'Plan the overall structure and component hierarchy for the project.',
      priority: 'high',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      title: 'Set up development environment',
      description: 'Install dependencies and configure tooling.',
      priority: 'medium',
      createdAt: new Date().toISOString(),
    },
  ],
  progress: [
    {
      id: 'demo-3',
      title: 'Implement drag-and-drop',
      description: 'Build the core DnD functionality using HTML5 API.',
      priority: 'high',
      createdAt: new Date().toISOString(),
    },
  ],
  done: [
    {
      id: 'demo-4',
      title: 'Project initialization',
      description: 'Create the repo and initial project setup.',
      priority: 'low',
      createdAt: new Date().toISOString(),
    },
  ],
};

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate structure
      if (parsed.todo && parsed.progress && parsed.done) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load tasks from localStorage:', e);
  }
  return DEFAULT_TASKS;
}

function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn('Failed to save tasks to localStorage:', e);
  }
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragSourceColumn, setDragSourceColumn] = useState(null);

  // Persist to localStorage whenever tasks change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const handleAddTask = useCallback((newTask) => {
    const task = {
      ...newTask,
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => ({
      ...prev,
      todo: [...prev.todo, task],
    }));
    setIsModalOpen(false);
  }, []);

  const handleDeleteTask = useCallback((columnId, taskId) => {
    setTasks((prev) => ({
      ...prev,
      [columnId]: prev[columnId].filter((t) => t.id !== taskId),
    }));
  }, []);

  const handleDragStart = useCallback((task, columnId) => {
    setDraggedTask(task);
    setDragSourceColumn(columnId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedTask(null);
    setDragSourceColumn(null);
  }, []);

  const handleDrop = useCallback(
    (targetColumnId) => {
      if (!draggedTask || !dragSourceColumn) return;
      if (dragSourceColumn === targetColumnId) return;

      setTasks((prev) => {
        const sourceList = prev[dragSourceColumn].filter(
          (t) => t.id !== draggedTask.id
        );
        const targetList = [...prev[targetColumnId], draggedTask];
        return {
          ...prev,
          [dragSourceColumn]: sourceList,
          [targetColumnId]: targetList,
        };
      });

      setDraggedTask(null);
      setDragSourceColumn(null);
    },
    [draggedTask, dragSourceColumn]
  );

  const totalTasks =
    tasks.todo.length + tasks.progress.length + tasks.done.length;

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <div className="header-logo" aria-hidden="true">📋</div>
          <div>
            <h1 className="header-title">Kanban Board</h1>
            <p className="header-subtitle">Organize your workflow</p>
          </div>
        </div>
        <button
          className="btn-add-task"
          onClick={() => setIsModalOpen(true)}
          id="add-task-button"
        >
          <span className="icon">+</span>
          New Task
        </button>
      </header>

      <div className="stats-bar">
        <div className="stat-item">
          📊 Total <span className="stat-value">{totalTasks}</span>
        </div>
        <div className="stat-item">
          🔵 To Do <span className="stat-value">{tasks.todo.length}</span>
        </div>
        <div className="stat-item">
          🟡 In Progress{' '}
          <span className="stat-value">{tasks.progress.length}</span>
        </div>
        <div className="stat-item">
          🟢 Done <span className="stat-value">{tasks.done.length}</span>
        </div>
      </div>

      <Board
        tasks={tasks}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        onDeleteTask={handleDeleteTask}
        draggedTask={draggedTask}
      />

      {isModalOpen && (
        <AddTaskModal
          onAdd={handleAddTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
