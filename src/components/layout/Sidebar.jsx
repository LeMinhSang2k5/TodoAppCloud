import React, { useState } from "react";
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Filter,
  FolderOpen,
  Globe,
  HelpCircle,
  Inbox,
  LayoutGrid,
  LogOut,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import Avatar from "../common/Avatar";

const NAV_ITEMS = [
  { id: "inbox",     label: "Inbox",           Icon: Inbox },
  { id: "today",     label: "Today",           Icon: Calendar },
  { id: "upcoming",  label: "Upcoming",        Icon: Clock },
  { id: "filters",   label: "Filters & Labels", Icon: Filter },
  { id: "completed", label: "Completed",       Icon: CheckCircle2 },
];

/* ─── Small folder row in sidebar ─────────────────────────── */
function FolderRow({ folder, projects, activeProjectId, onProjectSelect, onDeleteProject, onDeleteFolder, onAddProjectInFolder }) {
  const [collapsed, setCollapsed] = useState(false);
  const folderProjects = projects.filter(
    (p) => p.folderId && String(p.folderId) === String(folder._id)
  );

  return (
    <div className="sb-folder">
      <div className="sb-folder-head" onClick={() => setCollapsed((v) => !v)}>
        <span className="sb-folder-arrow">
          {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
        </span>
        <FolderOpen size={14} className="sb-folder-icon" />
        <span className="sb-folder-name">{folder.name}</span>
        <span className="sb-folder-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className="icon-btn"
            type="button"
            title="Add project to folder"
            onClick={() => onAddProjectInFolder(folder._id, folder.type)}
          >
            <Plus size={12} />
          </button>
          <button
            className="icon-btn"
            type="button"
            title="Delete folder"
            onClick={() => onDeleteFolder(folder._id)}
          >
            <Trash2 size={12} />
          </button>
        </span>
      </div>

      {!collapsed && (
        <div className="sb-folder-children">
          {folderProjects.map((p) => (
            <ProjectRow
              key={p._id}
              project={p}
              activeProjectId={activeProjectId}
              onProjectSelect={onProjectSelect}
              onDeleteProject={onDeleteProject}
              indent
            />
          ))}
          {folderProjects.length === 0 && (
            <p className="sb-folder-empty">No projects yet</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Single project row ───────────────────────────────────── */
function ProjectRow({ project, activeProjectId, onProjectSelect, onDeleteProject, indent = false }) {
  const isActive = activeProjectId === project._id;
  return (
    <button
      className={`workspace-btn project-item-btn ${isActive ? "active" : ""} ${indent ? "project-item-indent" : ""}`}
      type="button"
      onClick={() => onProjectSelect?.(project._id)}
    >
      <span className="project-color-dot" style={{ background: project.colorHex || "#7b68ee" }} />
      <span className="project-item-name">{project.name}</span>
      {onDeleteProject && (
        <span
          className="project-delete-icon"
          role="button"
          tabIndex={0}
          aria-label={`Delete ${project.name}`}
          onClick={(e) => { e.stopPropagation(); onDeleteProject(project._id); }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); onDeleteProject(project._id); }
          }}
        >
          <Trash2 size={13} />
        </span>
      )}
    </button>
  );
}

/* ─── Section (Personal or Team) ──────────────────────────── */
function ProjectSection({ label, Icon, projects, folders, activeProjectId, onProjectSelect, onDeleteProject, onDeleteFolder, onAddProject, onAddFolder, onAddProjectInFolder }) {
  const [collapsed, setCollapsed] = useState(false);

  // Projects NOT in any folder
  const rootProjects = projects.filter((p) => !p.folderId);

  return (
    <div className="sb-section">
      <div className="sb-section-head" onClick={() => setCollapsed((v) => !v)}>
        <span className="sb-section-arrow">
          {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
        </span>
        <Icon size={13} className="sb-section-icon" />
        <span className="sb-section-label">{label}</span>
        <span className="sb-section-actions" onClick={(e) => e.stopPropagation()}>
          <button className="icon-btn" type="button" title="Add folder" onClick={onAddFolder}>
            <FolderOpen size={13} />
          </button>
          <button className="icon-btn" type="button" title="Add project" onClick={() => onAddProject()}>
            <Plus size={13} />
          </button>
        </span>
      </div>

      {!collapsed && (
        <div className="sb-section-body">
          {/* Folders */}
          {folders.map((folder) => (
            <FolderRow
              key={folder._id}
              folder={folder}
              projects={projects}
              activeProjectId={activeProjectId}
              onProjectSelect={onProjectSelect}
              onDeleteProject={onDeleteProject}
              onDeleteFolder={onDeleteFolder}
              onAddProjectInFolder={onAddProjectInFolder}
            />
          ))}

          {/* Root projects (no folder) */}
          {rootProjects.map((p) => (
            <ProjectRow
              key={p._id}
              project={p}
              activeProjectId={activeProjectId}
              onProjectSelect={onProjectSelect}
              onDeleteProject={onDeleteProject}
            />
          ))}

          {folders.length === 0 && rootProjects.length === 0 && (
            <p className="no-projects-text">No projects yet</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main Sidebar ─────────────────────────────────────────── */
export default function Sidebar({
  activeView,
  onNavChange,
  inboxCount,
  todayCount,
  user,
  onLogout,
  projects = [],
  folders = [],
  onAddProjectClick,
  onAddFolderClick,
  onDeleteProject,
  onDeleteFolder,
  activeProjectId,
  onProjectSelect,
  workspaceName,
}) {
  const countsMap = { inbox: inboxCount || 0, today: todayCount || 0 };
  const initial = user?.name?.[0]?.toUpperCase() || "U";

  const personalProjects = projects.filter((p) => p.type === "team" ? false : true).filter((p) => !p.folderId || folders.some((f) => f._id === (p.folderId?._id || p.folderId) && f.type === "personal"));
  const teamProjects = projects.filter((p) => p.type === "team").filter((p) => !p.folderId || folders.some((f) => f._id === (p.folderId?._id || p.folderId) && f.type === "team"));

  const personalFolders = folders.filter((f) => f.type === "personal");
  const teamFolders = folders.filter((f) => f.type === "team");

  return (
    <aside className="sidebar">
      {/* Profile row */}
      <div className="profile-row">
        <button className="profile-btn" type="button">
          <Avatar initial={initial} color="#58bbb3" size={30} />
          <span className="profile-name">{user?.name || "User"}</span>
          <ChevronDown size={14} className="profile-chevron" />
        </button>
        <div className="profile-actions">
          <button className="icon-btn notif-btn" type="button" aria-label="Notifications">
            <Bell size={16} />
            <span className="notif-dot" />
          </button>
          <button className="icon-btn" type="button" aria-label="Toggle layout">
            <LayoutGrid size={16} />
          </button>
          {onLogout && (
            <button className="icon-btn" type="button" aria-label="Log out" title="Log out" onClick={onLogout}>
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Add task */}
      <button className="add-task-btn" type="button">
        <span className="add-icon"><Plus size={18} strokeWidth={3} /></span>
        Add task
      </button>

      {/* Navigation */}
      <nav className="menu-block">
        {NAV_ITEMS.map((item) => {
          const count = countsMap[item.id] || 0;
          return (
            <button
              key={item.id}
              className={`menu-item ${activeView === item.id && !activeProjectId ? "active" : ""}`}
              type="button"
              onClick={() => onNavChange(item.id)}
            >
              <span className="menu-item-left">
                <item.Icon size={16} className="menu-icon" />
                {item.label}
              </span>
              {count > 0 && <span className="count">{count}</span>}
            </button>
          );
        })}
      </nav>

      {/* All tasks shortcut */}
      <div style={{ padding: "2px 4px 0" }}>
        <button
          className={`workspace-btn project-item-btn ${!activeProjectId ? "active" : ""}`}
          type="button"
          onClick={() => onProjectSelect?.(null)}
        >
          <span className="project-color-dot" style={{ background: "#8b8b8b" }} />
          <span className="project-item-name">All tasks</span>
        </button>
      </div>

      {/* Personal projects section */}
      <ProjectSection
        label="My Projects"
        Icon={Globe}
        projects={personalProjects}
        folders={personalFolders}
        activeProjectId={activeProjectId}
        onProjectSelect={onProjectSelect}
        onDeleteProject={onDeleteProject}
        onDeleteFolder={onDeleteFolder}
        onAddProject={() => onAddProjectClick?.("personal")}
        onAddFolder={() => onAddFolderClick?.("personal")}
        onAddProjectInFolder={(fid, ftype) => onAddProjectClick?.(ftype, fid)}
      />

      {/* Team projects section */}
      <ProjectSection
        label={workspaceName || "Team"}
        Icon={Users}
        projects={teamProjects}
        folders={teamFolders}
        activeProjectId={activeProjectId}
        onProjectSelect={onProjectSelect}
        onDeleteProject={onDeleteProject}
        onDeleteFolder={onDeleteFolder}
        onAddProject={() => onAddProjectClick?.("team")}
        onAddFolder={() => onAddFolderClick?.("team")}
        onAddProjectInFolder={(fid, ftype) => onAddProjectClick?.(ftype, fid)}
      />

      <button className="browse-all-btn" type="button">
        <Globe size={14} />
        Browse all projects
      </button>

      <button className="help-btn" type="button">
        <HelpCircle size={15} />
        Help &amp; resources
      </button>
    </aside>
  );
}
