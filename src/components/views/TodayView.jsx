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
  const todayDateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="list-area">
      <section className="today-view">
        <div className="list-header">
          <div>
            <h2>Today</h2>
            <p className="list-subheader">{todayDateStr}</p>
          </div>
          <span className="task-count">
            {todayTasks.length} task{todayTasks.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading && <p className="data-state">Loading tasks…</p>}
        {!loading && error && <p className="data-state warning">{error}</p>}

        <div className="task-list">
          {todayTasks.map((t) => (
            <TaskItem key={t._id} task={t} onToggle={onToggle} onDelete={onDelete} />
          ))}
          {!loading && !error && todayTasks.length === 0 && (
            <p className="view-empty-state">No tasks due today. Enjoy your day!</p>
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
            <Plus size={14} /> Add task
          </button>
        )}
      </section>
    </div>
  );
}
