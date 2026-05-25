import React, { useCallback, useEffect, useMemo, useState } from "react";
import { clearAuth, loadSavedAuth, saveAuth } from "./api/client";
import AuthGate from "./components/auth/AuthGate";
import HomePage from "./components/landing/HomePage";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import ViewTabs from "./components/layout/ViewTabs";
import FolderModal from "./components/modals/FolderModal";
import ProjectModal from "./components/modals/ProjectModal";
import SettingsModal from "./components/modals/SettingsModal";
import BoardView from "./components/views/BoardView";
import CalendarView from "./components/views/CalendarView";
import CompletedView from "./components/views/CompletedView";
import FiltersView from "./components/views/FiltersView";
import InboxView from "./components/views/InboxView";
import TodayView from "./components/views/TodayView";
import UpcomingView from "./components/views/UpcomingView";
import { useFolders } from "./hooks/useFolders";
import { useProjects } from "./hooks/useProjects";
import { useSettings } from "./hooks/useSettings";
import { useTasks } from "./hooks/useTasks";
import { isToday } from "./utils/dates";

const VIEW_TITLES = {
  inbox: "Hộp thư đến",
  today: "Hôm nay",
  upcoming: "Sắp tới",
  filters: "Bộ lọc & Nhãn",
  completed: "Đã hoàn thành",
};

