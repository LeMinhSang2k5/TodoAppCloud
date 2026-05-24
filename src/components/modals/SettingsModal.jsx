import React, { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  DAY_OPTIONS,
  SETTING_TABS,
  WORKSPACE_TABS,
  mergeClientSettings,
} from "../../data/settingsData";

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`settings-toggle ${checked ? "settings-toggle-on" : "settings-toggle-off"}`}
      onClick={() => onChange(!checked)}
    />
  );
}

function SettingsRow({ label, desc, children }) {
  return (
    <div className="settings-row">
      <div>
        <p className="settings-field-label">{label}</p>
        {desc && <p className="settings-field-desc">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function FieldSelect({ label, value, onChange, options }) {
  return (
    <label className="settings-field-block">
      <span className="settings-field-block-label">{label}</span>
      <select className="settings-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}

function PanelAccount({ account, onAccountChange }) {
  return (
    <>
      <p className="settings-intro">
        Manage your profile and sign-in credentials. Changes apply immediately after you click Update.
      </p>
      <div className="settings-form-grid">
        <label className="settings-field-block">
          <span className="settings-field-block-label">Full name</span>
          <input
            className="settings-text-input"
            type="text"
            value={account.name}
            onChange={(e) => onAccountChange({ ...account, name: e.target.value })}
          />
        </label>
        <label className="settings-field-block">
          <span className="settings-field-block-label">Email</span>
          <input
            className="settings-text-input"
            type="email"
            value={account.email}
            onChange={(e) => onAccountChange({ ...account, email: e.target.value })}
          />
        </label>
      </div>
      <h4 className="settings-section-title">Change password</h4>
      <div className="settings-form-grid">
        <label className="settings-field-block">
          <span className="settings-field-block-label">Current password</span>
          <input
            className="settings-text-input"
            type="password"
            value={account.currentPassword || ""}
            onChange={(e) => onAccountChange({ ...account, currentPassword: e.target.value })}
            placeholder="Required to set a new password"
          />
        </label>
        <label className="settings-field-block">
          <span className="settings-field-block-label">New password</span>
          <input
            className="settings-text-input"
            type="password"
            value={account.newPassword || ""}
            onChange={(e) => onAccountChange({ ...account, newPassword: e.target.value })}
            placeholder="At least 6 characters"
          />
        </label>
      </div>
    </>
  );
}

function PanelGeneral({ s, patch }) {
  return (
    <>
      <p className="settings-intro">Customize language, time format, and your default home view.</p>
      <div className="settings-form-grid">
        <FieldSelect label="Language" value={s.language} onChange={(v) => patch({ language: v })} options={[
          { value: "English", label: "English" },
          { value: "Vietnamese", label: "Tiếng Việt" },
          { value: "French", label: "Français" },
          { value: "German", label: "Deutsch" },
        ]} />
        <FieldSelect label="Time format" value={s.timeFormat} onChange={(v) => patch({ timeFormat: v })} options={[
          { value: "12h", label: "12-hour" },
          { value: "24h", label: "24-hour" },
        ]} />
        <FieldSelect label="Start of week" value={s.startOfWeek} onChange={(v) => patch({ startOfWeek: v })} options={[
          { value: "monday", label: "Monday" },
          { value: "sunday", label: "Sunday" },
        ]} />
        <FieldSelect label="Home view" value={s.homeView} onChange={(v) => patch({ homeView: v })} options={[
          { value: "inbox", label: "Inbox" },
          { value: "today", label: "Today" },
          { value: "upcoming", label: "Upcoming" },
        ]} />
      </div>
    </>
  );
}

function PanelSubscription({ s }) {
  const planLabel = s.plan === "pro" ? "Pro" : "Free";
  return (
    <>
      <p className="settings-intro">Your current plan and billing details.</p>
      <div className="settings-plan-card">
        <div>
          <p className="settings-plan-name">{planLabel} plan</p>
          <p className="settings-field-desc">
            {s.plan === "pro"
              ? "Unlimited projects, reminders, and team features."
              : "Core task management with up to 5 active projects."}
          </p>
        </div>
        <span className="settings-plan-badge">{planLabel}</span>
      </div>
      {s.plan !== "pro" && (
        <button className="settings-inline-cta" type="button" disabled title="Upgrade coming soon">
          Upgrade to Pro
        </button>
      )}
    </>
  );
}

function PanelTheme({ s, patch }) {
  return (
    <>
      <p className="settings-intro">Choose how TaskFlow looks on your device.</p>
      <FieldSelect label="Theme" value={s.mode} onChange={(v) => patch({ mode: v })} options={[
        { value: "system", label: "Match system" },
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
      ]} />
      <SettingsRow label="Reduce motion" desc="Minimize animations throughout the app.">
        <Toggle checked={s.reduceMotion} onChange={(v) => patch({ reduceMotion: v })} label="Reduce motion" />
      </SettingsRow>
    </>
  );
}

function PanelSidebar({ s, patch }) {
  return (
    <>
      <p className="settings-intro">Control what appears in your left sidebar.</p>
      <SettingsRow label="Show task counts" desc="Display counts next to Inbox and Today.">
        <Toggle checked={s.showTaskCounts} onChange={(v) => patch({ showTaskCounts: v })} label="Show task counts" />
      </SettingsRow>
      <SettingsRow label="Show completed count" desc="Include completed tasks in project counts.">
        <Toggle checked={s.showCompletedCount} onChange={(v) => patch({ showCompletedCount: v })} label="Show completed count" />
      </SettingsRow>
      <SettingsRow label="Compact sidebar" desc="Use smaller spacing for navigation items.">
        <Toggle checked={s.compactMode} onChange={(v) => patch({ compactMode: v })} label="Compact sidebar" />
      </SettingsRow>
    </>
  );
}

function PanelQuickAdd({ s, patch }) {
  return (
    <>
      <p className="settings-intro">Configure how new tasks are created with Quick Add.</p>
      <SettingsRow label="Smart date parsing" desc='Understand phrases like "tomorrow at 9am".'>
        <Toggle checked={s.smartDateParsing} onChange={(v) => patch({ smartDateParsing: v })} label="Smart date parsing" />
      </SettingsRow>
      <SettingsRow label="Default to Inbox" desc="New tasks go to Inbox unless a project is selected.">
        <Toggle checked={s.defaultToInbox} onChange={(v) => patch({ defaultToInbox: v })} label="Default to Inbox" />
      </SettingsRow>
      <SettingsRow label="Add to bottom of list" desc="Place new tasks at the end instead of the top.">
        <Toggle checked={s.addToBottom} onChange={(v) => patch({ addToBottom: v })} label="Add to bottom" />
      </SettingsRow>
    </>
  );
}

function PanelProductivity({ s, patch }) {
  const toggleDay = (day) => {
    const daysOff = s.daysOff.includes(day)
      ? s.daysOff.filter((d) => d !== day)
      : [...s.daysOff, day];
    patch({ daysOff });
  };

  return (
    <>
      <p className="settings-intro">
        Celebrating your progress goes a long way toward achieving long-term success. Set task goals to keep your momentum!
      </p>
      <SettingsRow label="Todoist Karma" desc="Stay motivated with Karma points.">
        <Toggle checked={s.karmaEnabled} onChange={(v) => patch({ karmaEnabled: v })} label="Karma" />
      </SettingsRow>
      <h4 className="settings-section-title">Goals</h4>
      <div className="goal-fields">
        <label className="goal-label">
          Daily tasks
          <input
            className="goal-input"
            type="number"
            min={1}
            max={100}
            value={s.dailyGoal}
            onChange={(e) => patch({ dailyGoal: Number(e.target.value) || 1 })}
          />
        </label>
        <label className="goal-label">
          Weekly tasks
          <input
            className="goal-input"
            type="number"
            min={1}
            max={500}
            value={s.weeklyGoal}
            onChange={(e) => patch({ weeklyGoal: Number(e.target.value) || 1 })}
          />
        </label>
      </div>
      <SettingsRow label="Goal celebrations" desc="Celebrate reaching daily and weekly goals.">
        <Toggle checked={s.goalCelebrations} onChange={(v) => patch({ goalCelebrations: v })} label="Goal celebrations" />
      </SettingsRow>
      <h4 className="settings-section-title">Days off</h4>
      <div className="days-off-row">
        {DAY_OPTIONS.map((day) => (
          <label key={day} className="day-check">
            <input type="checkbox" checked={s.daysOff.includes(day)} onChange={() => toggleDay(day)} />
            {day}
          </label>
        ))}
      </div>
      <SettingsRow label="Vacation mode" desc="Streaks and Karma stay while you take time off.">
        <Toggle checked={s.vacationMode} onChange={(v) => patch({ vacationMode: v })} label="Vacation mode" />
      </SettingsRow>
    </>
  );
}

function PanelReminders({ s, patch }) {
  return (
    <>
      <p className="settings-intro">Set default reminder behavior for tasks with due dates.</p>
      <FieldSelect label="Default reminder" value={s.defaultReminder} onChange={(v) => patch({ defaultReminder: v })} options={[
        { value: "none", label: "No default reminder" },
        { value: "0", label: "At due time" },
        { value: "5", label: "5 minutes before" },
        { value: "30", label: "30 minutes before" },
        { value: "60", label: "1 hour before" },
        { value: "1440", label: "1 day before" },
      ]} />
      <SettingsRow label="Auto-remind on due date" desc="Automatically add a reminder when you set a due date.">
        <Toggle checked={s.autoRemindOnDue} onChange={(v) => patch({ autoRemindOnDue: v })} label="Auto remind" />
      </SettingsRow>
    </>
  );
}

function PanelNotifications({ s, patch }) {
  return (
    <>
      <p className="settings-intro">Choose how and when TaskFlow notifies you.</p>
      <SettingsRow label="Email notifications" desc="Receive updates and reminders by email.">
        <Toggle checked={s.email} onChange={(v) => patch({ email: v })} label="Email notifications" />
      </SettingsRow>
      <SettingsRow label="Desktop notifications" desc="Show browser notifications for due tasks.">
        <Toggle checked={s.desktop} onChange={(v) => patch({ desktop: v })} label="Desktop notifications" />
      </SettingsRow>
      <SettingsRow label="Reminder alerts" desc="Get notified when reminders fire.">
        <Toggle checked={s.reminders} onChange={(v) => patch({ reminders: v })} label="Reminder alerts" />
      </SettingsRow>
      <SettingsRow label="Product updates" desc="Occasional emails about new features.">
        <Toggle checked={s.productUpdates} onChange={(v) => patch({ productUpdates: v })} label="Product updates" />
      </SettingsRow>
    </>
  );
}

function PanelBackups({ s, patch, onExport }) {
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState("");

  async function handleExport() {
    setExporting(true);
    setExportMsg("");
    try {
      await onExport();
      setExportMsg("Backup downloaded successfully.");
    } catch (err) {
      setExportMsg(err.message || "Export failed");
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <p className="settings-intro">Keep your data safe with automatic backups and manual exports.</p>
      <SettingsRow label="Automatic backups" desc="Save a snapshot of your tasks in the cloud.">
        <Toggle checked={s.autoBackup} onChange={(v) => patch({ autoBackup: v })} label="Automatic backups" />
      </SettingsRow>
      <FieldSelect label="Backup frequency" value={s.backupFrequency} onChange={(v) => patch({ backupFrequency: v })} options={[
        { value: "daily", label: "Daily" },
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly" },
      ]} />
      <div className="settings-export-row">
        <button className="settings-inline-cta" type="button" onClick={handleExport} disabled={exporting}>
          {exporting ? "Exporting…" : "Export data now"}
        </button>
        {exportMsg && <p className="settings-status-msg">{exportMsg}</p>}
      </div>
    </>
  );
}

function PanelIntegrations({ s, patch }) {
  return (
    <>
      <p className="settings-intro">Connect TaskFlow with your favorite tools.</p>
      <SettingsRow label="Google Calendar" desc="Sync tasks with due dates to Google Calendar.">
        <Toggle checked={s.googleCalendar} onChange={(v) => patch({ googleCalendar: v })} label="Google Calendar" />
      </SettingsRow>
      <SettingsRow label="Slack" desc="Get task notifications in Slack channels.">
        <Toggle checked={s.slack} onChange={(v) => patch({ slack: v })} label="Slack" />
      </SettingsRow>
      <SettingsRow label="GitHub" desc="Link commits and pull requests to tasks.">
        <Toggle checked={s.github} onChange={(v) => patch({ github: v })} label="GitHub" />
      </SettingsRow>
    </>
  );
}

function PanelCalendars({ s, patch }) {
  return (
    <>
      <p className="settings-intro">Customize calendar and Upcoming view behavior.</p>
      <div className="settings-form-grid">
        <FieldSelect label="Week starts on" value={s.weekStartsOn} onChange={(v) => patch({ weekStartsOn: v })} options={[
          { value: "monday", label: "Monday" },
          { value: "sunday", label: "Sunday" },
        ]} />
        <FieldSelect label="Timezone" value={s.timezone} onChange={(v) => patch({ timezone: v })} options={[
          { value: "auto", label: "Auto-detect" },
          { value: "Asia/Ho_Chi_Minh", label: "Asia/Ho Chi Minh" },
          { value: "America/New_York", label: "America/New York" },
          { value: "Europe/London", label: "Europe/London" },
        ]} />
      </div>
      <SettingsRow label="Show weekends" desc="Display Saturday and Sunday in calendar views.">
        <Toggle checked={s.showWeekends} onChange={(v) => patch({ showWeekends: v })} label="Show weekends" />
      </SettingsRow>
    </>
  );
}

function PanelWorkspaceGeneral({ s, patch }) {
  return (
    <>
      <p className="settings-intro">Manage your team workspace preferences.</p>
      <label className="settings-field-block">
        <span className="settings-field-block-label">Workspace name</span>
        <input
          className="settings-text-input"
          type="text"
          value={s.name}
          onChange={(e) => patch({ name: e.target.value })}
        />
      </label>
      <SettingsRow label="Allow invites" desc="Let workspace members invite new people.">
        <Toggle checked={s.allowInvites} onChange={(v) => patch({ allowInvites: v })} label="Allow invites" />
      </SettingsRow>
    </>
  );
}

function PanelWorkspacePeople({ s, patch, inviteEmail, setInviteEmail }) {
  function addInvite() {
    const email = inviteEmail.trim().toLowerCase();
    if (!email || s.invitedEmails.includes(email)) return;
    patch({ invitedEmails: [...s.invitedEmails, email] });
    setInviteEmail("");
  }

  function removeInvite(email) {
    patch({ invitedEmails: s.invitedEmails.filter((e) => e !== email) });
  }

  return (
    <>
      <p className="settings-intro">Invite teammates to collaborate in this workspace.</p>
      <div className="settings-invite-row">
        <input
          className="settings-text-input"
          type="email"
          placeholder="colleague@company.com"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addInvite(); } }}
        />
        <button className="btn-primary" type="button" onClick={addInvite}>Invite</button>
      </div>
      {s.invitedEmails.length > 0 ? (
        <ul className="settings-invite-list">
          {s.invitedEmails.map((email) => (
            <li key={email}>
              <span>{email}</span>
              <button type="button" className="settings-remove-btn" onClick={() => removeInvite(email)}>Remove</button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="settings-field-desc">No pending invites yet.</p>
      )}
    </>
  );
}

function PanelWorkspaceSubscription({ s }) {
  return (
    <>
      <p className="settings-intro">Team workspace billing and plan details.</p>
      <div className="settings-plan-card">
        <div>
          <p className="settings-plan-name">Team Free</p>
          <p className="settings-field-desc">Up to 5 members, shared projects, and basic collaboration.</p>
        </div>
        <span className="settings-plan-badge">Free</span>
      </div>
      <p className="settings-field-desc">Current plan: <strong>{s.plan === "team_pro" ? "Team Pro" : "Team Free"}</strong></p>
    </>
  );
}

const TAB_TITLES = {
  account: "Account",
  general: "General",
  subscription: "Subscription",
  theme: "Theme",
  sidebar: "Sidebar",
  quickAdd: "Quick Add",
  productivity: "Productivity",
  reminders: "Reminders",
  notifications: "Notifications",
  backups: "Backups",
  integrations: "Integrations",
  calendars: "Calendars",
  wsGeneral: "General",
  wsPeople: "People",
  wsSubscription: "Subscription",
};

export default function SettingsModal({
  isOpen,
  activeTab,
  onSelectTab,
  onClose,
  settings,
  account,
  loading,
  saving,
  error,
  onSave,
  onExport,
}) {
  const [draft, setDraft] = useState(() => mergeClientSettings(null));
  const [accountDraft, setAccountDraft] = useState({ name: "", email: "", currentPassword: "", newPassword: "" });
  const [search, setSearch] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [localError, setLocalError] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDraft(mergeClientSettings(settings));
      setAccountDraft({
        name: account.name || "",
        email: account.email || "",
        currentPassword: "",
        newPassword: "",
      });
      setLocalError("");
      setSavedMsg("");
      setSearch("");
    }
  }, [isOpen, settings, account]);

  const filteredTabs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return SETTING_TABS;
    return SETTING_TABS.filter((t) => t.label.toLowerCase().includes(q));
  }, [search]);

  const filteredWorkspaceTabs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return WORKSPACE_TABS;
    return WORKSPACE_TABS.filter((t) => t.label.toLowerCase().includes(q));
  }, [search]);

  if (!isOpen) return null;

  function patchSection(section, patch) {
    setDraft((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...patch },
    }));
  }

  async function handleUpdate() {
    setLocalError("");
    setSavedMsg("");
    try {
      await onSave({
        settings: draft,
        account: accountDraft,
        activeTab,
      });
      setSavedMsg("Settings updated successfully.");
      setAccountDraft((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
    } catch (err) {
      setLocalError(err.message || "Failed to save settings");
    }
  }

  function handleCancel() {
    setDraft(mergeClientSettings(settings));
    setAccountDraft({
      name: account.name || "",
      email: account.email || "",
      currentPassword: "",
      newPassword: "",
    });
    onClose();
  }

  function renderPanel() {
    switch (activeTab) {
      case "account":
        return <PanelAccount account={accountDraft} onAccountChange={setAccountDraft} />;
      case "general":
        return <PanelGeneral s={draft.general} patch={(p) => patchSection("general", p)} />;
      case "subscription":
        return <PanelSubscription s={draft.subscription} />;
      case "theme":
        return <PanelTheme s={draft.theme} patch={(p) => patchSection("theme", p)} />;
      case "sidebar":
        return <PanelSidebar s={draft.sidebar} patch={(p) => patchSection("sidebar", p)} />;
      case "quickAdd":
        return <PanelQuickAdd s={draft.quickAdd} patch={(p) => patchSection("quickAdd", p)} />;
      case "productivity":
        return <PanelProductivity s={draft.productivity} patch={(p) => patchSection("productivity", p)} />;
      case "reminders":
        return <PanelReminders s={draft.reminders} patch={(p) => patchSection("reminders", p)} />;
      case "notifications":
        return <PanelNotifications s={draft.notifications} patch={(p) => patchSection("notifications", p)} />;
      case "backups":
        return <PanelBackups s={draft.backups} patch={(p) => patchSection("backups", p)} onExport={onExport} />;
      case "integrations":
        return <PanelIntegrations s={draft.integrations} patch={(p) => patchSection("integrations", p)} />;
      case "calendars":
        return <PanelCalendars s={draft.calendars} patch={(p) => patchSection("calendars", p)} />;
      case "wsGeneral":
        return <PanelWorkspaceGeneral s={draft.workspace} patch={(p) => patchSection("workspace", p)} />;
      case "wsPeople":
        return (
          <PanelWorkspacePeople
            s={draft.workspace}
            patch={(p) => patchSection("workspace", p)}
            inviteEmail={inviteEmail}
            setInviteEmail={setInviteEmail}
          />
        );
      case "wsSubscription":
        return <PanelWorkspaceSubscription s={draft.workspace} />;
      default:
        return <PanelProductivity s={draft.productivity} patch={(p) => patchSection("productivity", p)} />;
    }
  }

  return (
    <div className="overlay" role="presentation" onClick={handleCancel}>
      <section
        className="modal settings-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        onClick={(e) => e.stopPropagation()}
      >
        <aside className="settings-nav">
          <h3>Settings</h3>
          <div className="settings-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search"
              aria-label="Search settings"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredTabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              type="button"
              onClick={() => onSelectTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}

          {filteredWorkspaceTabs.length > 0 && (
            <>
              <div className="settings-nav-divider" />
              <p className="settings-workspace-label">{draft.workspace.name || "Workspace"}</p>
              {filteredWorkspaceTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={activeTab === tab.id ? "active" : ""}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </>
          )}
        </aside>

        <div className="settings-content">
          <div className="settings-top">
            <h3>{TAB_TITLES[activeTab] || "Settings"}</h3>
            <button className="icon-btn" type="button" onClick={handleCancel} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          {loading && <p className="settings-status-msg">Loading settings…</p>}
          {(error || localError) && <p className="settings-error-msg">{localError || error}</p>}
          {savedMsg && <p className="settings-success-msg">{savedMsg}</p>}

          {!loading && renderPanel()}

          <div className="settings-footer">
            <button type="button" onClick={handleCancel} disabled={saving}>Cancel</button>
            <button className="btn-primary" type="button" onClick={handleUpdate} disabled={saving || loading}>
              {saving ? "Saving…" : "Update"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
