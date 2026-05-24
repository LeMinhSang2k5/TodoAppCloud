export const DEFAULT_SETTINGS = {
  general: {
    language: "English",
    timeFormat: "12h",
    startOfWeek: "monday",
    homeView: "inbox",
  },
  subscription: {
    plan: "free",
  },
  theme: {
    mode: "system",
    reduceMotion: false,
  },
  sidebar: {
    showTaskCounts: true,
    showCompletedCount: false,
    compactMode: false,
  },
  quickAdd: {
    smartDateParsing: true,
    defaultToInbox: true,
    addToBottom: false,
  },
  productivity: {
    karmaEnabled: true,
    dailyGoal: 5,
    weeklyGoal: 30,
    goalCelebrations: true,
    daysOff: ["Mon", "Tue", "Wed", "Thu", "Sat", "Sun"],
    vacationMode: false,
  },
  reminders: {
    defaultReminder: "none",
    autoRemindOnDue: true,
  },
  notifications: {
    email: true,
    desktop: true,
    reminders: true,
    productUpdates: false,
  },
  backups: {
    autoBackup: true,
    backupFrequency: "weekly",
  },
  integrations: {
    googleCalendar: false,
    slack: false,
    github: false,
  },
  calendars: {
    weekStartsOn: "monday",
    showWeekends: true,
    timezone: "auto",
  },
  workspace: {
    name: "SLMobbin",
    allowInvites: true,
    invitedEmails: [],
    plan: "team_free",
  },
};

export function mergeSettings(stored) {
  const merged = structuredClone(DEFAULT_SETTINGS);
  if (!stored || typeof stored !== "object") return merged;

  for (const section of Object.keys(DEFAULT_SETTINGS)) {
    if (stored[section] && typeof stored[section] === "object") {
      merged[section] = { ...merged[section], ...stored[section] };
    }
  }
  return merged;
}
