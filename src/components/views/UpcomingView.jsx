import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import AddTaskInline from "../common/AddTaskInline";
import { formatDate, isToday } from "../../utils/dates";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

function startOfWeek(date, weekStartsOn = "monday") {
  const d = new Date(date);
  const day = d.getDay();
  if (weekStartsOn === "monday") {
    const offset = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + offset);
  } else {
    d.setDate(d.getDate() - day);
  }
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function parseLocalDate(dateInput) {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  return isNaN(d.getTime()) ? null : d;
}

function minutesFromMidnight(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + (m || 0);
}

/* Colour palette for tasks */
const TASK_COLORS = [
  "#4a9fe5", "#3aab7b", "#e44332", "#7b68ee",
  "#eb8909", "#009688", "#e91e63", "#246fe0",
];
function taskColor(idx) { return TASK_COLORS[idx % TASK_COLORS.length]; }

export default function UpcomingView({
  tasks,
  loading,
  error,
  onToggle,
  onDelete,
  onAdd,
  projects = [],
  activeProject = null,
  weekStartsOn = "monday",
  showWeekends = true,
}) {
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(today, weekStartsOn));
  const [addingDay, setAddingDay] = useState(null); // Date string for inline add
  const [viewLayout, setViewLayout] = useState("week"); // week | month (month is future)
  const scrollRef = useRef(null);

  const days = useMemo(() => {
    const all = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    if (showWeekends) return all;
    return all.filter((d) => d.getDay() !== 0 && d.getDay() !== 6);
  }, [weekStart, showWeekends]);

  useEffect(() => {
    setWeekStart(startOfWeek(today, weekStartsOn));
  }, [weekStartsOn, today]);

  // Current time for indicator
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowDayIdx = days.findIndex((d) => isSameDay(d, now));

  // Group tasks
  const tasksByDay = useMemo(() => {
    const map = {};
    days.forEach((d) => { map[d.toDateString()] = []; });
    tasks.forEach((t) => {
      const d = parseLocalDate(t.dueDate);
      if (!d) return;
      const key = d.toDateString();
      if (map[key]) map[key].push(t);
    });
    return map;
  }, [tasks, days]);

  const allDayTasks = useMemo(() => {
    const map = {};
    days.forEach((d) => { map[d.toDateString()] = []; });
    tasks.forEach((t) => {
      const d = parseLocalDate(t.dueDate);
      if (!d) return;
      const key = d.toDateString();
      if (map[key] && !t.dueTime) map[key].push(t);
    });
    return map;
  }, [tasks, days]);

  const timedTasks = useMemo(() => {
    const map = {};
    days.forEach((d) => { map[d.toDateString()] = []; });
    tasks.forEach((t) => {
      const d = parseLocalDate(t.dueDate);
      if (!d || !t.dueTime) return;
      const key = d.toDateString();
      if (map[key]) map[key].push(t);
    });
    return map;
  }, [tasks, days]);

  function prevWeek() { setWeekStart((w) => addDays(w, -7)); }
  function nextWeek() { setWeekStart((w) => addDays(w, 7)); }
  function goToday() { setWeekStart(startOfWeek(today, weekStartsOn)); }

  const headerLabel = useMemo(() => {
    const months = new Set(days.map((d) => d.getMonth()));
    const years = new Set(days.map((d) => d.getFullYear()));
    const yearStr = [...years].join(" – ");
    if (months.size === 1) return `${MONTH_NAMES[[...months][0]]} ${yearStr}`;
    return [...months].map((m) => MONTH_NAMES[m]).join(" – ") + " " + yearStr;
  }, [days]);

  const HOUR_HEIGHT = 60; // px per hour

  const dayCount = days.length || 7;

  return (
    <div className="cal-shell">
      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="cal-toolbar">
        <div className="cal-toolbar-left">
          <button className="cal-today-btn" onClick={goToday} type="button">Hôm nay</button>
          <button className="cal-nav-btn" onClick={prevWeek} type="button" aria-label="Tuần trước">
            <ChevronLeft size={16} />
          </button>
          <button className="cal-nav-btn" onClick={nextWeek} type="button" aria-label="Tuần sau">
            <ChevronRight size={16} />
          </button>
          <span className="cal-header-label">{headerLabel}</span>
        </div>
        <div className="cal-toolbar-right">
          <button
            className={`cal-layout-btn ${viewLayout === "week" ? "active" : ""}`}
            onClick={() => setViewLayout("week")}
            type="button"
          >Tuần</button>
          <button
            className={`cal-layout-btn ${viewLayout === "month" ? "active" : ""}`}
            onClick={() => setViewLayout("month")}
            type="button"
          >Tháng</button>
        </div>
      </div>

      {loading && <p className="data-state">Đang tải công việc…</p>}
      {!loading && error && <p className="data-state warning">{error}</p>}

      {/* ── Calendar grid ───────────────────────────────────── */}
      <div className="cal-grid-wrap" ref={scrollRef}>
        {/* Day header row */}
        <div className="cal-day-header-row">
          <div className="cal-time-gutter" /> {/* spacer for gutter */}
          {days.map((day, i) => {
            const isT = isSameDay(day, today);
            return (
              <div key={i} className={`cal-day-header ${isT ? "cal-day-today" : ""}`}>
                <span className="cal-day-name">{DAY_LABELS[day.getDay()]}</span>
                <span className={`cal-day-num ${isT ? "cal-day-num-today" : ""}`}>{day.getDate()}</span>
              </div>
            );
          })}
        </div>

        {/* All-day row */}
        <div className="cal-allday-row">
          <div className="cal-time-gutter cal-allday-label">Cả ngày</div>
          {days.map((day, i) => {
            const key = day.toDateString();
            const dayAllTasks = allDayTasks[key] || [];
            return (
              <div key={i} className="cal-allday-cell">
                {dayAllTasks.map((t, ti) => (
                  <button
                    key={t._id}
                    className={`cal-task-chip ${t.done ? "cal-task-chip-done" : ""}`}
                    style={{ background: taskColor(ti) }}
                    onClick={() => onToggle(t._id)}
                    title={t.title}
                    type="button"
                  >
                    {t.title}
                  </button>
                ))}
                <button
                  className="cal-add-in-day"
                  type="button"
                  title="Thêm công việc"
                  onClick={() => setAddingDay(day.toISOString().split("T")[0])}
                >
                  <Plus size={11} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Inline add form (shown below all-day row) */}
        {addingDay && (
          <div className="cal-add-inline-wrap">
            <AddTaskInline
              defaultProject={activeProject?.name || "Inbox"}
              defaultProjectId={activeProject?._id || ""}
              lockProject={Boolean(activeProject)}
              projects={projects}
              onAdd={async (data) => {
                await onAdd({ ...data, dueDate: data.dueDate || addingDay });
                setAddingDay(null);
              }}
              onCancel={() => setAddingDay(null)}
            />
          </div>
        )}

        {/* Time grid */}
        <div className="cal-time-grid" style={{ height: HOUR_HEIGHT * 24 }}>
          {/* Hour lines + labels */}
          {HOURS.map((h) => (
            <div key={h} className="cal-hour-row" style={{ top: h * HOUR_HEIGHT, height: HOUR_HEIGHT }}>
              <div className="cal-time-gutter cal-time-label">
                {h === 0 ? "" : `${String(h).padStart(2, "0")}:00`}
              </div>
              {days.map((_, di) => (
                <div key={di} className="cal-hour-cell" />
              ))}
            </div>
          ))}

          {/* Current time indicator */}
          {nowDayIdx >= 0 && (
            <div
              className="cal-now-line"
              style={{
                top: (nowMinutes / 60) * HOUR_HEIGHT,
                left: `calc(var(--cal-gutter-w) + ${nowDayIdx} * (100% - var(--cal-gutter-w)) / ${dayCount})`,
                width: `calc((100% - var(--cal-gutter-w)) / ${dayCount})`,
              }}
            />
          )}

          {/* Timed task chips */}
          {days.map((day, di) => {
            const key = day.toDateString();
            const tTasks = timedTasks[key] || [];
            return tTasks.map((t, ti) => {
              const mins = minutesFromMidnight(t.dueTime);
              if (mins === null) return null;
              const topPx = (mins / 60) * HOUR_HEIGHT;
              const colLeft = `calc(var(--cal-gutter-w) + ${di} * (100% - var(--cal-gutter-w)) / ${dayCount} + 2px)`;
              const colW = `calc((100% - var(--cal-gutter-w)) / ${dayCount} - 4px)`;
              return (
                <button
                  key={t._id}
                  className={`cal-timed-chip ${t.done ? "cal-task-chip-done" : ""}`}
                  style={{
                    top: topPx,
                    left: colLeft,
                    width: colW,
                    background: taskColor(ti),
                    minHeight: HOUR_HEIGHT * 0.5,
                  }}
                  onClick={() => onToggle(t._id)}
                  title={t.title}
                  type="button"
                >
                  <span className="cal-timed-title">{t.title}</span>
                  <span className="cal-timed-time">{t.dueTime}</span>
                </button>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}
