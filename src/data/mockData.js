import {
  Search,
  Inbox,
  Calendar,
  Clock,
  Filter,
  CheckCircle2,
  Hash,
  FolderOpen,
  Lock,
} from "lucide-react";

export const navItems = [
  { id: "search", label: "Search", Icon: Search },
  { id: "inbox", label: "Inbox", Icon: Inbox, count: 1 },
  { id: "today", label: "Today", Icon: Calendar, count: 1, active: true },
  { id: "upcoming", label: "Upcoming", Icon: Clock },
  { id: "filters", label: "Filters & Labels", Icon: Filter },
  { id: "completed", label: "Completed", Icon: CheckCircle2 },
];

export const projectItems = [
  { id: "setup", label: "Team Setup Guide", Icon: Lock, count: 25 },
  { id: "team", label: "Design Team", Icon: FolderOpen, sub: true },
  {
    id: "requests",
    label: "Design Requests",
    Icon: Hash,
    count: 7,
    active: true,
    sub: true,
  },
];

export const todayTasks = [
  {
    id: 1,
    title: "Product team standup",
    timeBlock: "23:00-23:15",
    note: "Sync blockers and finalize tomorrow priorities.",
    tag: "Team",
    done: true,
  },
  {
    id: 2,
    title: "Send a redesign proposal",
    time: "17:00",
    note: "Include before/after UI snapshots and goals.",
    tag: "Design Requests",
    priority: 1,
    comments: 2,
    overdue: true,
  },
  {
    id: 3,
    title: "Write down the problem you're solving",
    note: "Define one measurable user problem for this sprint.",
    tag: "Inbox",
  },
];

export const boardColumns = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: 1,
        title: "Send a redesign proposal",
        date: "Today 17:00",
        dateType: "overdue",
        assignee: "S",
        assigneeColor: "#58bbb3",
        comments: 2,
        label: "Design Requests",
        priority: 1,
      },
      { id: 2, title: "Speed improvements" },
    ],
  },
  {
    id: "week",
    title: "This Week",
    tasks: [
      {
        id: 3,
        title: "Make new visuals for social pages",
        desc: "Design and produce new visuals for social media pages...",
        date: "Saturday  21 Feb",
        dateType: "overdue",
        assignee: "A",
        assigneeColor: "#7ec8a4",
        label: "design-request",
        priority: 1,
      },
      {
        id: 4,
        title: "Better navigation with sidebar",
        assignee: "A",
        assigneeColor: "#7ec8a4",
      },
      {
        id: 5,
        title: "New onboarding flow",
        assignee: "S",
        assigneeColor: "#58bbb3",
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    tasks: [{ id: 6, title: "Drag-and-drop reordering" }],
  },
];

export const settingNav = [
  "Account",
  "General",
  "Subscription",
  "Theme",
  "Sidebar",
  "Quick Add",
  "Productivity",
  "Reminders",
  "Notifications",
  "Backups",
  "Integrations",
  "Calendars",
];

export const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
export const weekBars = [0, 0, 4, 6, 0, 0, 0];
