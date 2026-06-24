import { useState, useCallback } from 'react';
import TaskCard from './TaskCard';

export default function Column({
  id,
  name,
  className,
  tasks,
  onDragStart,
  onDragEnd,
  onDrop,
  onDeleteTask,
  isDragging,
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    // Only set false if we're leaving the column itself, not a child
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      onDrop(id);
    },
    [id, onDrop]
  );

  return (
    <section
      className={`column ${className} ${isDragOver ? 'column--drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label={`${name} column`}
      id={`column-${id}`}
    >
      <div className="column-header">
        <div className="column-header-left">
          <div className="column-indicator" />
          <h2 className="column-name">{name}</h2>
        </div>
        <span className="column-count">{tasks.length}</span>
      </div>

      <div className="column-tasks">
        {tasks.length === 0 ? (
          <div className="column-empty">
            <span className="column-empty-icon">
              {id === 'todo' ? '📝' : id === 'progress' ? '⚡' : '✅'}
            </span>
            <span>
              {isDragging ? 'Drop here' : 'No tasks yet'}
            </span>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={id}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </section>
  );
}
