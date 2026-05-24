export function isToday(dateInput) {
  const d = new Date(dateInput);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function isFutureDate(dateInput) {
  const d = new Date(dateInput);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d > today;
}

export function isPastDate(dateInput) {
  const d = new Date(dateInput);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

export function formatDate(dateInput) {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isToday(dateInput)) return "Today";

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear()
  ) {
    return "Tomorrow";
  }

  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export function groupTasksByDate(tasks) {
  const groups = new Map();
  const sorted = [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  sorted.forEach((task) => {
    const key = task.dueDate
      ? new Date(task.dueDate).toISOString().split("T")[0]
      : "no-date";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(task);
  });

  return groups;
}
