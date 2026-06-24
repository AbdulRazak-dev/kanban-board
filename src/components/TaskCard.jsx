import { useState, useCallback } from 'react';

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export default function TaskCard({ task, columnId, onDragStart, onDragEnd, onDelete }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback(
    (e) => {
      // Set drag data for accessibility / inter-widget compat
      e.dataTransfer.setData('text/plain', task.id);
      e.dataTransfer.effectAllowed = 'move';

      // Notify parent
      onDragStart(task, columnId);
      // Delay setting visual state so the drag image captures the non-faded card
      requestAnimationFrame(() => {
        setIsDragging(true);
      });
    },
    [task, columnId, onDragStart]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    onDragEnd();
  }, [onDragEnd]);

  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      onDelete(columnId, task.id);
    },
    [columnId, task.id, onDelete]
  );

  return (
    <article
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      id={`task-${task.id}`}
      aria-label={`Task: ${task.title}`}
    >
      <div className="task-card-header">
        <h3 className="task-card-title">{task.title}</h3>
        <button
          className="task-card-delete"
          onClick={handleDelete}
          aria-label={`Delete task: ${task.title}`}
          title="Delete task"
        >
          ✕
        </button>
      </div>

      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}

      <div className="task-card-footer">
        <span className={`task-card-priority priority-${task.priority}`}>
          {task.priority}
        </span>
        <span className="task-card-date">{formatDate(task.createdAt)}</span>
      </div>
    </article>
  );
}