export default function App() {
  const [publicView, setPublicView] = useState("home");
  const [authInitialStep, setAuthInitialStep] = useState("login");
  const [user, setUser] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [homeViewApplied, setHomeViewApplied] = useState(false);

  const [activeView, setActiveView] = useState("inbox");
  const [viewMode, setViewMode] = useState("list");
  const [showInsights, setShowInsights] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [activeSettingTab, setActiveSettingTab] = useState("productivity");
  const [activeProjectId, setActiveProjectId] = useState(null);

  const [projectModal, setProjectModal] = useState({ open: false, type: "personal", folderId: null });
  const [folderModal, setFolderModal] = useState({ open: false, type: "personal" });

  useEffect(() => {
    const saved = loadSavedAuth();
    if (saved) { setUser(saved.user); setAuthenticated(true); }
  }, []);

  const {
    settings,
    account,
    loading: settingsLoading,
    saving: settingsSaving,
    error: settingsError,
    saveSettings,
    saveAccount,
    exportBackup,
  } = useSettings(isAuthenticated);

  const { tasks, loading, error, addTask, toggleTask, updateTask, deleteTask, reload: reloadTasks } = useTasks(
    isAuthenticated,
    { addToBottom: settings.quickAdd.addToBottom }
  );
  const { projects, addProject, deleteProject } = useProjects(isAuthenticated);
  const { folders, addFolder, deleteFolder } = useFolders(isAuthenticated);

  useEffect(() => {
    if (account.name && account.email) {
      setUser((prev) => (prev ? { ...prev, name: account.name, email: account.email } : prev));
    }
  }, [account.name, account.email]);

  useEffect(() => {
    if (isAuthenticated && !homeViewApplied && settings.general.homeView) {
      setActiveView(settings.general.homeView);
      setHomeViewApplied(true);
    }
  }, [isAuthenticated, homeViewApplied, settings.general.homeView]);

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", settings.theme.reduceMotion);
  }, [settings.theme.reduceMotion]);

  const getTaskProjectId = (task) => {
    if (!task?.projectId) return "";
    if (typeof task.projectId === "string") return task.projectId;
    if (typeof task.projectId === "object" && task.projectId._id) return String(task.projectId._id);
    return String(task.projectId);
  };

  const activeProject = useMemo(
    () => (activeProjectId ? projects.find((p) => p._id === activeProjectId) : null),
    [projects, activeProjectId]
  );

  const scopedTasks = useMemo(() => {
    if (!activeProjectId || !activeProject) return tasks;
    return tasks.filter((t) => {
      const pid = getTaskProjectId(t);
      if (pid) return pid === activeProjectId;
      return t.project === activeProject.name;
    });
  }, [tasks, activeProjectId, activeProject]);

  const inboxCount = useMemo(
    () => scopedTasks.filter((t) => !t.done && (t.project === "Inbox" || !t.project)).length,
    [scopedTasks]
  );

  const todayCount = useMemo(
    () => scopedTasks.filter((t) => !t.done && t.dueDate && isToday(t.dueDate)).length,
    [scopedTasks]
  );

  const handleAddTask = useCallback(async (taskData) => {
    const payload = { ...taskData };
    if (settings.quickAdd.defaultToInbox && !payload.projectId) {
      payload.project = payload.project || "Inbox";
    }
    return addTask(payload);
  }, [addTask, settings.quickAdd.defaultToInbox]);

  const handleSaveSettings = useCallback(async ({ settings: draft, account: accountDraft }) => {
    await saveSettings(draft);

    const accountChanged =
      accountDraft.name !== account.name ||
      accountDraft.email !== account.email ||
      Boolean(accountDraft.newPassword);

    if (accountChanged) {
      const payload = {
        name: accountDraft.name,
        email: accountDraft.email,
      };
      if (accountDraft.newPassword) {
        payload.currentPassword = accountDraft.currentPassword;
        payload.newPassword = accountDraft.newPassword;
      }
      const updatedUser = await saveAccount(payload);
      setUser(updatedUser);
    }

    if (draft.notifications.desktop && typeof Notification !== "undefined") {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
    }

    if (draft.general.homeView) {
      setActiveView(draft.general.homeView);
    }
  }, [saveSettings, saveAccount, account.name, account.email]);

  function handleAuthenticated(authData) {
    saveAuth(authData);
    setUser(authData.user);
    setAuthenticated(true);
    setHomeViewApplied(false);
  }

  function handleLogout() {
    clearAuth();
    setUser(null);
    setAuthenticated(false);
    setPublicView("home");
    setHomeViewApplied(false);
  }

  function handleProjectSelect(projectId) {
    if (!projectId || activeProjectId === projectId) {
      setActiveProjectId(null);
      setActiveView("inbox");
      setViewMode("list");
      return;
    }
    setActiveProjectId(projectId);
    const p = projects.find((pr) => pr._id === projectId);
    setActiveView("inbox");
    setViewMode(p?.view || "list");
  }

  function handleNavChange(view) {
    setActiveView(view);
    if (view !== "inbox") setViewMode("list");
  }

  async function handleDeleteProject(projectId) {
    await deleteProject(projectId);
    if (activeProjectId === projectId) { setActiveProjectId(null); setActiveView("inbox"); }
    await reloadTasks();
  }

  async function handleDeleteFolder(folderId) {
    await deleteFolder(folderId);
  }

  async function handleAddProject(data) {
    await addProject(data);
  }

  async function handleAddFolder(data) {
    await addFolder(data);
  }

  if (!isAuthenticated) {
    if (publicView === "home") {
      return (
        <HomePage
          onLogin={() => { setAuthInitialStep("login"); setPublicView("auth"); }}
          onStartForFree={() => { setAuthInitialStep("register"); setPublicView("auth"); }}
        />
      );
    }
    return (
      <AuthGate
        initialStep={authInitialStep}
        onBackHome={() => setPublicView("home")}
        onAuthenticated={handleAuthenticated}
      />
    );
  }

  const taskProps = {
    tasks: scopedTasks,
    loading,
    error,
    onToggle: toggleTask,
    onDelete: deleteTask,
    onAdd: handleAddTask,
    projects,
    activeProject,
  };

  const currentTitle = activeProject
    ? `${activeProject.name} · ${VIEW_TITLES[activeView] || "Hộp thư đến"}`
    : (VIEW_TITLES[activeView] || "Hộp thư đến");

  function renderView() {
    if (viewMode === "board") {
      return (
        <BoardView
          tasks={scopedTasks}
          showInsights={showInsights}
          onCloseInsights={() => setShowInsights(false)}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      );
    }
    if (viewMode === "calendar") return <CalendarView />;

    switch (activeView) {
      case "inbox":
        return (
          <InboxView
            {...taskProps}
            projectMode={Boolean(activeProject)}
            projectName={activeProject?.name || ""}
            projectId={activeProject?._id || ""}
          />
        );
      case "today": return <TodayView {...taskProps} />;
      case "upcoming":
        return (
          <UpcomingView
            {...taskProps}
            weekStartsOn={settings.calendars.weekStartsOn}
            showWeekends={settings.calendars.showWeekends}
          />
        );
      case "filters": return <FiltersView {...taskProps} />;
      case "completed": return <CompletedView {...taskProps} />;
      default: return <InboxView {...taskProps} />;
    }
  }

  return (
    <div className={`app-shell ${settings.sidebar.compactMode ? "sidebar-compact" : ""}`}>
      <Sidebar
        activeView={activeView}
        onNavChange={handleNavChange}
        inboxCount={settings.sidebar.showTaskCounts ? inboxCount : 0}
        todayCount={settings.sidebar.showTaskCounts ? todayCount : 0}
        user={user}
        onLogout={handleLogout}
        projects={projects}
        folders={folders}
        workspaceName={settings.workspace.name}
        onAddProjectClick={(type, folderId) => setProjectModal({ open: true, type: type || "personal", folderId: folderId || null })}
        onAddFolderClick={(type) => setFolderModal({ open: true, type: type || "personal" })}
        onDeleteProject={handleDeleteProject}
        onDeleteFolder={handleDeleteFolder}
        activeProjectId={activeProjectId}
        onProjectSelect={handleProjectSelect}
        tasks={tasks}
        onAddTask={handleAddTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        onToggleTask={toggleTask}
      />

      <main className="content">
        <TopBar
          title={currentTitle}
          showInsights={showInsights}
          onOpenProjectModal={() => setProjectModal({ open: true, type: "personal", folderId: null })}
          onToggleInsights={() => setShowInsights((v) => !v)}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        <ViewTabs viewMode={viewMode} onChangeView={setViewMode} />
        {renderView()}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        activeTab={activeSettingTab}
        onSelectTab={setActiveSettingTab}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        account={account}
        loading={settingsLoading}
        saving={settingsSaving}
        error={settingsError}
        onSave={handleSaveSettings}
        onExport={exportBackup}
      />

      <ProjectModal
        isOpen={projectModal.open}
        onClose={() => setProjectModal((s) => ({ ...s, open: false }))}
        onAdd={handleAddProject}
        folders={folders}
        defaultType={projectModal.type}
        defaultFolderId={projectModal.folderId || ""}
      />

      <FolderModal
        isOpen={folderModal.open}
        onClose={() => setFolderModal((s) => ({ ...s, open: false }))}
        onAdd={handleAddFolder}
        defaultType={folderModal.type}
      />
    </div>
  );
}
