import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Filter,
  Globe,
  Inbox,
  LayoutGrid,
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
    <div className="hp-logo">
      <span className="hp-logo-mark" aria-hidden="true" />
      <span className="hp-logo-word">TaskFlow</span>
    </div>
  );
}

function StarRow({ count = 5 }) {
  return (
    <span className="hp-stars" aria-label={`${count} stars`}>
      {"★".repeat(count)}
    </span>
  );
}

export default function HomePage({ onLogin, onStartForFree }) {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="hp-shell">
      {/* ── Sticky nav ───────────────────────────────────────── */}
      <header className={`hp-header ${scrolled ? "hp-header-scrolled" : ""}`}>
        <div className="hp-header-inner">
          <Logo />
          <nav className="hp-nav">
            {homeNavLinks.map((label) => (
              <button key={label} className="hp-nav-link" type="button">{label}</button>
            ))}
          </nav>
          <div className="hp-header-actions">
            <button className="hp-btn-ghost" type="button" onClick={onLogin}>Log in</button>
            <button className="hp-btn-primary" type="button" onClick={onStartForFree}>
              Start for free
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hp-hero" ref={heroRef}>
        <div className="hp-hero-bg" aria-hidden="true" />
        <div className="hp-hero-inner">
          <div className="hp-hero-left">
            <div className="hp-badge">
              <span className="hp-badge-dot" />
              Trusted by 50M+ professionals worldwide
            </div>

            <h1 className="hp-hero-h1">
              Clarity,&nbsp;<span className="hp-hero-accent">finally.</span>
            </h1>

            <p className="hp-hero-sub">
              The world&apos;s #1 task manager. Capture ideas, organize projects,
              and finish what matters — every single day.
            </p>

            <div className="hp-hero-actions">
              <button className="hp-cta-primary" type="button" onClick={onStartForFree}>
                Start for free
              </button>
              <button className="hp-cta-ghost" type="button" onClick={onLogin}>
                Log in →
              </button>
            </div>

            <div className="hp-rating-row">
              <div className="hp-rating-chip">
                <StarRow />
                <span>4.8 on App Store</span>
              </div>
              <div className="hp-rating-chip">
                <StarRow />
                <span>4.9 on Google Play</span>
              </div>
            </div>
          </div>

          <div className="hp-hero-right">
            <div className="hp-hero-mockup">
              <img src="/home-hero.png" alt="TaskFlow app preview" />
              {/* Floating badge */}
              <div className="hp-float-badge hp-float-badge-1">
                <CheckCircle2 size={14} color="#3aab7b" />
                <span>3 tasks completed today</span>
              </div>
              <div className="hp-float-badge hp-float-badge-2">
                <Bell size={14} color="#eb8909" />
                <span>Team standup · 9:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Logo trust bar ───────────────────────────────────── */}
      <div className="hp-logos-bar">
        <p className="hp-logos-label">Featured in</p>
        <div className="hp-logos-row">
          {homeLogos.map((logo) => (
            <span key={logo} className="hp-logo-item">{logo}</span>
          ))}
        </div>
      </div>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="hp-testimonials">
        <div className="hp-section-inner">
          <div className="hp-testimonials-grid">
            {homeTestimonials.map((t) => (
              <article key={t.author} className="hp-quote-card">
                <StarRow count={t.stars} />
                <blockquote className="hp-quote-text">&ldquo;{t.quote}&rdquo;</blockquote>
                <div className="hp-quote-author">
                  <span className="hp-quote-avatar" style={{ background: t.color }}>
                    {t.initials}
                  </span>
                  <div>
                    <p className="hp-quote-name">{t.author}</p>
                    <p className="hp-quote-role">{t.role} · via {t.source}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="hp-features">
        <div className="hp-section-inner">
          <div className="hp-section-header">
            <p className="hp-eyebrow">Everything you need</p>
            <h2>Built for the way you actually work</h2>
            <p className="hp-section-sub">
              From quick personal to-dos to complex team projects, TaskFlow adapts to any workflow.
            </p>
          </div>
          <div className="hp-features-grid">
            {homeFeatureCards.map((card) => {
              const Icon = ICONS[card.icon];
              return (
                <article key={card.title} className="hp-feature-card">
                  <div className="hp-feature-icon-wrap" style={{ background: card.iconBg }}>
                    {Icon && <Icon size={22} color={card.iconColor} strokeWidth={2} />}
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="hp-stats">
        <div className="hp-section-inner">
          <div className="hp-stats-grid">
            {homeStats.map((stat) => (
              <article key={stat.label} className="hp-stat-card">
                <p className="hp-stat-value">{stat.value}</p>
                <p className="hp-stat-label">{stat.label}</p>
                <p className="hp-stat-sub">{stat.sub}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflow ─────────────────────────────────────────── */}
      <section className="hp-workflow">
        <div className="hp-section-inner">
          <div className="hp-section-header">
            <p className="hp-eyebrow">How it works</p>
            <h2>From idea to done, in three steps</h2>
            <p className="hp-section-sub">
              A simple system that scales from solo focus work to cross-team collaboration.
            </p>
          </div>

          <div className="hp-workflow-grid">
            {homeWorkflowSteps.map((step, i) => {
              const Icon = ICONS[step.icon];
              return (
                <article key={step.title} className="hp-workflow-card">
                  <div className="hp-workflow-top">
                    <div className="hp-workflow-icon-wrap" style={{ background: step.iconBg }}>
                      {Icon && <Icon size={24} color={step.iconColor} strokeWidth={2} />}
                    </div>
                    {i < homeWorkflowSteps.length - 1 && (
                      <div className="hp-workflow-connector" aria-hidden="true" />
                    )}
                  </div>
                  <span className="hp-workflow-step">{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Use cases ────────────────────────────────────────── */}
      <section className="hp-usecases">
        <div className="hp-section-inner">
          <div className="hp-section-header">
            <p className="hp-eyebrow">For everyone</p>
            <h2>Built for both solo and teams</h2>
            <p className="hp-section-sub">
              Start with personal planning and grow into a collaborative workspace whenever you&apos;re ready.
            </p>
          </div>

          <div className="hp-usecases-grid">
            {homeUseCases.map((uc) => (
              <article key={uc.title} className="hp-usecase-card" style={{ "--uc-color": uc.color }}>
                <div className="hp-usecase-header">
                  <span className="hp-usecase-emoji">{uc.emoji}</span>
                  <div>
                    <p className="hp-usecase-subtitle">{uc.subtitle}</p>
                    <h3>{uc.title}</h3>
                  </div>
                </div>
                <ul className="hp-usecase-list">
                  {uc.points.map((point) => (
                    <li key={point}>
                      <CheckCircle2 size={15} color={uc.color} strokeWidth={2.5} />
                      {point}
                    </li>
                  ))}
                </ul>
                <button className="hp-usecase-cta" type="button" onClick={onStartForFree}
                  style={{ color: uc.color, borderColor: uc.color }}>
                  Get started →
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────────────────── */}
      <section className="hp-cta-band">
        <div className="hp-cta-band-bg" aria-hidden="true" />
        <div className="hp-cta-band-inner">
          <h2>Ready to turn planning into progress?</h2>
          <p>Create your workspace, invite your team, and ship your next milestone faster.</p>
          <div className="hp-cta-band-actions">
            <button className="hp-cta-band-primary" type="button" onClick={onStartForFree}>
              Start for free — no credit card
            </button>
            <button className="hp-cta-band-ghost" type="button" onClick={onLogin}>
              Already have an account? Log in →
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="hp-footer">
        <div className="hp-footer-inner">
          <div className="hp-footer-brand">
            <Logo />
            <p className="hp-footer-tagline">
              The world&apos;s #1 task manager.<br />Simple. Powerful. Free to start.
            </p>
            <div className="hp-footer-social">
              {homeFooterSocial.map((item) => (
                <a key={item.label} href="#social" className="hp-social-chip" aria-label={item.label}>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="hp-footer-links">
            {homeFooterColumns.map((col) => (
              <div key={col.title} className="hp-footer-col">
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

        <div className="hp-footer-bottom">
          <p>© {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
          <div className="hp-footer-bottom-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#cookies">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
