import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, RotateCcw, Sliders, Trash2 } from "lucide-react";
import AddTaskInline from "../common/AddTaskInline";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 60; // px per hour
const DAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

const PRIORITY_OPTIONS = [
  { value: 0, label: "Tất cả mức ưu tiên" },
  { value: 1, label: "P1 - Khẩn cấp" },
  { value: 2, label: "P2 - Cao" },
  { value: 3, label: "P3 - Trung bình" },
  { value: 4, label: "P4 - Thấp" },
];

const TASK_COLORS = [
  "#4a9fe5", "#3aab7b", "#e44332", "#7b68ee",
  "#eb8909", "#009688", "#e91e63", "#246fe0",
];
function taskColor(idx) {
  return TASK_COLORS[idx % TASK_COLORS.length];
}

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
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function parseLocalDate(dateInput) {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  return isNaN(d.getTime()) ? null : d;
}

function minutesFromMidnight(timeStr) {
  if (!timeStr) return null;
  const [h, m] = String(timeStr).split(":").map(Number);
  if (isNaN(h)) return null;
  return h * 60 + (m || 0);
}

export default function CalendarView({
  tasks = [],
  onToggle,
  onDelete,
  onAdd,
  projects = [],
  activeProject = null,
  weekStartsOn = "monday",
  showWeekends: showWeekendsSetting = true,
}) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Local controls — seeded from settings but adjustable inside the panel.
  const [weekStartPref, setWeekStartPref] = useState(weekStartsOn);
  const [showWeekends, setShowWeekends] = useState(showWeekendsSetting);
  const [sortBy, setSortBy] = useState("smart");
  const [priorityFilter, setPriorityFilter] = useState(0);

  const [weekStart, setWeekStart] = useState(() => startOfWeek(today, weekStartsOn));
  const [showPanel, setShowPanel] = useState(true);
  const [addingDay, setAddingDay] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const scrollRef = useRef(null);

  // Keep the visible week aligned when the week-start preference changes.
  useEffect(() => {
    setWeekStart((prev) => startOfWeek(prev, weekStartPref));
  }, [weekStartPref]);

  useEffect(() => {
    setWeekStartPref(weekStartsOn);
  }, [weekStartsOn]);

  useEffect(() => {
    setShowWeekends(showWeekendsSetting);
  }, [showWeekendsSetting]);

  // Refresh the "current time" indicator every minute.
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const days = useMemo(() => {
    const all = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    if (showWeekends) return all;
    return all.filter((d) => d.getDay() !== 0 && d.getDay() !== 6);
  }, [weekStart, showWeekends]);

  const dayCount = days.length || 7;

  const sortTasks = useMemo(() => {
    return (list) => {
      const sorted = [...list];
      if (sortBy === "priority") {
        sorted.sort((a, b) => (a.priority || 4) - (b.priority || 4));
      } else if (sortBy === "date") {
        sorted.sort((a, b) => {
          const ma = minutesFromMidnight(a.dueTime) ?? 9999;
          const mb = minutesFromMidnight(b.dueTime) ?? 9999;
          return ma - mb;
        });
      } else {
        // "smart": time first, then priority.
        sorted.sort((a, b) => {
          const ma = minutesFromMidnight(a.dueTime) ?? 9999;
          const mb = minutesFromMidnight(b.dueTime) ?? 9999;
          if (ma !== mb) return ma - mb;
          return (a.priority || 4) - (b.priority || 4);
        });
      }
      return sorted;
    };
  }, [sortBy]);

  const visibleTasks = useMemo(() => {
    if (!priorityFilter) return tasks;
    return tasks.filter((t) => (t.priority || 4) === priorityFilter);
  }, [tasks, priorityFilter]);

  const { allDayTasks, timedTasks } = useMemo(() => {
    const allDay = {};
    const timed = {};
    days.forEach((d) => {
      allDay[d.toDateString()] = [];
      timed[d.toDateString()] = [];
    });
    visibleTasks.forEach((t) => {
      const d = parseLocalDate(t.dueDate);
      if (!d) return;
      const key = d.toDateString();
      if (!(key in allDay)) return;
      if (t.dueTime && minutesFromMidnight(t.dueTime) !== null) {
        timed[key].push(t);
      } else {
        allDay[key].push(t);
      }
    });
    Object.keys(allDay).forEach((k) => { allDay[k] = sortTasks(allDay[k]); });
    Object.keys(timed).forEach((k) => { timed[k] = sortTasks(timed[k]); });
    return { allDayTasks: allDay, timedTasks: timed };
  }, [visibleTasks, days, sortTasks]);

  const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const nowDayIdx = days.findIndex((d) => isSameDay(d, currentTime));

  function prevWeek() { setWeekStart((w) => addDays(w, -7)); }
  function nextWeek() { setWeekStart((w) => addDays(w, 7)); }
  function goToday() { setWeekStart(startOfWeek(today, weekStartPref)); }

  function resetControls() {
    setWeekStartPref(weekStartsOn);
    setShowWeekends(showWeekendsSetting);
    setSortBy("smart");
    setPriorityFilter(0);
    setWeekStart(startOfWeek(today, weekStartsOn));
  }

  const headerLabel = useMemo(() => {
    const months = new Set(days.map((d) => d.getMonth()));
    const years = new Set(days.map((d) => d.getFullYear()));
    const yearStr = [...years].join(" – ");
    if (months.size === 1) return `${MONTH_NAMES[[...months][0]]} ${yearStr}`;
    return [...months].map((m) => MONTH_NAMES[m]).join(" – ") + " " + yearStr;
  }, [days]);

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
      <div className="cal-shell" style={{ flex: 1 }}>
        {/* Toolbar */}
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
              className={`cal-layout-btn ${showPanel ? "active" : ""}`}
              onClick={() => setShowPanel((v) => !v)}
              type="button"
            >
              <Sliders size={14} style={{ marginRight: 4, verticalAlign: "-2px" }} />
              Hiển thị
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="cal-grid-wrap" ref={scrollRef}>
          {/* Day header row */}
          <div className="cal-day-header-row">
            <div className="cal-time-gutter" />
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
                      onClick={() => onToggle?.(t._id)}
                      title={`${t.title} — bấm để đánh dấu hoàn thành`}
                      type="button"
                    >
                      {t.title}
                    </button>
                  ))}
                  {onAdd && (
                    <button
                      className="cal-add-in-day"
                      type="button"
                      title="Thêm công việc"
                      onClick={() => setAddingDay(day.toISOString().split("T")[0])}
                    >
                      <Plus size={11} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Inline add form */}
          {addingDay && onAdd && (
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
                    onClick={() => onToggle?.(t._id)}
                    title={`${t.title} lúc ${t.dueTime}`}
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

      {/* Layout / filter panel */}
      {showPanel && (
        <aside
          className="calendar-layout-panel"
          style={{
            width: "280px",
            borderLeft: "1px solid var(--line)",
            background: "var(--panel)",
            padding: "20px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            overflowY: "auto",
            animation: "slideIn 0.2s ease",
          }}
        >
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 12px", display: "flex", alignItems: "center", gap: "6px" }}>
              Bố cục
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)" }} />
            </h3>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", padding: "8px 0" }}>
              <span style={{ fontWeight: 600, color: "var(--muted)" }}>Bắt đầu tuần</span>
              <div style={{ display: "flex", gap: "4px", background: "#f0eeeb", padding: "2px", borderRadius: "6px" }}>
                <button
                  type="button"
                  onClick={() => setWeekStartPref("monday")}
                  style={pillStyle(weekStartPref === "monday")}
                >Thứ 2</button>
                <button
                  type="button"
                  onClick={() => setWeekStartPref("sunday")}
                  style={pillStyle(weekStartPref === "sunday")}
                >Chủ nhật</button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", padding: "8px 0" }}>
              <span style={{ fontWeight: 600, color: "var(--muted)" }}>Hiển thị cuối tuần</span>
              <button
                type="button"
                role="switch"
                aria-checked={showWeekends}
                aria-label="Hiển thị cuối tuần"
                onClick={() => setShowWeekends((v) => !v)}
                style={{
                  width: "34px",
                  height: "20px",
                  borderRadius: "12px",
                  border: 0,
                  cursor: "pointer",
                  background: showWeekends ? "var(--accent)" : "#ccc",
                  position: "relative",
                  transition: "background .15s",
                  flexShrink: 0,
                }}
              >
                <span style={{
                  width: "14px", height: "14px", borderRadius: "50%", background: "#fff",
                  position: "absolute", top: "3px", left: showWeekends ? "17px" : "3px",
                  transition: "left .15s",
                }} />
              </button>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: 0 }} />

          <div>
            <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 12px" }}>Sắp xếp &amp; Bộ lọc</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--muted)" }}>Sắp xếp</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={selectStyle}
                >
                  <option value="smart">Thông minh</option>
                  <option value="date">Theo giờ đến hạn</option>
                  <option value="priority">Theo mức ưu tiên</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--muted)" }}>Mức ưu tiên</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(Number(e.target.value))}
                  style={selectStyle}
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "auto" }}>
            <button
              type="button"
              onClick={resetControls}
              style={{
                width: "100%", padding: "8px", border: 0, background: "transparent",
                color: "var(--accent)", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              }}
            >
              <RotateCcw size={13} /> Đặt lại tất cả
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}

const selectStyle = {
  padding: "7px 8px",
  border: "1px solid var(--line)",
  borderRadius: "6px",
  fontSize: "12.5px",
  background: "var(--panel)",
  color: "var(--text)",
  cursor: "pointer",
};

function pillStyle(active) {
  return {
    fontSize: "11px",
    fontWeight: active ? 700 : 600,
    background: active ? "#fff" : "transparent",
    color: active ? "var(--text)" : "var(--muted)",
    padding: "3px 9px",
    borderRadius: "4px",
    border: 0,
    cursor: "pointer",
    boxShadow: active ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
  };
}
