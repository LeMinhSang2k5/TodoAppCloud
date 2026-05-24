import React, { useEffect, useState } from "react";

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
  const [project, setProject] = useState(defaultProject);
  const [priority, setPriority] = useState(4);
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const currentProjectName = selectedProjectId
    ? projects.find((p) => p._id === selectedProjectId)?.name || defaultProject || "Inbox"
    : project || "Inbox";

  useEffect(() => {
    setSelectedProjectId(defaultProjectId || "");
  }, [defaultProjectId]);

  useEffect(() => {
    setProject(defaultProject || "Inbox");
  }, [defaultProject]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onAdd({
        title: title.trim(),
        note: note.trim(),
        project: currentProjectName,
        projectId: selectedProjectId || null,
        priority: Number(priority),
        dueDate: dueDate || null,
        dueTime: dueTime || "",
      });
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
          placeholder="Task name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          required
        />
        <input
          className="add-task-note-input"
          type="text"
          placeholder="Description (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="add-task-meta-row">
          <input
            type="date"
            className="add-task-field"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            title="Due date"
          />
          <input
            type="time"
            className="add-task-field"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            title="Due time"
          />
          <select
            className="add-task-field"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            title="Priority"
          >
            <option value={1}>P1 – Urgent</option>
            <option value={2}>P2 – High</option>
            <option value={3}>P3 – Medium</option>
            <option value={4}>Priority</option>
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
                  if (!e.target.value) setProject("Inbox");
                }}
                title="Project"
              >
                <option value="">Inbox</option>
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
                  placeholder="Project"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                />
              )}
            </>
          )}
        </div>
        <div className="add-task-footer-row">
          <button type="button" className="add-task-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={!title.trim() || submitting}
          >
            {submitting ? "Adding…" : "Add task"}
          </button>
        </div>
      </form>
    </div>
  );
}
