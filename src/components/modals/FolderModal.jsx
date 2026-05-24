import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function FolderModal({ isOpen, onClose, onAdd, defaultType = "personal" }) {
  const [name, setName] = useState("");
  const [type, setType] = useState(defaultType);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) { setName(""); setType(defaultType); setError(""); setSubmitting(false); }
  }, [isOpen, defaultType]);

  if (!isOpen) return null;

  async function handleSubmit() {
    if (!name.trim()) { setError("Folder name is required"); return; }
    setSubmitting(true);
    setError("");
    try {
      await onAdd({ name: name.trim(), type });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create folder");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="overlay" role="presentation" onClick={onClose}>
      <section
        className="modal project-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Add folder"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Add folder</h3>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {error && <p className="project-modal-error">{error}</p>}

        <label className="field-label">
          Folder name
          <input
            type="text"
            className="field-input"
            placeholder="e.g. Design Team"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          />
        </label>

        <label className="field-label">
          Type
          <select className="field-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="personal">Personal</option>
            <option value="team">Team</option>
          </select>
        </label>

        <div className="modal-footer">
          <button type="button" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !name.trim()}
          >
            {submitting ? "Adding…" : "Add folder"}
          </button>
        </div>
      </section>
    </div>
  );
}
