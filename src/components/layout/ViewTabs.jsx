import React from "react";
import { Calendar, LayoutGrid, List } from "lucide-react";

const tabs = [
  { id: "list", label: "List", Icon: List },
  { id: "board", label: "Board", Icon: LayoutGrid },
  { id: "calendar", label: "Calendar", Icon: Calendar },
];

export default function ViewTabs({ viewMode, onChangeView }) {
  return (
    <div className="view-tabs" role="tablist" aria-label="View mode">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          className={`view-tab ${viewMode === tab.id ? "active" : ""}`}
          onClick={() => onChangeView(tab.id)}
        >
          <tab.Icon size={14} /> {tab.label}
        </button>
      ))}
    </div>
  );
}
