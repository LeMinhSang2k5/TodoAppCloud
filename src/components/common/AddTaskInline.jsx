import React, { useEffect, useState } from "react";

const INBOX_INTERNAL = "Inbox";
const INBOX_LABEL = "Hộp thư đến";

export default function AddTaskInline({
  onAdd,
  onCancel,
  defaultProject = "Inbox",
  defaultProjectId = "",
  projects = [],
  lockProject = false,
}) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(defaultProjectId || "");
  const [project, setProject] = useState(defaultProject === INBOX_INTERNAL ? INBOX_LABEL : defaultProject);
  const [priority, setPriority] = useState(4);
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const currentProjectName = selectedProjectId
    ? projects.find((p) => p._id === selectedProjectId)?.name || defaultProject || INBOX_INTERNAL
    : project || (defaultProject === INBOX_INTERNAL ? INBOX_LABEL : defaultProject);

  useEffect(() => {
    setSelectedProjectId(defaultProjectId || "");
  }, [defaultProjectId]);

  useEffect(() => {
    setProject(defaultProject === INBOX_INTERNAL ? INBOX_LABEL : (defaultProject || INBOX_LABEL));
  }, [defaultProject]);

  function normalizeProjectName(name) {
    const normalized = (name || "").trim();
    if (!normalized) return INBOX_INTERNAL;
    if (normalized.toLowerCase() === INBOX_LABEL.toLowerCase()) return INBOX_INTERNAL;
    if (normalized.toLowerCase() === INBOX_INTERNAL.toLowerCase()) return INBOX_INTERNAL;
    return normalized;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await onAdd({
        title: title.trim(),
        note: note.trim(),
        project: normalizeProjectName(currentProjectName),
        projectId: selectedProjectId || null,
        priority: Number(priority),
        dueDate: dueDate || null,
        dueTime: dueTime || "",
      });
    } catch (err) {
      setSubmitError(err?.message || "Không thể thêm công việc. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="add-task-inline">
      <form onSubmit={handleSubmit}>
        <input
          className="add-task-title-input"
          type="text"
          placeholder="Tên công việc"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          required
        />
        <input
          className="add-task-note-input"
          type="text"
          placeholder="Mô tả (không bắt buộc)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="add-task-meta-row">
          <input
            type="date"
            className="add-task-field"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            title="Ngày đến hạn"
          />
          <input
            type="time"
            className="add-task-field"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            title="Giờ đến hạn"
          />
          <select
            className="add-task-field"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            title="Mức ưu tiên"
          >
            <option value={1}>P1 - Khẩn cấp</option>
            <option value={2}>P2 - Cao</option>
            <option value={3}>P3 - Trung bình</option>
            <option value={4}>P4 - Thấp</option>
          </select>
          {lockProject ? (
            <input className="add-task-field" type="text" value={currentProjectName} disabled />
          ) : (
            <>
              <select
                className="add-task-field"
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  if (!e.target.value) setProject(INBOX_LABEL);
                }}
                title="Dự án"
              >
                <option value="">Hộp thư đến</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {!selectedProjectId && (
                <input
                  className="add-task-field"
                  type="text"
                  placeholder="Dự án"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                />
              )}
            </>
          )}
        </div>
        {submitError && (
          <p className="data-state warning" style={{ marginTop: 8 }}>
            {submitError}
          </p>
        )}
        <div className="add-task-footer-row">
          <button type="button" className="add-task-cancel" onClick={onCancel}>
            Hủy
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={!title.trim() || submitting}
          >
            {submitting ? "Đang thêm…" : "Thêm công việc"}
          </button>
        </div>
      </form>
    </div>
  );
}
