import Column from './Column';

const COLUMNS = [
  { id: 'todo', name: 'To Do', className: 'column--todo' },
  { id: 'progress', name: 'In Progress', className: 'column--progress' },
  { id: 'done', name: 'Done', className: 'column--done' },
];

export default function Board({
  tasks,
  onDragStart,
  onDragEnd,
  onDrop,
  onDeleteTask,
  draggedTask,
}) {
  return (
    <main className="board" role="region" aria-label="Kanban Board">
      {COLUMNS.map((col) => (
        <Column
          key={col.id}
          id={col.id}
          name={col.name}
          className={col.className}
          tasks={tasks[col.id]}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDrop={onDrop}
          onDeleteTask={onDeleteTask}
          isDragging={!!draggedTask}
        />
      ))}
    </main>
  );
}
