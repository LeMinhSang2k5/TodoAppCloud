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
    if (!name.trim()) { setError("Tên thư mục là bắt buộc"); return; }
    setSubmitting(true);
    setError("");
    try {
      await onAdd({ name: name.trim(), type });
      onClose();
    } catch (err) {
      setError(err.message || "Tạo thư mục thất bại");
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
        aria-label="Thêm thư mục"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Thêm thư mục</h3>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        {error && <p className="project-modal-error">{error}</p>}

        <label className="field-label">
          Tên thư mục
          <input
            type="text"
            className="field-input"
            placeholder="Ví dụ: Nhóm thiết kế"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          />
        </label>

        <label className="field-label">
          Loại
          <select className="field-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="personal">Cá nhân</option>
            <option value="team">Nhóm</option>
          </select>
        </label>

        <div className="modal-footer">
          <button type="button" onClick={onClose}>Hủy</button>
          <button
            className="btn-primary"
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !name.trim()}
          >
            {submitting ? "Đang thêm…" : "Thêm thư mục"}
          </button>
        </div>
      </section>
    </div>
  );
}
