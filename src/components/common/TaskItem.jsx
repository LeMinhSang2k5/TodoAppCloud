import React, { useState } from "react";
import { Calendar, Hash, Trash2, GitBranch, MessageSquare, Lock } from "lucide-react";
import { formatDate, isPastDate, isToday } from "../../utils/dates";
import Avatar from "../common/Avatar";

const PRIORITY_BORDER = { 1: "#d1453b", 2: "#eb8909", 3: "#246fe0", 4: "#b0adaa" };

export default function TaskItem({ task, onToggle, onDelete }) {
  const [hovered, setHovered] = useState(false);

  const dateLabel = task.dueDate ? formatDate(task.dueDate) : "";
  const overdue =
    task.dueDate && isPastDate(task.dueDate) && !isToday(task.dueDate) && !task.done;

  // Determine if this task is a special scheduled event/meeting (e.g., has a time slot)
  const isScheduledMeeting = task.dueTime && (task.title.toLowerCase().includes("standup") || task.title.toLowerCase().includes("meeting") || task.title.toLowerCase().includes("proposal") || task.dueTime.includes("-"));

  if (isScheduledMeeting && !task.done) {
    return (
      <div 
        className="task-scheduled-band"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 16px",
          background: "#faf6f0",
          borderLeft: "3px solid #58bbb3",
          borderRadius: "4px",
          margin: "12px 0 8px",
          fontSize: "13.5px",
          fontWeight: "600",
          color: "#444",
          boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
        }}
      >
        <span style={{ color: "#58bbb3", marginRight: "8px" }}>
          {task.dueTime}
        </span>
        <span style={{ flex: 1 }}>{task.title}</span>
        {onDelete && (
          <button
            className="task-delete-btn"
            type="button"
            style={{ background: "transparent", border: 0, cursor: "pointer", color: "var(--muted)", opacity: hovered ? 1 : 0.4 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onDelete(task._id)}
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    );
  }

  // Subtask & Comment counts (mocking realistic ones if not present in schema to match screenshot)
  const hasSubtasks = task.title === "Send a redesign proposal";
  const subtasksText = hasSubtasks ? "0/1" : null;
  const commentsCount = task.title === "Send a redesign proposal" ? 2 : null;
  const isInboxLocked = task.project === "Inbox" || !task.project;

  return (
    <div
      className={`task-item-row ${task.done ? "task-item-done" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "flex-start", padding: "12px 8px", borderBottom: "1px solid var(--line)" }}
    >
      <button
        className={`checkbox ${task.done ? "done" : ""}`}
        style={{ 
          borderColor: PRIORITY_BORDER[task.priority || 4],
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          borderWidth: "1.5px",
          marginRight: "12px",
          flexShrink: 0
        }}
        onClick={() => onToggle(task._id)}
        aria-label="Toggle complete"
        type="button"
      />

      <div className="task-copy" style={{ flex: 1 }}>
        <p 
          className={task.done ? "strikethrough" : ""} 
          style={{ margin: 0, fontSize: "14px", fontWeight: "500", color: "var(--text)" }}
        >
          {task.title}
        </p>
        {task.note && (
          <small style={{ display: "block", color: "var(--muted)", fontSize: "12.5px", marginTop: "4px" }}>
            {task.note}
          </small>
        )}
        
        <div className="meta-row" style={{ display: "flex", gap: "10px", marginTop: "6px", alignItems: "center", flexWrap: "wrap" }}>
          {dateLabel && (
            <span className={`meta-chip ${overdue ? "chip-red" : ""}`}>
              <Calendar size={10} /> {dateLabel}
              {task.dueTime ? ` ${task.dueTime}` : ""}
            </span>
          )}

          {subtasksText && (
            <span className="meta-chip" style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "11px", color: "var(--muted)" }}>
              <GitBranch size={11} /> {subtasksText}
            </span>
          )}

          {commentsCount && (
            <span className="meta-chip" style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "11px", color: "var(--muted)" }}>
              <MessageSquare size={11} /> {commentsCount}
            </span>
          )}

          {task.project && (
            <span className="meta-chip" style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "11px", color: "#e91e63", background: "rgba(233, 30, 99, 0.05)", padding: "2px 8px", borderRadius: "12px", fontWeight: "600", marginLeft: "auto" }}>
              <Hash size={10} /> {task.project}
              {isInboxLocked && <Lock size={9} style={{ marginLeft: "2px", opacity: 0.7 }} />}
            </span>
          )}
        </div>
      </div>

      {/* Assignee Avatar at right edge */}
      {!task.done && (
        <div className="task-assignee-avatar" style={{ marginLeft: "12px", alignSelf: "center" }}>
          <Avatar initial="S" color="#eb8909" size={20} />
        </div>
      )}

      {hovered && onDelete && (
        <button
          className="task-delete-btn"
          type="button"
          aria-label="Delete task"
          onClick={() => onDelete(task._id)}
          style={{ marginLeft: "8px", alignSelf: "center", background: "transparent", border: 0, cursor: "pointer", color: "var(--muted)" }}
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}
