import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import TaskItem from "../common/TaskItem";
import AddTaskInline from "../common/AddTaskInline";

export default function InboxView({
  tasks,
  loading,
  error,
  onToggle,
  onDelete,
  onAdd,
  projects = [],
  projectMode = false,
  projectName = "",
  projectId = "",
}) {
  const [showAdd, setShowAdd] = useState(false);
  const inboxTasks = useMemo(() => {
    if (projectMode) return tasks.filter((t) => !t.done);
    return tasks.filter((t) => !t.done && (t.project === "Inbox" || !t.project));
  }, [tasks, projectMode]);

  return (
    <div className="list-area">
      <section className="today-view">
        <div className="list-header">
          <h2>{projectMode ? projectName : "Hộp thư đến"}</h2>
          <span className="task-count">
            {inboxTasks.length} công việc
          </span>
        </div>

        {loading && <p className="data-state">Đang tải công việc…</p>}
        {!loading && error && <p className="data-state warning">{error}</p>}

        <div className="task-list">
          {inboxTasks.map((t) => (
            <TaskItem key={t._id} task={t} onToggle={onToggle} onDelete={onDelete} />
          ))}
          {!loading && !error && inboxTasks.length === 0 && (
            <p className="view-empty-state">Hộp thư đến đang trống. Hãy thêm công việc để bắt đầu!</p>
          )}
        </div>

        {showAdd ? (
          <AddTaskInline
            defaultProject={projectMode ? projectName : "Inbox"}
            defaultProjectId={projectMode ? projectId : ""}
            lockProject={projectMode}
            projects={projects}
            onAdd={async (data) => {
              await onAdd(data);
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
