import React, { useEffect, useState } from "react";
import { api, saveAuth } from "../../api/client";

function TodoistLogo() {
  return (
    <div className="todoist-logo">
      <span className="todoist-mark" aria-hidden="true" />
      <span className="todoist-word">TODO</span>
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
      <h1 className="auth-login-title">Welcome back!</h1>
      <ApiError message={error} />
      <form className="auth-form" onSubmit={onSubmit}>
        <label className="auth-label">
          Email
          <input
            className="auth-input"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="Enter your email..."
            required
            autoFocus
          />
        </label>
        <label className="auth-label">
          Password
          <input
            className="auth-input"
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            placeholder="Enter your password..."
            required
          />
        </label>
        <button className="auth-primary-btn auth-primary-btn-login" type="submit" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
      <button className="auth-text-link" type="button">
        Forgot your password?
      </button>
      <p className="auth-legal">
        By continuing with Email, you agree to Todoist&apos;s Terms of Service and Privacy Policy.
      </p>
      <p className="auth-switch">
        Don&apos;t have an account?{" "}
        <button className="auth-inline-btn" type="button" onClick={onSwitchToRegister}>
          Sign up
        </button>
      </p>
    </>
  );
}

function RegisterForm({ onSubmit, onSwitchToLogin, form, setForm, error, loading }) {
  return (
    <>
      <h1 className="auth-login-title">Create account</h1>
      <p className="auth-subtitle">Start for free, no credit card required.</p>
      <ApiError message={error} />
      <form className="auth-form" onSubmit={onSubmit}>
        <label className="auth-label">
          Email
          <input
            className="auth-input"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="Enter your email..."
            required
            autoFocus
          />
        </label>
        <label className="auth-label">
          Password
          <input
            className="auth-input"
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            placeholder="At least 6 characters"
            required
            minLength={6}
          />
        </label>
        <button className="auth-primary-btn" type="submit" disabled={loading}>
          {loading ? "Please wait…" : "Continue"}
        </button>
      </form>
      <p className="auth-switch">
        Already have an account?{" "}
        <button className="auth-inline-btn" type="button" onClick={onSwitchToLogin}>
          Log in
        </button>
      </p>
    </>
  );
}

function ProfileForm({ onBack, onSubmit, profile, setProfile, avatarPreview, setAvatarPreview, error, loading }) {
  const initial = profile.name.trim()[0]?.toUpperCase() || "S";

  function handlePickAvatar(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  }

  return (
    <>
      <h1 className="auth-title">What&apos;s your name?</h1>
      <p className="auth-subtitle">Complete your profile to get started.</p>
      <ApiError message={error} />
      <form className="auth-form auth-form-profile" onSubmit={onSubmit}>
        <label className="auth-label">
          Your name
          <input
            className="auth-input"
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ name: e.target.value })}
            placeholder="Your full name"
            required
            autoFocus
          />
        </label>

        <div className="profile-upload-row">
          <div className="profile-avatar-preview">
            {avatarPreview ? <img src={avatarPreview} alt="Preview" /> : <span>{initial}</span>}
          </div>
          <div>
            <label className="upload-btn">
              Upload photo
              <input type="file" accept="image/*" onChange={handlePickAvatar} />
            </label>
            <p className="upload-help">
              Pick a photo up to 4MB.
              <br />
              Your avatar photo will be public.
            </p>
          </div>
        </div>

        <button className="auth-primary-btn" type="submit" disabled={loading || !profile.name.trim()}>
          {loading ? "Creating account…" : "Start using Todoist"}
        </button>
      </form>
      <p className="auth-switch">
        Already have an account?{" "}
        <button className="auth-inline-btn" type="button" onClick={onBack}>
          Log in
        </button>
      </p>
    </>
  );
}

export default function AuthGate({ onAuthenticated, onBackHome, initialStep = "login" }) {
  const [step, setStep] = useState(initialStep);
  const [form, setForm] = useState({ email: "", password: "" });
  const [profile, setProfile] = useState({ name: "" });
  const [avatarPreview, setAvatarPreview] = useState("");
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
      const data = await api.post("/auth/login", { email: form.email, password: form.password });
      saveAuth(data);
      onAuthenticated(data);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleRegisterStep1(e) {
    e.preventDefault();
    setApiError("");
    setStep("profile");
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!profile.name.trim()) return;
    setApiError("");
    setLoading(true);
    try {
      const data = await api.post("/auth/register", {
        name: profile.name.trim(),
        email: form.email,
        password: form.password,
      });
      saveAuth(data);
      onAuthenticated(data);
    } catch (err) {
      setApiError(err.message);
      setStep("register");
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
              ← Back to homepage
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
              onSubmit={handleRegisterStep1}
              onSwitchToLogin={() => { setApiError(""); setStep("login"); }}
              form={form}
              setForm={setForm}
              error={apiError}
              loading={loading}
            />
          )}
          {step === "profile" && (
            <ProfileForm
              onBack={() => { setApiError(""); setStep("login"); }}
              onSubmit={handleRegister}
              profile={profile}
              setProfile={setProfile}
              avatarPreview={avatarPreview}
              setAvatarPreview={setAvatarPreview}
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
          alt={isLogin ? "Login illustration" : "Profile setup illustration"}
        />
        {isLogin && (
          <p className="auth-right-footer">
            Take Todoist with you
            <span>Stay organized wherever you are with our mobile apps for iOS and Android.</span>
          </p>
        )}
      </section>
    </div>
  );
}
