import React from "react";
import { Calendar, Hash, MessageCircle, Plus } from "lucide-react";

export default function ListView({
  tasks,
  selectedTask,
  onSelectTask,
  isLoading = false,
  errorMessage = "",
}) {
  const pendingCount = tasks.filter((task) => !task.done).length;

  return (
    <div className="list-area">
      <section className="today-view">
        <div className="list-header">
          <h2>Today</h2>
          <span className="task-count">
            {pendingCount} task{pendingCount !== 1 ? "s" : ""}
          </span>
        </div>

        {isLoading && <p className="data-state">Loading tasks from MongoDB...</p>}
        {!isLoading && errorMessage && <p className="data-state warning">{errorMessage}</p>}

        <div className="task-list">
          {tasks.map((task) => (
            <button
              key={task.id}
              className={`task-item ${selectedTask === task.id ? "selected" : ""}`}
              type="button"
              onClick={() => onSelectTask(task.id)}
            >
              <span className={`checkbox ${task.done ? "done" : ""}`} aria-hidden="true" />
              <div className="task-copy">
                <p className={task.done ? "strikethrough" : ""}>{task.title}</p>
                <small>{task.note}</small>
                <div className="meta-row">
                  {task.time && (
                    <span className={`meta-chip ${task.overdue ? "chip-red" : ""}`}>
                      <Calendar size={10} /> {task.time}
                    </span>
                  )}
                  {task.tag && (
                    <span className="meta-chip">
                      <Hash size={10} /> {task.tag}
                    </span>
                  )}
                  {task.comments > 0 && (
                    <span className="meta-chip">
                      <MessageCircle size={10} /> {task.comments}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <button className="ghost-add-task" type="button">
          <Plus size={14} /> Add task
        </button>
      </section>
    </div>
  );
}
