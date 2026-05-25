import React, { useState } from "react";
import { Plus } from "lucide-react";
import TaskItem from "../common/TaskItem";
import AddTaskInline from "../common/AddTaskInline";
import { isToday } from "../../utils/dates";

export default function TodayView({
  tasks,
  loading,
  error,
  onToggle,
  onDelete,
  onAdd,
  projects = [],
  activeProject = null,
}) {
  const [showAdd, setShowAdd] = useState(false);
  const todayTasks = tasks.filter((t) => !t.done && t.dueDate && isToday(t.dueDate));
  const todayDateStr = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Keep "today" in local timezone to avoid UTC date drift.
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return (
    <div className="list-area">
      <section className="today-view">
        <div className="list-header">
          <div>
            <h2>Hôm nay</h2>
            <p className="list-subheader">{todayDateStr}</p>
          </div>
          <span className="task-count">
            {todayTasks.length} công việc
          </span>
        </div>

        {loading && <p className="data-state">Đang tải công việc…</p>}
        {!loading && error && <p className="data-state warning">{error}</p>}

        <div className="task-list">
          {todayTasks.map((t) => (
            <TaskItem key={t._id} task={t} onToggle={onToggle} onDelete={onDelete} />
          ))}
          {!loading && !error && todayTasks.length === 0 && (
            <p className="view-empty-state">Hôm nay không có công việc đến hạn. Chúc bạn một ngày vui!</p>
          )}
        </div>

        {showAdd ? (
          <AddTaskInline
            defaultProject={activeProject?.name || "Inbox"}
            defaultProjectId={activeProject?._id || ""}
            lockProject={Boolean(activeProject)}
            projects={projects}
            onAdd={async (data) => {
              await onAdd({ ...data, dueDate: data.dueDate || todayStr });
              setShowAdd(false);
            }}
            onCancel={() => setShowAdd(false)}
          />
        ) : (
          <button className="ghost-add-task" type="button" onClick={() => setShowAdd(true)}>
            <Plus size={14} /> Thêm công việc
          </button>
        )}
      </section>
    </div>
  );
}
