import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";

export function useTasks(isAuthenticated, options = {}) {
  const { addToBottom = false } = options;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/tasks");
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    reload();
  }, [reload]);

  const addTask = useCallback(async (taskData) => {
    const created = await api.post("/tasks", taskData);
    setTasks((prev) => (addToBottom ? [...prev, created] : [created, ...prev]));
    return created;
  }, [addToBottom]);

  const toggleTask = useCallback(async (id) => {
    const updated = await api.patch(`/tasks/${id}/toggle`, {});
    setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
  }, []);

  const updateTask = useCallback(async (id, data) => {
    const updated = await api.patch(`/tasks/${id}`, data);
    setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    return updated;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  }, []);

  return { tasks, loading, error, addTask, toggleTask, updateTask, deleteTask, reload };
}
