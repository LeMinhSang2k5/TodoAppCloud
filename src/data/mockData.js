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
  { id: "search", label: "Tìm kiếm", Icon: Search },
  { id: "inbox", label: "Hộp thư đến", Icon: Inbox, count: 1 },
  { id: "today", label: "Hôm nay", Icon: Calendar, count: 1, active: true },
  { id: "upcoming", label: "Sắp tới", Icon: Clock },
  { id: "filters", label: "Bộ lọc & Nhãn", Icon: Filter },
  { id: "completed", label: "Đã hoàn thành", Icon: CheckCircle2 },
];

export const projectItems = [
  { id: "setup", label: "Hướng dẫn thiết lập nhóm", Icon: Lock, count: 25 },
  { id: "team", label: "Nhóm thiết kế", Icon: FolderOpen, sub: true },
  {
    id: "requests",
    label: "Yêu cầu thiết kế",
    Icon: Hash,
    count: 7,
    active: true,
    sub: true,
  },
];

export const todayTasks = [
  {
    id: 1,
    title: "Họp nhanh nhóm sản phẩm",
    timeBlock: "23:00-23:15",
    note: "Đồng bộ vướng mắc và chốt ưu tiên cho ngày mai.",
    tag: "Nhóm",
    done: true,
  },
  {
    id: 2,
    title: "Gửi đề xuất thiết kế lại",
    time: "17:00",
    note: "Bao gồm ảnh UI trước/sau và mục tiêu.",
    tag: "Yêu cầu thiết kế",
    priority: 1,
    comments: 2,
    overdue: true,
  },
  {
    id: 3,
    title: "Viết rõ vấn đề bạn đang giải quyết",
    note: "Xác định một vấn đề người dùng có thể đo lường trong sprint này.",
    tag: "Hộp thư đến",
  },
];

export const boardColumns = [
  {
    id: "todo",
    title: "Cần làm",
    tasks: [
      {
        id: 1,
        title: "Gửi đề xuất thiết kế lại",
        date: "Hôm nay 17:00",
        dateType: "overdue",
        assignee: "S",
        assigneeColor: "#58bbb3",
        comments: 2,
        label: "Yêu cầu thiết kế",
        priority: 1,
      },
      { id: 2, title: "Cải thiện tốc độ" },
    ],
  },
  {
    id: "week",
    title: "Tuần này",
    tasks: [
      {
        id: 3,
        title: "Làm bộ hình ảnh mới cho mạng xã hội",
        desc: "Thiết kế và sản xuất bộ hình ảnh mới cho các trang mạng xã hội...",
        date: "Thứ Bảy 21 Thg 2",
        dateType: "overdue",
        assignee: "A",
        assigneeColor: "#7ec8a4",
        label: "yeu-cau-thiet-ke",
        priority: 1,
      },
      {
        id: 4,
        title: "Cải thiện điều hướng bằng thanh bên",
        assignee: "A",
        assigneeColor: "#7ec8a4",
      },
      {
        id: 5,
        title: "Luồng onboarding mới",
        assignee: "S",
        assigneeColor: "#58bbb3",
      },
    ],
  },
  {
    id: "review",
    title: "Duyệt",
    tasks: [{ id: 6, title: "Sắp xếp kéo thả" }],
  },
];

export const settingNav = [
  "Tài khoản",
  "Chung",
  "Gói dịch vụ",
  "Giao diện",
  "Thanh bên",
  "Thêm nhanh",
  "Năng suất",
  "Nhắc việc",
  "Thông báo",
  "Sao lưu",
  "Tích hợp",
  "Lịch",
];

export const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
export const weekBars = [0, 0, 4, 6, 0, 0, 0];
