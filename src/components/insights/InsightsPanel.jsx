import React from "react";
import { AlertTriangle, TrendingUp, Users, Zap, X } from "lucide-react";
import Avatar from "../common/Avatar";
import { weekBars, weekDays } from "../../data/mockData";

export default function InsightsPanel({ onClose }) {
  return (
    <aside className="insights-panel">
      <div className="insights-header">
        <span className="insights-title">
          <Zap size={14} /> Insights <span className="beta-badge">BETA</span>
        </span>
        <button className="icon-btn" onClick={onClose} aria-label="Close insights">
          <X size={14} />
        </button>
      </div>

      <div className="insights-section">
        <p className="insights-label">Health</p>
        <span className="health-badge critical">
          <AlertTriangle size={12} /> Critical
        </span>
        <p className="insights-desc">
          This project is in critical condition with no tasks completed and one overdue P1 item.
          Urgent focus needed to address overdue items.
        </p>
        <p className="insights-updated">↻ Updated 15 hours ago</p>
      </div>

      <div className="insights-section">
        <p className="insights-label">At risk</p>
        <div className="at-risk-item">
          <span className="overdue-dot" />
          Make new visuals for social pages
        </div>
      </div>

      <div className="insights-section">
        <p className="insights-label">Progress</p>
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
          <span className="stat-dot completed" /> 6 completed <span className="stat-gap" />
          <span className="stat-dot active" /> 7 active
        </p>
      </div>

      <div className="insights-section">
        <p className="insights-label">Completed</p>
        <p className="insights-week">↗ This week: 6</p>
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
        <p className="insights-label">Assigned</p>
        <div className="assigned-row">
          <Users size={12} /> 2 people
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
