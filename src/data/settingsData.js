export const SETTING_TABS = [
  { id: "account", label: "Account" },
  { id: "general", label: "General" },
  { id: "subscription", label: "Subscription" },
  { id: "theme", label: "Theme" },
  { id: "sidebar", label: "Sidebar" },
  { id: "quickAdd", label: "Quick Add" },
  { id: "productivity", label: "Productivity" },
  { id: "reminders", label: "Reminders" },
  { id: "notifications", label: "Notifications" },
  { id: "backups", label: "Backups" },
  { id: "integrations", label: "Integrations" },
  { id: "calendars", label: "Calendars" },
];

export const WORKSPACE_TABS = [
  { id: "wsGeneral", label: "General" },
  { id: "wsPeople", label: "People" },
  { id: "wsSubscription", label: "Subscription" },
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
