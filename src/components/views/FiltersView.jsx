import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import TaskItem from "../common/TaskItem";
import AddTaskInline from "../common/AddTaskInline";

const PRIORITIES = [
  { value: 1, label: "Ưu tiên 1 - Khẩn cấp", color: "#d1453b" },
  { value: 2, label: "Ưu tiên 2 - Cao", color: "#eb8909" },
  { value: 3, label: "Ưu tiên 3 - Trung bình", color: "#246fe0" },
  { value: 4, label: "Ưu tiên 4 - Thấp", color: "#8b8b8b" },
];

export default function FiltersView({
  tasks,
  loading,
  error,
  onToggle,
  onDelete,
  onAdd,
  projects = [],
  activeProject = null,
}) {
  const [activeFilter, setActiveFilter] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const allLabels = useMemo(() => {
    const set = new Set();
    tasks.forEach((t) => t.labels?.forEach((l) => set.add(l)));
    return [...set].sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const base = tasks.filter((t) => !t.done);
    if (!activeFilter) return base;
    if (activeFilter.type === "label")
      return base.filter((t) => t.labels?.includes(activeFilter.value));
    if (activeFilter.type === "priority")
      return base.filter((t) => t.priority === activeFilter.value);
    return base;
  }, [tasks, activeFilter]);

  function selectFilter(type, value) {
    setActiveFilter((prev) =>
      prev?.type === type && prev?.value === value ? null : { type, value }
    );
  }

  const filterTitle = activeFilter
    ? activeFilter.type === "label"
      ? `# ${activeFilter.value}`
      : PRIORITIES.find((p) => p.value === activeFilter.value)?.label || "Đã lọc"
    : "Tất cả công việc đang hoạt động";

  return (
    <div className="filters-shell">
      <aside className="filters-sidebar">
        <p className="filters-section-title">Bộ lọc</p>
        <button
          className={`filter-btn ${!activeFilter ? "active" : ""}`}
          type="button"
          onClick={() => setActiveFilter(null)}
        >
          Tất cả đang hoạt động
        </button>

        <p className="filters-section-title filters-section-title-gap">Mức ưu tiên</p>
        {PRIORITIES.map((p) => (
          <button
            key={p.value}
            className={`filter-btn ${
              activeFilter?.type === "priority" && activeFilter.value === p.value ? "active" : ""
            }`}
            type="button"
            onClick={() => selectFilter("priority", p.value)}
          >
            <span className="filter-priority-dot" style={{ background: p.color }} />
            {p.label}
          </button>
        ))}

        {allLabels.length > 0 && (
          <>
            <p className="filters-section-title filters-section-title-gap">Nhãn</p>
            {allLabels.map((label) => (
              <button
                key={label}
                className={`filter-btn ${
                  activeFilter?.type === "label" && activeFilter.value === label ? "active" : ""
                }`}
                type="button"
                onClick={() => selectFilter("label", label)}
              >
                # {label}
              </button>
            ))}
          </>
        )}

        {allLabels.length === 0 && (
          <p className="filters-empty-labels">Chưa có nhãn. Hãy thêm nhãn khi tạo công việc.</p>
        )}
      </aside>

      <div className="filters-main">
        <div className="list-header">
          <h2>{filterTitle}</h2>
          <span className="task-count">
            {filteredTasks.length} công việc
          </span>
        </div>

        {loading && <p className="data-state">Đang tải công việc…</p>}
        {!loading && error && <p className="data-state warning">{error}</p>}

        <div className="task-list">
          {filteredTasks.map((t) => (
            <TaskItem key={t._id} task={t} onToggle={onToggle} onDelete={onDelete} />
          ))}
          {!loading && !error && filteredTasks.length === 0 && (
            <p className="view-empty-state">Không có công việc nào khớp bộ lọc này.</p>
          )}
        </div>

        {showAdd ? (
          <AddTaskInline
            defaultProject={activeProject?.name || "Inbox"}
            defaultProjectId={activeProject?._id || ""}
            lockProject={Boolean(activeProject)}
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
      </div>
    </div>
  );
}
