export const SETTING_TABS = [
  { id: "account", label: "Tài khoản" },
  { id: "general", label: "Chung" },
  { id: "subscription", label: "Gói dịch vụ" },
  { id: "theme", label: "Giao diện" },
  { id: "sidebar", label: "Thanh bên" },
  { id: "quickAdd", label: "Thêm nhanh" },
  { id: "productivity", label: "Năng suất" },
  { id: "reminders", label: "Nhắc việc" },
  { id: "notifications", label: "Thông báo" },
  { id: "backups", label: "Sao lưu" },
  { id: "integrations", label: "Tích hợp" },
  { id: "calendars", label: "Lịch" },
];

export const WORKSPACE_TABS = [
  { id: "wsGeneral", label: "Chung" },
  { id: "wsPeople", label: "Thành viên" },
  { id: "wsSubscription", label: "Gói dịch vụ" },
];

export const DAY_OPTIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const DEFAULT_CLIENT_SETTINGS = {
  general: {
    language: "English",
    timeFormat: "12h",
    startOfWeek: "monday",
    homeView: "inbox",
  },
  subscription: { plan: "free" },
  theme: { mode: "system", reduceMotion: false },
  sidebar: { showTaskCounts: true, showCompletedCount: false, compactMode: false },
  quickAdd: { smartDateParsing: true, defaultToInbox: true, addToBottom: false },
  productivity: {
    karmaEnabled: true,
    dailyGoal: 5,
    weeklyGoal: 30,
    goalCelebrations: true,
    daysOff: ["Mon", "Tue", "Wed", "Thu", "Sat", "Sun"],
    vacationMode: false,
  },
  reminders: { defaultReminder: "none", autoRemindOnDue: true },
  notifications: { email: true, desktop: true, reminders: true, productUpdates: false },
  backups: { autoBackup: true, backupFrequency: "weekly" },
  integrations: { googleCalendar: false, slack: false, github: false },
  calendars: { weekStartsOn: "monday", showWeekends: true, timezone: "auto" },
  workspace: { name: "SLMobbin", allowInvites: true, invitedEmails: [], plan: "team_free" },
};

export function mergeClientSettings(stored) {
  const merged = structuredClone(DEFAULT_CLIENT_SETTINGS);
  if (!stored) return merged;
  for (const key of Object.keys(DEFAULT_CLIENT_SETTINGS)) {
    if (stored[key]) merged[key] = { ...merged[key], ...stored[key] };
  }
  return merged;
}

export function applyThemeMode(mode) {
  const root = document.documentElement;
  if (mode === "dark") {
    root.setAttribute("data-theme", "dark");
  } else if (mode === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", prefersDark ? "dark" : "light");
  }
}
