import React from "react";
import { AlertTriangle, TrendingUp, Users, Zap, X } from "lucide-react";
import Avatar from "../common/Avatar";
import { weekBars, weekDays } from "../../data/mockData";

export default function InsightsPanel({ onClose }) {
  return (
    <aside className="insights-panel">
      <div className="insights-header">
        <span className="insights-title">
          <Zap size={14} /> Phân tích <span className="beta-badge">THỬ NGHIỆM</span>
        </span>
        <button className="icon-btn" onClick={onClose} aria-label="Đóng phân tích">
          <X size={14} />
        </button>
      </div>

      <div className="insights-section">
        <p className="insights-label">Tình trạng</p>
        <span className="health-badge critical">
          <AlertTriangle size={12} /> Nghiêm trọng
        </span>
        <p className="insights-desc">
          Dự án này đang ở trạng thái nghiêm trọng vì chưa có công việc nào hoàn thành và có 1 việc P1 bị quá hạn.
          Cần ưu tiên xử lý ngay các công việc quá hạn.
        </p>
        <p className="insights-updated">↻ Cập nhật 15 giờ trước</p>
      </div>

      <div className="insights-section">
        <p className="insights-label">Có rủi ro</p>
        <div className="at-risk-item">
          <span className="overdue-dot" />
          Tạo bộ hình ảnh mới cho các trang mạng xã hội
        </div>
      </div>

      <div className="insights-section">
        <p className="insights-label">Tiến độ</p>
        <div className="progress-row">
          <TrendingUp size={12} />
          <span className="progress-pct">46%</span>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: "46%" }} />
        </div>
        <div className="progress-markers">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
        </div>
        <p className="progress-stats">
          <span className="stat-dot completed" /> 6 đã hoàn thành <span className="stat-gap" />
          <span className="stat-dot active" /> 7 đang hoạt động
        </p>
      </div>

      <div className="insights-section">
        <p className="insights-label">Hoàn thành</p>
        <p className="insights-week">↗ Tuần này: 6</p>
        <div className="week-chart">
          {weekBars.map((height, index) => (
            <div key={weekDays[index]} className="week-col">
              <div
                className="week-bar"
                style={{ height: height ? `${height * 6}px` : "2px", opacity: height ? 1 : 0.2 }}
              />
              <span className="week-day">{weekDays[index]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="insights-section">
        <p className="insights-label">Phân công</p>
        <div className="assigned-row">
          <Users size={12} /> 2 người
        </div>
        <div className="assignee-bars">
          <div className="assignee-bar-row">
            <Avatar initial="S" color="#58bbb3" size={20} />
            <div className="assignee-bar" style={{ width: "100%", background: "#58bbb3" }} />
            <span>2</span>
          </div>
          <div className="assignee-bar-row">
            <Avatar initial="A" color="#7ec8a4" size={20} />
            <div className="assignee-bar" style={{ width: "70%", background: "#7ec8a4" }} />
          </div>
        </div>
      </div>
    </aside>
  );
}
