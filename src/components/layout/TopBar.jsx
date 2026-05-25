import React from "react";
import { MoreHorizontal, Settings, Share2, Zap } from "lucide-react";

export default function TopBar({
  title,
  showInsights,
  onOpenProjectModal,
  onToggleInsights,
  onOpenSettings,
}) {
  return (
    <header className="topbar">
      <div>
        <h1>{title || "Hộp thư đến"}</h1>
      </div>
      <div className="top-actions">
        <button className="top-btn" type="button" onClick={onOpenProjectModal}>
          <Share2 size={14} /> Chia sẻ
        </button>
        <button
          className={`top-btn ${showInsights ? "top-btn-active" : ""}`}
          type="button"
          onClick={onToggleInsights}
        >
          <Zap size={14} /> Phân tích
        </button>
        <button className="top-btn" type="button" onClick={onOpenSettings}>
          <Settings size={14} /> Cài đặt
        </button>
        <button className="icon-btn top-more" type="button" aria-label="Tùy chọn khác">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </header>
  );
}
