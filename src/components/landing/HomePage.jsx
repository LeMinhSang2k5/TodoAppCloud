import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  Filter,
  Globe,
  Inbox,
  LayoutGrid,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import {
  homeFeatureCards,
  homeFooterColumns,
  homeFooterSocial,
  homeLogos,
  homeNavLinks,
  homeStats,
  homeTestimonials,
  homeUseCases,
  homeWorkflowSteps,
} from "../../data/homeData";

const ICONS = { Zap, LayoutGrid, Users, Bell, TrendingUp, Globe, Inbox, Filter, CheckCircle2 };

function Logo() {
  return (
    <div className="hpx-logo">
      <span className="hpx-logo-mark" aria-hidden="true" />
      <span className="hpx-logo-word">TaskFlow</span>
    </div>
  );
}

function Stars({ count = 5 }) {
  return (
    <span className="hpx-stars" aria-label={`${count} sao`}>
      {"★".repeat(count)}
    </span>
  );
}

/* Tách tiêu đề thành từng từ để reveal lần lượt */
function AnimatedWords({ text, start = 0, step = 70 }) {
  return text.split(" ").map((word, i) => (
    <span
      key={`${word}-${i}`}
      className="hpx-word"
      style={{ "--wd": `${start + i * step}ms` }}
    >
      {word}
      {i < text.split(" ").length - 1 ? "\u00A0" : ""}
    </span>
  ));
}

