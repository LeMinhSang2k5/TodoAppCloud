import { useCallback, useEffect, useState } from "react";
import { api, saveAuth } from "../api/client";
import { applyThemeMode, mergeClientSettings } from "../data/settingsData";

export function useSettings(isAuthenticated) {
  const [settings, setSettings] = useState(() => mergeClientSettings(null));
  const [account, setAccount] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/settings");
      setSettings(mergeClientSettings(data.settings));
      setAccount({ name: data.user?.name || "", email: data.user?.email || "" });
      applyThemeMode(mergeClientSettings(data.settings).theme.mode);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    reload();
  }, [reload]);

  const saveSettings = useCallback(async (nextSettings) => {
    setSaving(true);
    setError("");
    try {
      const data = await api.patch("/settings", { settings: nextSettings });
      const merged = mergeClientSettings(data.settings);
      setSettings(merged);
      applyThemeMode(merged.theme.mode);
      return merged;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const saveAccount = useCallback(async (payload) => {
    setSaving(true);
    setError("");
    try {
      const data = await api.patch("/settings/account", payload);
      setAccount({ name: data.user.name, email: data.user.email });
      const token = localStorage.getItem("token");
      if (token) saveAuth({ token, user: data.user });
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const exportBackup = useCallback(async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/settings/export", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Export failed");
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "taskflow-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return {
    settings,
    setSettings,
    account,
    setAccount,
    loading,
    saving,
    error,
    reload,
    saveSettings,
    saveAccount,
    exportBackup,
  };
}
