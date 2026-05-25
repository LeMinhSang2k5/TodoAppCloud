import React from "react";
import TaskItem from "../common/TaskItem";

export default function CompletedView({ tasks, loading, error, onToggle, onDelete }) {
  const doneTasks = [...tasks.filter((t) => t.done)].sort((a, b) => {
    if (!a.completedAt) return 1;
    if (!b.completedAt) return -1;
    return new Date(b.completedAt) - new Date(a.completedAt);
  });

  return (
    <div className="list-area">
      <section className="today-view">
        <div className="list-header">
          <h2>Đã hoàn thành</h2>
          <span className="task-count">
            {doneTasks.length} công việc
          </span>
        </div>

        {loading && <p className="data-state">Đang tải công việc…</p>}
        {!loading && error && <p className="data-state warning">{error}</p>}

        <div className="task-list">
          {doneTasks.map((t) => (
            <TaskItem key={t._id} task={t} onToggle={onToggle} onDelete={onDelete} />
          ))}
          {!loading && !error && doneTasks.length === 0 && (
            <p className="view-empty-state">
              Chưa có công việc nào hoàn thành. Hãy bắt đầu xử lý công việc!
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