export default function HomePage({ onLogin, onStartForFree }) {
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const stageRef = useRef(null);

  /* Loading overlay sang trọng */
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1100);
    return () => clearTimeout(t);
  }, []);

  /* Scroll reveal mượt mà bằng IntersectionObserver */
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("hpx-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Parallax + camera movement nhẹ khi scroll */
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 10);
        document.documentElement.style.setProperty("--sy", String(y));
        if (stageRef.current) {
          const shift = Math.min(y, 700);
          stageRef.current.style.transform =
            `translateY(${shift * 0.06}px) rotateX(${Math.max(6 - y / 60, 0)}deg) scale(${1 + Math.min(y, 400) / 8000})`;
        }
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hpx-shell">
      {/* ── Luxury loader ─────────────────────────────────────── */}
      <div className={`hpx-loader ${loaded ? "hpx-loader-hide" : ""}`} aria-hidden={loaded}>
        <div className="hpx-loader-inner">
          <span className="hpx-loader-mark" />
          <div className="hpx-loader-bar"><span className="hpx-loader-bar-fill" /></div>
          <span className="hpx-loader-text">TaskFlow</span>
        </div>
      </div>

      {/* ── Header (glass) ────────────────────────────────────── */}
      <header className={`hpx-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="hpx-header-inner">
          <Logo />
          <nav className="hpx-nav">
            {homeNavLinks.map((label) => (
              <button key={label} className="hpx-nav-link" type="button">{label}</button>
            ))}
          </nav>
          <div className="hpx-header-actions">
            <button className="hpx-btn-ghost" type="button" onClick={onLogin}>Đăng nhập</button>
            <button className="hpx-btn-primary" type="button" onClick={onStartForFree}>
              Bắt đầu miễn phí
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="hpx-hero">
        <div className="hpx-hero-aurora" aria-hidden="true" />
        <div className="hpx-hero-grid" aria-hidden="true" />

        <div className="hpx-hero-inner">

          <h1 className="hpx-hero-title">
            <AnimatedWords text="Quản lý công việc," start={150} />
            <br />
            <span className="hpx-hero-accent">thật rõ ràng.</span>
          </h1>

          <p className="hpx-hero-sub">
            TaskFlow giúp bạn ghi lại ý tưởng, sắp xếp dự án và hoàn thành những điều
            quan trọng — mỗi ngày, trên mọi thiết bị.
          </p>

          <div className="hpx-hero-actions">
            <button className="hpx-cta-primary" type="button" onClick={onStartForFree}>
              Bắt đầu miễn phí
            </button>
            <button className="hpx-cta-ghost" type="button" onClick={onLogin}>
              Xem cách hoạt động <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Hero stage: ảnh nổi bật ở trung tâm + parallax */}
        <div className="hpx-hero-stage" ref={stageRef}>
          <div className="hpx-hero-glow" aria-hidden="true" />
          <div className="hpx-hero-frame">
            <img src="/home-hero.png" alt="Giao diện ứng dụng TaskFlow" />
          </div>
          <div className="hpx-float hpx-float-1">
            <CheckCircle2 size={15} color="#22a06b" />
            <span>3 việc đã xong hôm nay</span>
          </div>
          <div className="hpx-float hpx-float-2">
            <Bell size={15} color="#e2560a" />
            <span>Họp nhóm · 9:00 sáng</span>
          </div>
          <div className="hpx-float hpx-float-3">
            <Sparkles size={15} color="#ff9d2e" />
            <span>Nhận diện ngày thông minh</span>
          </div>
        </div>
      </section>

      {/* ── Logos marquee ─────────────────────────────────────── */}
      <div className="hpx-logos">
        <p className="hpx-logos-label">Được nhắc đến trên</p>
        <div className="hpx-logos-mask">
          <div className="hpx-logos-track">
            {[...homeLogos, ...homeLogos].map((logo, i) => (
              <span key={`${logo}-${i}`} className="hpx-logo-item">{logo}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features (bento) ──────────────────────────────────── */}
      <section className="hpx-section">
        <div className="hpx-container">
          <div className="hpx-head" data-reveal>
            <span className="hpx-eyebrow">Tính năng nổi bật</span>
            <h2>Thiết kế theo đúng cách bạn làm việc</h2>
            <p>Từ việc cá nhân nhanh gọn đến dự án nhóm phức tạp, TaskFlow thích nghi với mọi quy trình.</p>
          </div>

          <div className="hpx-features-grid">
            {homeFeatureCards.map((card, i) => {
              const Icon = ICONS[card.icon];
              return (
                <article
                  key={card.title}
                  className="hpx-feature"
                  data-reveal
                  style={{ "--d": `${(i % 3) * 90}ms` }}
                >
                  <span className="hpx-feature-glow" aria-hidden="true" />
                  <div className="hpx-feature-icon" style={{ background: card.iconBg }}>
                    {Icon && <Icon size={24} color={card.iconColor} strokeWidth={2} />}
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Showcase / giới thiệu app ─────────────────────────── */}
      <section className="hpx-section hpx-showcase">
        <div className="hpx-container">
          <div className="hpx-showcase-text" data-reveal>
            <span className="hpx-eyebrow">Về TaskFlow</span>
            <h2>Một nơi duy nhất cho mọi việc cần làm</h2>
            <p>
              Ghi lại bằng ngôn ngữ tự nhiên, sắp xếp theo dự án và xem mọi thứ rõ ràng
              theo danh sách, bảng hay lịch. Đồng bộ tức thì trên iOS, Android, Mac, Windows và Web.
            </p>
            <ul className="hpx-check-list">
              {[
                "Thêm việc tức thì với nhận diện ngày thông minh",
                "Chuyển đổi linh hoạt giữa Danh sách · Bảng · Lịch",
                "Nhắc việc, lịch lặp và mức ưu tiên rõ ràng",
                "Đồng bộ thời gian thực trên mọi thiết bị",
              ].map((point) => (
                <li key={point}>
                  <span className="hpx-check-ic"><Check size={15} strokeWidth={3} /></span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="hpx-showcase-media" data-reveal style={{ "--d": "120ms" }}>
            <img src="/home-hero.png" alt="Bảng điều khiển TaskFlow" />
          </div>
        </div>
      </section>

      {/* ── Stats (dark) ──────────────────────────────────────── */}
      <section className="hpx-section is-dark">
        <div className="hpx-container">
          <div className="hpx-stats-grid">
            {homeStats.map((stat, i) => (
              <article key={stat.label} className="hpx-stat" data-reveal style={{ "--d": `${i * 90}ms` }}>
                <p className="hpx-stat-value">{stat.value}</p>
                <p className="hpx-stat-label">{stat.label}</p>
                <p className="hpx-stat-sub">{stat.sub}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflow ──────────────────────────────────────────── */}
      <section className="hpx-section">
        <div className="hpx-container">
          <div className="hpx-head" data-reveal>
            <span className="hpx-eyebrow">Cách hoạt động</span>
            <h2>Từ ý tưởng đến hoàn thành chỉ trong 3 bước</h2>
            <p>Một hệ thống đơn giản, mở rộng từ làm việc cá nhân đến cộng tác liên nhóm.</p>
          </div>

          <div className="hpx-steps">
            {homeWorkflowSteps.map((step, i) => {
              const Icon = ICONS[step.icon];
              return (
                <article key={step.title} className="hpx-step" data-reveal style={{ "--d": `${i * 110}ms` }}>
                  <span className="hpx-step-num">{step.step}</span>
                  <div className="hpx-step-icon" style={{ background: step.iconBg }}>
                    {Icon && <Icon size={26} color={step.iconColor} strokeWidth={2} />}
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Use cases ─────────────────────────────────────────── */}
      <section className="hpx-section">
        <div className="hpx-container">
          <div className="hpx-head" data-reveal>
            <span className="hpx-eyebrow">Dành cho mọi người</span>
            <h2>Phù hợp cho cả cá nhân và nhóm</h2>
            <p>Bắt đầu với kế hoạch cá nhân và phát triển thành không gian cộng tác khi bạn sẵn sàng.</p>
          </div>

          <div className="hpx-usecases-grid">
            {homeUseCases.map((uc, i) => (
              <article key={uc.title} className="hpx-usecase" data-reveal style={{ "--d": `${i * 110}ms` }}>
                <div className="hpx-usecase-head">
                  <span className="hpx-usecase-emoji">{uc.emoji}</span>
                  <div>
                    <p className="hpx-usecase-sub">{uc.subtitle}</p>
                    <h3>{uc.title}</h3>
                  </div>
                </div>
                <ul className="hpx-usecase-list">
                  {uc.points.map((point) => (
                    <li key={point}>
                      <CheckCircle2 size={16} color="#e2560a" strokeWidth={2.5} />
                      {point}
                    </li>
                  ))}
                </ul>
                <button className="hpx-usecase-cta" type="button" onClick={onStartForFree}>
                  Bắt đầu ngay <ArrowRight size={16} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="hpx-section">
        <div className="hpx-container">
          <div className="hpx-head" data-reveal>
            <span className="hpx-eyebrow">Khách hàng nói gì</span>
            <h2>Được yêu thích trên toàn thế giới</h2>
          </div>

          <div className="hpx-quotes-grid">
            {homeTestimonials.map((t, i) => (
              <article key={t.author} className="hpx-quote" data-reveal style={{ "--d": `${i * 90}ms` }}>
                <Stars count={t.stars} />
                <blockquote className="hpx-quote-text">&ldquo;{t.quote}&rdquo;</blockquote>
                <div className="hpx-quote-author">
                  <span className="hpx-quote-avatar" style={{ background: t.color }}>{t.initials}</span>
                  <div>
                    <p className="hpx-quote-name">{t.author}</p>
                    <p className="hpx-quote-role">{t.role} · {t.source}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA band ──────────────────────────────────────────── */}
      <section className="hpx-cta">
        <div className="hpx-cta-aurora" aria-hidden="true" />
        <div className="hpx-cta-inner">
          <h2 data-reveal>Sẵn sàng biến kế hoạch thành kết quả?</h2>
          <p data-reveal style={{ "--d": "80ms" }}>
            Tạo không gian làm việc, mời nhóm của bạn và chạm mốc tiếp theo nhanh hơn.
          </p>
          <div className="hpx-cta-actions" data-reveal style={{ "--d": "160ms" }}>
            <button className="hpx-cta-band-primary" type="button" onClick={onStartForFree}>
              Bắt đầu miễn phí — không cần thẻ
            </button>
            <button className="hpx-cta-band-ghost" type="button" onClick={onLogin}>
              Đã có tài khoản? Đăng nhập <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="hpx-footer">
        <div className="hpx-footer-inner">
          <div className="hpx-footer-brand">
            <Logo />
            <p className="hpx-footer-tagline">
              Trình quản lý công việc số 1 thế giới.<br />Đơn giản. Mạnh mẽ. Bắt đầu miễn phí.
            </p>
            <div className="hpx-footer-social">
              {homeFooterSocial.map((item) => (
                <a key={item.label} href="#social" className="hpx-social-chip" aria-label={item.label}>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="hpx-footer-links">
            {homeFooterColumns.map((col) => (
              <div key={col.title} className="hpx-footer-col">
                <h4>{col.title}</h4>
                <ul>
                  {col.links.map((link) => (
                    <li key={link}><a href="#link">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="hpx-footer-bottom">
          <p>© {new Date().getFullYear()} TaskFlow. Bảo lưu mọi quyền.</p>
          <div className="hpx-footer-bottom-links">
            <a href="#privacy">Quyền riêng tư</a>
            <a href="#terms">Điều khoản</a>
            <a href="#cookies">Cookie</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
