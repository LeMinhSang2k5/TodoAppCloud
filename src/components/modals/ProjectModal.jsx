import React, { useState } from "react";
import { Calendar, LayoutGrid, List, X } from "lucide-react";

const COLOR_OPTIONS = [
  { name: "Violet", label: "Tím", hex: "#7b68ee" },
  { name: "Red", label: "Đỏ", hex: "#e44332" },
  { name: "Sky", label: "Xanh da trời", hex: "#4a9fe5" },
  { name: "Green", label: "Xanh lá", hex: "#3aab7b" },
  { name: "Orange", label: "Cam", hex: "#eb8909" },
  { name: "Yellow", label: "Vàng", hex: "#ffc107" },
  { name: "Pink", label: "Hồng", hex: "#e91e63" },
  { name: "Teal", label: "Xanh ngọc", hex: "#009688" },
];

export default function ProjectModal({ isOpen, onClose, onAdd, folders = [], defaultType = "personal", defaultFolderId = "" }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("Violet");
  const [view, setView] = useState("list");
  const [type, setType] = useState(defaultType);
  const [folderId, setFolderId] = useState(defaultFolderId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const selectedColor = COLOR_OPTIONS.find((c) => c.name === color) || COLOR_OPTIONS[0];

  function resetForm() {
    setName("");
    setColor("Violet");
    setView("list");
    setType(defaultType);
    setFolderId(defaultFolderId);
    setError("");
    setSubmitting(false);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit() {
    if (!name.trim()) { setError("Tên dự án là bắt buộc"); return; }
    setSubmitting(true);
    setError("");
    try {
      await onAdd({ name: name.trim(), color, view, type, folderId: folderId || null });
      resetForm();
      onClose();
    } catch (err) {
      setError(err.message || "Tạo dự án thất bại");
    } finally {
      setSubmitting(false);
    }
  }

  const filteredFolders = folders.filter((f) => f.type === type);

  return (
    <div className="overlay" role="presentation" onClick={handleClose}>
      <section
        className="modal project-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Thêm dự án"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Thêm dự án</h3>
          <button className="icon-btn" type="button" onClick={handleClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        {error && <p className="project-modal-error">{error}</p>}

        <label className="field-label">
          Tên
          <input
            type="text"
            className="field-input"
            placeholder="Nhập tên dự án"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          />
        </label>

        <label className="field-label">
          Màu sắc
          <div className="color-select-wrap">
            <span className="color-dot" style={{ background: selectedColor.hex }} />
            <select className="field-select" value={color} onChange={(e) => setColor(e.target.value)}>
              {COLOR_OPTIONS.map((c) => (
                <option key={c.name} value={c.name}>{c.label}</option>
              ))}
            </select>
          </div>
        </label>

        <label className="field-label">
          Loại
          <select className="field-select" value={type} onChange={(e) => { setType(e.target.value); setFolderId(""); }}>
            <option value="personal">Cá nhân</option>
            <option value="team">Nhóm</option>
          </select>
        </label>

        {filteredFolders.length > 0 && (
          <label className="field-label">
            Thư mục (không bắt buộc)
            <select className="field-select" value={folderId} onChange={(e) => setFolderId(e.target.value)}>
              <option value="">Không có thư mục</option>
              {filteredFolders.map((f) => (
                <option key={f._id} value={f._id}>{f.name}</option>
              ))}
            </select>
          </label>
        )}

        <p className="field-label field-label-tight">Chế độ xem</p>
        <div className="layout-picker">
          <button className={`layout-opt ${view === "list" ? "active" : ""}`} type="button" onClick={() => setView("list")}>
            <List size={16} /> Danh sách
          </button>
          <button className={`layout-opt ${view === "board" ? "active" : ""}`} type="button" onClick={() => setView("board")}>
            <LayoutGrid size={16} /> Bảng
          </button>
          <button className={`layout-opt ${view === "calendar" ? "active" : ""}`} type="button" onClick={() => setView("calendar")}>
            <Calendar size={16} /> Lịch
          </button>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={handleClose}>Hủy</button>
          <button className="btn-primary" type="button" onClick={handleSubmit} disabled={submitting || !name.trim()}>
            {submitting ? "Đang thêm…" : "Thêm"}
          </button>
        </div>
      </section>
    </div>
  );
}
