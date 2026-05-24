import React, { useMemo, useState, useEffect } from "react";
import { Calendar as CalendarIcon, CheckCircle2, ChevronLeft, ChevronRight, Sliders, User, Info } from "lucide-react";
import { isToday as checkIsToday } from "../../utils/dates";

const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // 8:00 to 22:00
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function CalendarView({ tasks = [], onToggle, onDelete }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLayoutPanel, setShowLayoutPanel] = useState(true);

  // Update current time indicator line
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Compute week dates (Monday to Friday)
  const weekDates = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      return date;
    });
  }, [currentWeekStart]);

  // Navigate weeks
  const prevWeek = () => {
    setCurrentWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(prev.getDate() - 7);
      return d;
    });
  };

  const nextWeek = () => {
    setCurrentWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(prev.getDate() + 7);
      return d;
    });
  };

  const monthYearLabel = useMemo(() => {
    const firstDay = weekDates[0];
    return firstDay.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [weekDates]);

  // Match tasks to weekdays & hours
  const mappedTasks = useMemo(() => {
    const result = {
      allDay: Array.from({ length: 5 }, () => []),
      timed: Array.from({ length: 5 }, () => []),
    };

    tasks.forEach((t) => {
      if (t.done || !t.dueDate) return;
      const taskDate = new Date(t.dueDate);
      
      // Check if task falls in this week
      const dayIndex = weekDates.findIndex(
        (wd) => wd.getDate() === taskDate.getDate() &&
                wd.getMonth() === taskDate.getMonth() &&
                wd.getFullYear() === taskDate.getFullYear()
      );

      if (dayIndex !== -1) {
        if (!t.dueTime) {
          result.allDay[dayIndex].push(t);
        } else {
          // Parse dueTime (e.g. "17:00" or "17:00-18:00")
          const timeStr = t.dueTime.split("-")[0].trim();
          const [hoursStr, minutesStr] = timeStr.split(":");
          const hour = parseInt(hoursStr, 10);
          const minute = parseInt(minutesStr, 10) || 0;

          if (!isNaN(hour) && hour >= 8 && hour <= 22) {
            result.timed[dayIndex].push({
              task: t,
              hour,
              minute,
              timeLabel: t.dueTime,
            });
          } else {
            // Out of grid range, place in allDay
            result.allDay[dayIndex].push(t);
          }
        }
      }
    });

    return result;
  }, [tasks, weekDates]);

  // Calculate current time indicator line top position
  const currentIndicatorTop = useMemo(() => {
    const currentHour = currentTime.getHours();
    const currentMin = currentTime.getMinutes();
    
    if (currentHour < 8 || currentHour >= 22) return null;
    
    const rowHeight = 72; // height in CSS of each hour row
    const startHourOffset = currentHour - 8;
    return startHourOffset * rowHeight + (currentMin / 60) * rowHeight;
  }, [currentTime]);

  // Determine if today is in current displayed week
  const todayIndex = useMemo(() => {
    const today = new Date();
    return weekDates.findIndex(
      (wd) => wd.getDate() === today.getDate() &&
              wd.getMonth() === today.getMonth() &&
              wd.getFullYear() === today.getFullYear()
    );
  }, [weekDates]);

  return (
    <div className="calendar-week-shell" style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
      <div className="calendar-week-main" style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 24px", overflowY: "auto" }}>
        
        {/* Header navigation */}
        <header className="calendar-week-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "700", margin: 0 }}>Upcoming</h2>
            <p className="calendar-month-label" style={{ fontSize: "14px", color: "var(--muted)", margin: "4px 0 0" }}>{monthYearLabel}</p>
          </div>
          
          <div className="calendar-controls" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button className="icon-btn calendar-nav-btn" onClick={prevWeek} style={{ padding: "6px", border: "1px solid var(--line)", borderRadius: "6px" }}>
              <ChevronLeft size={16} />
            </button>
            <button className="calendar-today-btn" onClick={() => setCurrentWeekStart(new Date())} style={{ padding: "6px 12px", border: "1px solid var(--line)", borderRadius: "6px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", background: "transparent" }}>
              Today
            </button>
            <button className="icon-btn calendar-nav-btn" onClick={nextWeek} style={{ padding: "6px", border: "1px solid var(--line)", borderRadius: "6px" }}>
              <ChevronRight size={16} />
            </button>
            
            <button 
              className={`top-btn ${showLayoutPanel ? "top-btn-active" : ""}`} 
              onClick={() => setShowLayoutPanel(!showLayoutPanel)}
              style={{ marginLeft: "12px" }}
            >
              <Sliders size={14} /> Display
            </button>
          </div>
        </header>

        {/* Calendar Timeline Grid container */}
        <div className="calendar-grid-container" style={{ display: "flex", flexDirection: "column", flex: 1, background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "8px", overflow: "hidden" }}>
          
          {/* Days horizontal row */}
          <div className="calendar-days-row" style={{ display: "grid", gridTemplateColumns: "60px repeat(5, 1fr)", borderBottom: "1px solid var(--line)", background: "#faf8f5" }}>
            <div className="time-col-spacer" style={{ borderRight: "1px solid var(--line)" }} />
            {weekDates.map((date, idx) => {
              const isDateToday = checkIsToday(date);
              return (
                <div key={idx} className="day-col-header" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 4px", borderRight: idx < 4 ? "1px solid var(--line)" : "none" }}>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--muted)", fontWeight: "700", letterSpacing: "0.04em" }}>
                    {WEEKDAYS[idx]}
                  </span>
                  <span 
                    style={{ 
                      fontSize: "16px", 
                      fontWeight: "700", 
                      marginTop: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: isDateToday ? "#e44332" : "transparent",
                      color: isDateToday ? "#fff" : "var(--text)"
                    }}
                  >
                    {date.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* All day tasks banner row */}
          <div className="calendar-allday-row" style={{ display: "grid", gridTemplateColumns: "60px repeat(5, 1fr)", borderBottom: "1px solid var(--line)", background: "#fffefc", minHeight: "44px" }}>
            <div className="time-col-label" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "var(--muted)", fontWeight: "600", borderRight: "1px solid var(--line)", textTransform: "uppercase" }}>
              All day
            </div>
            {mappedTasks.allDay.map((dayTasks, idx) => (
              <div key={idx} className="allday-cell" style={{ padding: "4px", borderRight: idx < 4 ? "1px solid var(--line)" : "none", display: "flex", flexDirection: "column", gap: "4px" }}>
                {dayTasks.map((t) => (
                  <div 
                    key={t._id} 
                    className="allday-task-pill"
                    onClick={() => onToggle?.(t._id)}
                    style={{
                      fontSize: "11.5px",
                      fontWeight: "600",
                      background: "#faf3eb",
                      borderLeft: "2.5px solid #eb8909",
                      padding: "3px 6px",
                      borderRadius: "3px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "var(--text)"
                    }}
                  >
                    {t.title}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Grid body with hour rows and absolute events */}
          <div className="calendar-grid-body" style={{ position: "relative", height: `${HOURS.length * 72}px`, display: "grid", gridTemplateColumns: "60px repeat(5, 1fr)" }}>
            
            {/* Left hour labels column */}
            <div className="time-labels-col" style={{ borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column", height: "100%" }}>
              {HOURS.map((hour) => (
                <div 
                  key={hour} 
                  style={{ 
                    height: "72px", 
                    display: "flex", 
                    justifyContent: "center", 
                    paddingTop: "6px",
                    fontSize: "11.5px", 
                    color: "var(--muted)", 
                    fontWeight: "600",
                    borderBottom: "1px solid rgba(0,0,0,0.03)"
                  }}
                >
                  {`${hour}:00`}
                </div>
              ))}
            </div>

            {/* Grid days columns */}
            {weekDates.map((_, colIdx) => (
              <div 
                key={colIdx} 
                className="day-grid-column" 
                style={{ 
                  position: "relative", 
                  borderRight: colIdx < 4 ? "1px solid var(--line)" : "none",
                  height: "100%",
                  backgroundImage: "linear-gradient(to bottom, transparent 71px, var(--line) 72px)",
                  backgroundSize: "100% 72px"
                }}
              >
                {/* Render absolute timed task cards inside this column */}
                {mappedTasks.timed[colIdx].map(({ task, hour, minute, timeLabel }) => {
                  const hourOffset = hour - 8;
                  const cardTop = hourOffset * 72 + (minute / 60) * 72;
                  
                  return (
                    <div
                      key={task._id}
                      onClick={() => onToggle?.(task._id)}
                      style={{
                        position: "absolute",
                        top: `${cardTop + 4}px`,
                        left: "4px",
                        right: "4px",
                        height: "56px",
                        background: "#f4f7f6",
                        borderLeft: "3.5px solid #4a9fe5",
                        borderRadius: "4px",
                        padding: "6px 8px",
                        boxShadow: "0 1.5px 3px rgba(0,0,0,0.05)",
                        cursor: "pointer",
                        zIndex: 5,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        overflow: "hidden"
                      }}
                      title={`${task.title} at ${timeLabel}`}
                    >
                      <span style={{ fontSize: "11.5px", fontWeight: "600", color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {task.title}
                      </span>
                      <span style={{ fontSize: "10px", color: "var(--muted)", fontWeight: "500" }}>
                        {timeLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Red timeline marker line indicating current hour/minute */}
            {currentIndicatorTop !== null && todayIndex !== -1 && (
              <div 
                style={{ 
                  position: "absolute", 
                  top: `${currentIndicatorTop}px`, 
                  left: "60px", 
                  right: 0, 
                  height: "2px", 
                  background: "#e44332", 
                  zIndex: 10, 
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {/* Red dot marker at start of line */}
                <div 
                  style={{ 
                    width: "8px", 
                    height: "8px", 
                    borderRadius: "50%", 
                    background: "#e44332", 
                    marginLeft: "-4px" 
                  }} 
                />
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Premium display/layout controls sidebar panel on right */}
      {showLayoutPanel && (
        <aside 
          className="calendar-layout-panel" 
          style={{ 
            width: "280px", 
            borderLeft: "1px solid var(--line)", 
            background: "var(--panel)", 
            padding: "20px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            overflowY: "auto",
            animation: "slideIn 0.2s ease"
          }}
        >
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: "700", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "6px" }}>
              Layout <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#eb8909" }} />
            </h3>
            
            {/* View options selectors */}
            <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: "6px", overflow: "hidden", marginBottom: "12px" }}>
              <button style={{ flex: 1, padding: "8px", fontSize: "12px", border: 0, fontWeight: "600", cursor: "pointer", background: "transparent", color: "var(--muted)" }}>List</button>
              <button style={{ flex: 1, padding: "8px", fontSize: "12px", border: 0, fontWeight: "600", cursor: "pointer", background: "transparent", color: "var(--muted)" }}>Board</button>
              <button style={{ flex: 1, padding: "8px", fontSize: "12px", border: 0, fontWeight: "700", cursor: "pointer", background: "#f0eeeb", color: "var(--text)" }}>Calendar</button>
            </div>
            
            {/* Time frame switchers */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", padding: "6px 0" }}>
              <span style={{ fontWeight: "600", color: "var(--muted)" }}>Timeline</span>
              <div style={{ display: "flex", gap: "4px", background: "#f0eeeb", padding: "2px", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", background: "#fff", padding: "2px 8px", borderRadius: "3px" }}>Week</span>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted)", padding: "2px 8px" }}>Month</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", padding: "10px 0" }}>
              <span style={{ fontWeight: "600", color: "var(--muted)" }}>Future occurrences</span>
              <span style={{ width: "32px", height: "18px", borderRadius: "10px", background: "#ccc", display: "inline-block", position: "relative" }}>
                <span style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#fff", position: "absolute", top: "2px", left: "2px" }} />
              </span>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: 0 }} />

          {/* Grouping and Sorting filters */}
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: "700", margin: "0 0 12px" }}>Sort &amp; Filter</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "11.5px", fontWeight: "600", color: "var(--muted)" }}>Sorting</label>
                <select style={{ padding: "6px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "12.5px", background: "var(--panel)", color: "var(--text)" }}>
                  <option>Smart</option>
                  <option>Due Date</option>
                  <option>Priority</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "11.5px", fontWeight: "600", color: "var(--muted)" }}>Assignee</label>
                <select style={{ padding: "6px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "12.5px", background: "var(--panel)", color: "var(--text)" }}>
                  <option>Me and unassigned</option>
                  <option>All team</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "11.5px", fontWeight: "600", color: "var(--muted)" }}>Priority</label>
                <select style={{ padding: "6px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "12.5px", background: "var(--panel)", color: "var(--text)" }}>
                  <option>All</option>
                  <option>P1 - Urgent</option>
                  <option>P2 - High</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "auto" }}>
            <button style={{ width: "100%", padding: "8px", border: 0, background: "transparent", color: "#e44332", fontSize: "13px", fontWeight: "600", cursor: "pointer", textDecoration: "underline" }}>
              Reset all
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
