import React, { useMemo, useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import BoardCard from "../board/BoardCard";
import InsightsPanel from "../insights/InsightsPanel";
import AddTaskInline from "../common/AddTaskInline";
import { isFutureDate, isPastDate, isToday } from "../../utils/dates";

export default function BoardView({
  tasks,
  showInsights,
  onCloseInsights,
  onToggle,
  onDelete,
  onAdd,
  projects = [],
  activeProject = null,
}) {
  const [activeAddColumn, setActiveAddColumn] = useState(null);

  const columns = useMemo(() => {
    const overdueAndToday = tasks.filter(
      (t) => !t.done && t.dueDate && (isToday(t.dueDate) || isPastDate(t.dueDate))
    );
    const noDate = tasks.filter((t) => !t.done && !t.dueDate);
    const upcoming = tasks.filter((t) => !t.done && t.dueDate && isFutureDate(t.dueDate));
    const done = tasks.filter((t) => t.done).slice(0, 8);

    return [
      { id: "todo", title: "To Do", tasks: [...overdueAndToday, ...noDate] },
      { id: "upcoming", title: "Upcoming", tasks: upcoming },
      { id: "done", title: "Done", tasks: done },
    ];
  }, [tasks]);

  return (
    <div className="board-area">
      <div className="board-columns">
        {columns.map((col) => (
          <article key={col.id} className="board-column">
            <div className="col-header">
              <h3>
                {col.title}
                <span className="col-count">{col.tasks.length}</span>
              </h3>
              <button className="icon-btn col-more" type="button" aria-label="Column options">
                <MoreHorizontal size={15} />
              </button>
            </div>
            <div className="column-cards">
              {col.tasks.map((task) => (
                <BoardCard key={task._id} task={task} onToggle={onToggle} onDelete={onDelete} />
              ))}
              {col.id !== "done" && (
                activeAddColumn === col.id ? (
                  <AddTaskInline
                    defaultProject={activeProject ? activeProject.name : "Inbox"}
                    defaultProjectId={activeProject ? activeProject._id : ""}
                    lockProject={Boolean(activeProject)}
                    projects={projects}
                    onAdd={async (data) => {
                      if (onAdd) {
                        await onAdd(data);
                      }
                      setActiveAddColumn(null);
                    }}
                    onCancel={() => setActiveAddColumn(null)}
                  />
                ) : (
                  <button
                    className="ghost-add"
                    type="button"
                    onClick={() => setActiveAddColumn(col.id)}
                  >
                    <Plus size={13} /> Add task
                  </button>
                )
              )}
            </div>
          </article>
        ))}
      </div>

      {showInsights && <InsightsPanel onClose={onCloseInsights} />}
    </div>
  );
}
