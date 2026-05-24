import React from "react";
import { Calendar, MessageCircle } from "lucide-react";
import { formatDate, isPastDate, isToday } from "../../utils/dates";

const PRIORITY_BORDER = { 1: "#d1453b", 2: "#eb8909", 3: "#246fe0", 4: "#b0adaa" };

export default function BoardCard({ task, onToggle, onDelete }) {
  const dateLabel = task.dueDate ? formatDate(task.dueDate) : "";
  const overdue = task.dueDate && isPastDate(task.dueDate) && !isToday(task.dueDate) && !task.done;

  return (
    <div className={`card ${task.done ? "card-done" : ""}`}>
      <div className="card-top">
        <button
          className={`card-check ${overdue ? "check-overdue" : ""} ${task.done ? "check-done" : ""}`}
          style={{ borderColor: PRIORITY_BORDER[task.priority || 4] }}
          onClick={() => onToggle(task._id)}
          aria-label="Toggle complete"
          type="button"
        />
        <p className="card-title">{task.title}</p>
      </div>

      {task.note && <p className="card-desc">{task.note}</p>}

      <div className="card-meta">
        {dateLabel && (
          <span className={`card-date ${overdue ? "date-overdue" : ""}`}>
            <Calendar size={10} /> {dateLabel}
          </span>
        )}
        {task.project && task.project !== "Inbox" && (
          <span className="card-label">{task.project}</span>
        )}
        {task.labels?.map((label) => (
          <span key={label} className="card-label">
            {label}
          </span>
        ))}
        <div className="card-right">
          {task.comments > 0 && (
            <span className="card-comments">
              <MessageCircle size={11} /> {task.comments}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
