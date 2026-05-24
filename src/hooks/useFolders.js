import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";

export function useFolders(isAuthenticated) {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/folders");
      setFolders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { reload(); }, [reload]);

  const addFolder = useCallback(async (data) => {
    const created = await api.post("/folders", data);
    setFolders((prev) => [...prev, created]);
    return created;
  }, []);

  const updateFolder = useCallback(async (id, data) => {
    const updated = await api.patch(`/folders/${id}`, data);
    setFolders((prev) => prev.map((f) => (f._id === id ? updated : f)));
    return updated;
  }, []);

  const deleteFolder = useCallback(async (id) => {
    await api.delete(`/folders/${id}`);
    setFolders((prev) => prev.filter((f) => f._id !== id));
  }, []);

  return { folders, loading, error, addFolder, updateFolder, deleteFolder, reload };
}
