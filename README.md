

# ✦ TaskFlow

### Ứng dụng quản lý công việc thông minh — gọn gàng, mạnh mẽ, dành cho cá nhân và nhóm

Quản lý việc cần làm theo phong cách Todoist với **Hộp thư đến · Hôm nay · Sắp tới · Bảng · Lịch**, xây dựng trên **React + Express + MongoDB**.

  


[React](https://react.dev/)
[Express](https://expressjs.com/)
[MongoDB](https://www.mongodb.com/)
[Vite](https://vitejs.dev/)

[Demo](#-demo) · [Tính năng](#-tính-năng-nổi-bật) · [Cài đặt](#-cài-đặt-nhanh) · [API](#-api) · [Cấu trúc](#-cấu-trúc-dự-án)

  






---

## 📸 Demo


| Trang chủ                             | Ứng dụng chính                  | Lịch tuần                    |
| ------------------------------------- | ------------------------------- | ---------------------------- |
|                                       |                                 |                              |
| Landing page với animation & parallax | Sidebar, danh sách, bảng Kanban | Lịch 7 ngày đầy đủ (T2 → CN) |


---

## ✨ Tính năng nổi bật


|     |
| --- |
|     |


### 🎯 Quản lý công việc

- **Hộp thư đến** — gom việc chưa phân loại
- **Hôm nay** — tập trung việc đến hạn trong ngày
- **Sắp tới** — lịch tuần với task cả ngày & theo giờ
- **Đã hoàn thành** — lịch sử việc đã xong
- **Bộ lọc & Nhãn** — lọc theo ưu tiên P1–P4 và nhãn tùy chỉnh



### 🗂️ Tổ chức & Cộng tác

- **Dự án cá nhân & nhóm** — màu sắc, chế độ xem mặc định
- **Thư mục** — nhóm dự án theo cấu trúc phân cấp
- **3 chế độ xem:** Danh sách · Bảng (Kanban) · Lịch
- **Thêm nhanh** — modal từ sidebar, inline trong từng view
- **Phân tích** — panel insights (beta)



### 📅 Lịch thông minh

- Hiển thị **đủ 7 ngày** trong tuần (kể cả T7 & CN)
- Hàng **Cả ngày** + lưới giờ 24h
- **Đường chỉ giờ hiện tại** trên lịch
- Bật/tắt cuối tuần, đổi ngày bắt đầu tuần
- Sắp xếp & lọc theo mức ưu tiên



### ⚙️ Cài đặt & Tài khoản

- Đăng ký / đăng nhập bảo mật bằng **JWT**
- Cài đặt giao diện, sidebar, nhắc việc, năng suất
- Mục tiêu hàng ngày/tuần & chế độ nghỉ phép
- Sao lưu tự động & **xuất dữ liệu JSON**
- Hỗ trợ đa ngôn ngữ trong Settings (EN / VI)



---

## 🛠 Tech Stack


| Tầng          | Công nghệ                                 |
| ------------- | ----------------------------------------- |
| **Frontend**  | React 18, Vite 5, Lucide React, CSS thuần |
| **Backend**   | Express 5, JWT, bcryptjs                  |
| **Database**  | MongoDB Atlas + Mongoose                  |
| **Dev tools** | concurrently, nodemon, dotenv             |


---

## 🏗 Kiến trúc

```mermaid
flowchart LR
    subgraph Client["Frontend — Vite :3000"]
        LP[Landing Page]
        APP[React App]
        LP --> APP
    end

    subgraph Server["API Server — Express :5050"]
        AUTH[/auth]
        TASKS[/tasks]
        PROJ[/projects]
        FOLD[/folders]
        SET[/settings]
    end

    subgraph DB["MongoDB Atlas"]
        USERS[(Users)]
        TASKS_DB[(Tasks)]
        PROJ_DB[(Projects)]
    end

    APP -->|REST /api| Server
    AUTH --> USERS
    TASKS --> TASKS_DB
    PROJ --> PROJ_DB
    SET --> USERS
```



---

## 🚀 Cài đặt nhanh

### Yêu cầu

- **Node.js** ≥ 18
- **npm** ≥ 9
- Tài khoản **MongoDB Atlas** (hoặc MongoDB local)

### 1. Clone repository

```bash
git clone https://github.com/LeMinhSang2k5/TodoAppCloud.git
cd TodoAppCloud
```

### 2. Cài dependencies

```bash
npm install
```

### 3. Cấu hình biến môi trường

Tạo file `.env` ở thư mục gốc:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/taskflow

# Server
PORT=5050

# JWT — dùng chuỗi ngẫu nhiên dài, ít nhất 32 ký tự
JWT_SECRET=your_super_secret_key_here

# (Tuỳ chọn) Khi build/preview production, không dùng proxy dev
# VITE_API_URL=http://127.0.0.1:5050
```

> ⚠️ **Không bao giờ commit file `.env` lên GitHub.** File này đã được liệt kê trong `.gitignore`.

### 4. Chạy development

```bash
npm run dev
```

Lệnh trên khởi động đồng thời frontend và API server.


| Dịch vụ         | URL                                                                  |
| --------------- | -------------------------------------------------------------------- |
| 🌐 Frontend     | [http://127.0.0.1:3000](http://127.0.0.1:3000)                       |
| 🔌 API          | [http://127.0.0.1:5050/api](http://127.0.0.1:5050/api)               |
| ❤️ Health check | [http://127.0.0.1:5050/api/health](http://127.0.0.1:5050/api/health) |


### 5. Build production

```bash
npm run build          # Build frontend → dist/
npm run start:server   # Chạy API server
npm run preview        # Preview static build (port 4173)
```

---

## 📜 Scripts


| Lệnh                   | Mô tả                                     |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Chạy frontend + backend song song         |
| `npm run dev:client`   | Chỉ chạy Vite dev server (port 3000)      |
| `npm run dev:server`   | Chỉ chạy Express API (port 5050, nodemon) |
| `npm run build`        | Build production frontend                 |
| `npm run preview`      | Preview bản build (port 4173)             |
| `npm run start:server` | Chạy API server (production)              |


---

## 📁 Cấu trúc dự án

```
TodoAppCloud/
├── .github/
│   └── assets/img/         # Ảnh demo cho README
├── public/                 # Static assets (favicon, hero images)
├── server/
│   ├── index.js            # Express entry point
│   ├── middleware/         # JWT auth middleware
│   ├── models/             # Mongoose schemas
│   └── routes/             # REST API routes
├── src/
│   ├── api/                # HTTP client + auth helpers
│   ├── components/
│   │   ├── auth/           # AuthGate (login/register)
│   │   ├── landing/        # HomePage marketing
│   │   ├── layout/         # Sidebar, TopBar, ViewTabs
│   │   ├── views/          # Inbox, Today, Upcoming, Calendar, Board...
│   │   ├── modals/         # Settings, Project, Folder modals
│   │   └── common/         # TaskItem, AddTaskInline, Avatar
│   ├── hooks/              # useTasks, useProjects, useSettings...
│   ├── data/               # Settings defaults, home page content
│   └── utils/              # Date helpers
├── index.html
├── vite.config.js          # Dev proxy → API :5050
└── package.json
```

---

## 🔌 API

Tất cả route (trừ auth) yêu cầu header:

```
Authorization: Bearer <token>
```

**🔐 Authentication**


| Method | Endpoint             | Mô tả                     |
| ------ | -------------------- | ------------------------- |
| `POST` | `/api/auth/register` | Đăng ký tài khoản mới     |
| `POST` | `/api/auth/login`    | Đăng nhập, nhận JWT token |




**✅ Tasks**


| Method   | Endpoint                | Mô tả                         |
| -------- | ----------------------- | ----------------------------- |
| `GET`    | `/api/tasks`            | Lấy tất cả task của user      |
| `POST`   | `/api/tasks`            | Tạo task mới                  |
| `PATCH`  | `/api/tasks/:id`        | Cập nhật task                 |
| `PATCH`  | `/api/tasks/:id/toggle` | Bật/tắt trạng thái hoàn thành |
| `DELETE` | `/api/tasks/:id`        | Xóa task                      |


**Body khi tạo task (ví dụ):**

```json
{
  "title": "Hoàn thành báo cáo",
  "note": "Gửi trước 17:00",
  "project": "Inbox",
  "priority": 2,
  "dueDate": "2026-05-30",
  "dueTime": "17:00"
}
```



**📂 Projects & Folders**


| Method   | Endpoint            | Mô tả             |
| -------- | ------------------- | ----------------- |
| `GET`    | `/api/projects`     | Danh sách dự án   |
| `POST`   | `/api/projects`     | Tạo dự án         |
| `PATCH`  | `/api/projects/:id` | Cập nhật dự án    |
| `DELETE` | `/api/projects/:id` | Xóa dự án         |
| `GET`    | `/api/folders`      | Danh sách thư mục |
| `POST`   | `/api/folders`      | Tạo thư mục       |
| `PATCH`  | `/api/folders/:id`  | Cập nhật thư mục  |
| `DELETE` | `/api/folders/:id`  | Xóa thư mục       |




**⚙️ Settings**


| Method  | Endpoint                | Mô tả                             |
| ------- | ----------------------- | --------------------------------- |
| `GET`   | `/api/settings`         | Lấy cài đặt & thông tin tài khoản |
| `PATCH` | `/api/settings`         | Lưu cài đặt ứng dụng              |
| `PATCH` | `/api/settings/account` | Cập nhật profile / đổi mật khẩu   |
| `GET`   | `/api/settings/export`  | Xuất backup JSON toàn bộ dữ liệu  |




---

## 🎨 Giao diện

TaskFlow được thiết kế theo triết lý **tối giản nhưng đầy đủ tính năng**:

- Landing page với animation scroll reveal & hiệu ứng parallax
- Sidebar phân cấp: Cá nhân / Nhóm / Thư mục / Dự án
- Dark mode qua cài đặt Theme (System / Light / Dark)
- Responsive trên tablet và mobile

---

## 🗺 Roadmap

- Kéo-thả task trên Board view
- Chế độ xem **Tháng** trong lịch
- Tích hợp Google Calendar thật
- Thông báo desktop theo ngày đến hạn
- PWA — cài đặt như ứng dụng native
- i18n toàn bộ ứng dụng (hiện Settings hỗ trợ EN/VI)

---

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón!

1. Fork repository
2. Tạo branch: `git checkout -b feature/ten-tinh-nang`
3. Commit: `git commit -m "feat: mô tả ngắn gọn"`
4. Push: `git push origin feature/ten-tinh-nang`
5. Mở **Pull Request**

---



**TaskFlow** — *Làm việc có tổ chức. Sống có chủ đích.*

  


Made with ❤️ by [LeMinhSang2k5 and Team](https://github.com/LeMinhSang2k5)

⭐ Nếu project hữu ích, hãy star repo nhé!

