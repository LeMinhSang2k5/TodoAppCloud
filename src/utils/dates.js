function pad2(n) {
  return String(n).padStart(2, "0");
}

function toDateKey(dateInput) {
  if (!dateInput) return "";

  if (typeof dateInput === "string") {
    const trimmed = dateInput.trim();
    const m = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  }

  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}

function dateFromKey(dateKey) {
  if (!dateKey) return null;
  const [y, m, d] = dateKey.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function isToday(dateInput) {
  const key = toDateKey(dateInput);
  if (!key) return false;
  return key === todayKey();
}

export function isFutureDate(dateInput) {
  const key = toDateKey(dateInput);
  if (!key) return false;
  return key > todayKey();
}

export function isPastDate(dateInput) {
  const key = toDateKey(dateInput);
  if (!key) return false;
  return key < todayKey();
}

export function formatDate(dateInput) {
  if (!dateInput) return "";
  const key = toDateKey(dateInput);
  const d = dateFromKey(key);
  if (!d) return "";
  if (isToday(dateInput)) return "Hôm nay";

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear()
  ) {
    return "Ngày mai";
  }

  return d.toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "short" });
}

export function groupTasksByDate(tasks) {
  const groups = new Map();
  const sorted = [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return toDateKey(a.dueDate).localeCompare(toDateKey(b.dueDate));
  });

  sorted.forEach((task) => {
    const key = task.dueDate ? toDateKey(task.dueDate) : "no-date";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(task);
  });

  return groups;
}
