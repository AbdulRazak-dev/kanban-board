import { useState, useCallback, useEffect, useRef } from 'react';

export default function AddTaskModal({ onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const titleRef = useRef(null);

  // Auto-focus title input on mount
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const trimmedTitle = title.trim();
      if (!trimmedTitle) return;
      onAdd({
        title: trimmedTitle,
        description: description.trim(),
        priority,
      });
    },
    [title, description, priority, onAdd]
  );

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Add new task"
      id="add-task-modal"
    >
      <div className="modal">
        <h2 className="modal-title">Create New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">
              Title *
            </label>
            <input
              ref={titleRef}
              type="text"
              id="task-title"
              className="form-input"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-description">
              Description
            </label>
            <textarea
              id="task-description"
              className="form-textarea"
              placeholder="Add details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-priority">
              Priority
            </label>
            <select
              id="task-priority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              id="cancel-task-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!title.trim()}
              id="submit-task-button"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
