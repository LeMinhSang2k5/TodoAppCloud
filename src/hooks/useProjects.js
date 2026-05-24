import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";

export function useProjects(isAuthenticated) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/projects");
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    reload();
  }, [reload]);

  const addProject = useCallback(async (projectData) => {
    const created = await api.post("/projects", projectData);
    setProjects((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateProject = useCallback(async (id, data) => {
    const updated = await api.patch(`/projects/${id}`, data);
    setProjects((prev) => prev.map((p) => (p._id === id ? updated : p)));
    return updated;
  }, []);

  const deleteProject = useCallback(async (id) => {
    await api.delete(`/projects/${id}`);
    setProjects((prev) => prev.filter((p) => p._id !== id));
  }, []);

  return { projects, loading, error, addProject, updateProject, deleteProject, reload };
}
