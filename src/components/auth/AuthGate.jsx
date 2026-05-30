import React, { useEffect, useState } from "react";
import { api, saveAuth } from "../../api/client";

function TodoistLogo() {
  return (
    <div className="todoist-logo">
      <span className="todoist-mark" aria-hidden="true" />
      <span className="todoist-word">TaskFlow</span>
    </div>
  );
}

function ApiError({ message }) {
  if (!message) return null;
  return <p className="auth-api-error">{message}</p>;
}

function LoginForm({ onSubmit, onSwitchToRegister, form, setForm, error, loading }) {
  return (
    <>
      <h1 className="auth-login-title">Chào mừng trở lại!</h1>
      <ApiError message={error} />
      <form className="auth-form" onSubmit={onSubmit}>
        <label className="auth-label">
          Gmail
          <input
            className="auth-input"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="Nhập Gmail của bạn..."
            required
            autoFocus
          />
        </label>
        <label className="auth-label">
          Mật khẩu
          <input
            className="auth-input"
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            placeholder="Nhập mật khẩu..."
            required
          />
        </label>
        <button className="auth-primary-btn auth-primary-btn-login" type="submit" disabled={loading}>
          {loading ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
      </form>
      <button className="auth-text-link" type="button">
        Quên mật khẩu?
      </button>
      <p className="auth-legal">
        Khi tiếp tục bằng Gmail, bạn đồng ý với Điều khoản dịch vụ và Chính sách quyền riêng tư của TaskFlow.
      </p>
      <p className="auth-switch">
        Chưa có tài khoản?{" "}
        <button className="auth-inline-btn" type="button" onClick={onSwitchToRegister}>
          Đăng ký
        </button>
      </p>
    </>
  );
}

function RegisterForm({ onSubmit, onSwitchToLogin, form, setForm, error, loading }) {
  return (
    <>
      <h1 className="auth-login-title">Tạo tài khoản</h1>
      <p className="auth-subtitle">Bắt đầu miễn phí, không cần thẻ tín dụng.</p>
      <ApiError message={error} />
      <form className="auth-form" onSubmit={onSubmit}>
        <label className="auth-label">
          Gmail
          <input
            className="auth-input"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="Nhập Gmail của bạn..."
            required
            autoFocus
          />
        </label>
        <label className="auth-label">
          Họ và tên
          <input
            className="auth-input"
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Nhập họ và tên"
            required
          />
        </label>
        <label className="auth-label">
          Mật khẩu
          <input
            className="auth-input"
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            placeholder="Nhập mật khẩu"
            required
            minLength={6}
          />
        </label>
        <label className="auth-label">
          Nhập lại mật khẩu
          <input
            className="auth-input"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
            placeholder="Nhập lại mật khẩu"
            required
            minLength={6}
          />
        </label>
        <button className="auth-primary-btn" type="submit" disabled={loading}>
          {loading ? "Đang tạo tài khoản…" : "Tạo tài khoản"}
        </button>
      </form>
      <p className="auth-switch">
        Đã có tài khoản?{" "}
        <button className="auth-inline-btn" type="button" onClick={onSwitchToLogin}>
          Đăng nhập
        </button>
      </p>
    </>
  );
}

export default function AuthGate({ onAuthenticated, onBackHome, initialStep = "login" }) {
  const [step, setStep] = useState(initialStep);
  const [form, setForm] = useState({ email: "", name: "", password: "", confirmPassword: "" });
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStep(initialStep);
    setApiError("");
  }, [initialStep]);

  async function handleLogin(e) {
    e.preventDefault();
    setApiError("");
    setLoading(true);
    try {
      const data = await api.post("/auth/login", { gmail: form.email, password: form.password });
      saveAuth(data);
      onAuthenticated(data);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (form.password !== form.confirmPassword) {
      setApiError("Mật khẩu nhập lại không khớp.");
      return;
    }
    setApiError("");
    setLoading(true);
    try {
      const data = await api.post("/auth/register", {
        fullName: form.name.trim(),
        gmail: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      saveAuth(data);
      onAuthenticated(data);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const isLogin = step === "login";

  return (
    <div className="auth-shell">
      <section className="auth-left">
        <div className="auth-top-row">
          <TodoistLogo />
          {onBackHome && (
            <button className="auth-back-home" type="button" onClick={onBackHome}>
              ← Quay về trang chủ
            </button>
          )}
        </div>

        <div className="auth-card">
          {step === "login" && (
            <LoginForm
              onSubmit={handleLogin}
              onSwitchToRegister={() => { setApiError(""); setStep("register"); }}
              form={form}
              setForm={setForm}
              error={apiError}
              loading={loading}
            />
          )}
          {step === "register" && (
            <RegisterForm
              onSubmit={handleRegister}
              onSwitchToLogin={() => { setApiError(""); setStep("login"); }}
              form={form}
              setForm={setForm}
              error={apiError}
              loading={loading}
            />
          )}
        </div>
      </section>

      <section className="auth-right">
        <img
          className={`auth-hero-image ${isLogin ? "auth-hero-image-signin" : ""}`}
          src={isLogin ? "/auth-login.png" : "/auth-profile.png"}
          alt={isLogin ? "Minh họa đăng nhập" : "Minh họa tạo hồ sơ"}
        />
        {isLogin && (
          <p className="auth-right-footer">
            Mang TaskFlow theo bạn
            <span>Luôn ngăn nắp ở mọi nơi với ứng dụng di động cho iOS và Android.</span>
          </p>
        )}
      </section>
    </div>
  );
}
