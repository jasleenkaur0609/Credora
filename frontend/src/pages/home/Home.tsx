import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  FileCheck2,
  FileText,
  Fingerprint,
  Gauge,
  Globe2,
  Menu,
  Network,
  Play,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";

import "./Home.css";

const capabilityCards = [
  {
    number: "01",
    icon: FileCheck2,
    title: "Document Intelligence",
    description:
      "Extract, validate and understand application documents automatically while reducing manual review effort.",
    points: [
      "AI-powered extraction",
      "Document quality checks",
      "Missing document detection",
    ],
    accent: "jade",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "AI Credit Intelligence",
    description:
      "Turn applicant information, financial data and credit history into actionable credit intelligence.",
    points: [
      "Credit profile analysis",
      "Income & obligation insights",
      "Explainable recommendations",
    ],
    accent: "gold",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Risk & Fraud Intelligence",
    description:
      "Identify risk signals, inconsistencies and potential fraud indicators before decisions are finalized.",
    points: [
      "Multi-dimensional risk scoring",
      "Anomaly detection",
      "Explainable risk factors",
    ],
    accent: "terracotta",
  },
  {
    number: "04",
    icon: UserCheck,
    title: "Intelligent Underwriting",
    description:
      "Give underwriters a complete decision workspace with AI-assisted analysis and policy-aware recommendations.",
    points: [
      "AI underwriting assistant",
      "Policy validation",
      "Human-in-the-loop decisions",
    ],
    accent: "jade",
  },
];

const workflowSteps = [
  {
    number: "01",
    title: "Capture",
    description: "Collect application and customer information.",
  },
  {
    number: "02",
    title: "Understand",
    description: "Extract and structure information with AI.",
  },
  {
    number: "03",
    title: "Assess",
    description: "Evaluate credit, risk and verification signals.",
  },
  {
    number: "04",
    title: "Decide",
    description: "Support intelligent underwriting and approvals.",
  },
  {
    number: "05",
    title: "Disburse",
    description: "Move approved applications toward fulfillment.",
  },
];

const governanceItems = [
  {
    icon: Users,
    title: "Role-based access",
    description:
      "Give every team member access to exactly what they need based on their role and responsibilities.",
  },
  {
    icon: Network,
    title: "Approval controls",
    description:
      "Create structured approval journeys with configurable authority levels and decision controls.",
  },
  {
    icon: Fingerprint,
    title: "Audit-ready history",
    description:
      "Maintain a transparent record of application activity, decisions, changes and user actions.",
  },
  {
    icon: Globe2,
    title: "Global-ready",
    description:
      "Design processes for multiple languages, regions, products and operational requirements.",
  },
];

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);

    const element = document.getElementById(id);

    if (!element) return;

    const navHeight = 86;

    const targetPosition =
      element.getBoundingClientRect().top +
      window.scrollY -
      navHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  };

  return (
    <div className="home-page">
      {/* Background */}
      <div className="home-background">
        <div className="background-orb orb-one" />
        <div className="background-orb orb-two" />
        <div className="background-grid" />
      </div>

      {/* Navigation */}
      <header className="home-nav">
        <div className="home-nav-inner">
          <button
            className="home-brand"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Credora home"
          >
            <div className="brand-mark">
              <span />
              <span />
              <span />
            </div>

            <div className="brand-copy">
              <strong>Credora</strong>
              <span>Credit Intelligence</span>
            </div>
          </button>

          <nav className={`home-nav-links ${mobileMenuOpen ? "open" : ""}`}>
            <button onClick={() => scrollToSection("platform")}>
              Platform
            </button>

            <button onClick={() => scrollToSection("intelligence")}>
              Intelligence
            </button>

            <button onClick={() => scrollToSection("workflow")}>
              Workflow
            </button>

            <button onClick={() => scrollToSection("governance")}>
              Governance
            </button>

            <button
              className="mobile-nav-cta"
              onClick={() => {
                setMobileMenuOpen(false);
                window.location.href = "/login";
              }}
            >
              Enter Credora
              <ArrowRight size={16} />
            </button>
          </nav>

          <div className="home-nav-actions">
            <Link to="/login" className="nav-login">
              Sign in
            </Link>

            <Link to="/login" className="nav-cta">
              Enter Credora
              <ArrowRight size={16} />
            </Link>
          </div>

          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Hero */}
      <main>
        <motion.section
          className="hero-section"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="hero-container">
            <div className="hero-content">
              <motion.div
                className="eyebrow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="eyebrow-dot" />
                Intelligent Credit Operations
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1 }}
              >
                Make every credit
                <span className="hero-gradient-text">
                  {" "}
                  decision more intelligent.
                </span>
              </motion.h1>

              <motion.p
                className="hero-description"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Credora brings applications, documents, verification,
                credit, risk, underwriting and approvals into one
                intelligent operating environment.
              </motion.p>

              <motion.div
                className="hero-actions"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <Link to="/login" className="primary-button">
                  Explore Credora
                  <ArrowRight size={18} />
                </Link>

                <button
                  className="secondary-button"
                  onClick={() => scrollToSection("intelligence")}
                >
                  <span className="play-icon">
                    <Play size={13} fill="currentColor" />
                  </span>
                  See how it works
                </button>
              </motion.div>

              <motion.div
                className="hero-trust"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.55 }}
              >
                <div className="trust-avatars">
                  <span>AK</span>
                  <span>RS</span>
                  <span>MJ</span>
                  <span>+</span>
                </div>

                <div>
                  <strong>Built for modern credit teams</strong>
                  <p>
                    Operations · Credit · Risk · Underwriting ·
                    Leadership
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Product Preview */}
            <motion.div
              className="hero-product"
              initial={{ opacity: 0, x: 60, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                duration: 0.9,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="product-glow" />

              <div className="dashboard-window">
                <div className="window-topbar">
                  <div className="window-brand">
                    <div className="mini-brand-mark">
                      <span />
                      <span />
                    </div>
                    Credora
                  </div>

                  <div className="window-controls">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <div className="dashboard-content">
                  <div className="dashboard-sidebar">
                    <div className="sidebar-profile">
                      <div className="profile-avatar">JK</div>

                      <div>
                        <strong>Credit Ops</strong>
                        <span>Workspace</span>
                      </div>
                    </div>

                    <div className="sidebar-menu">
                      <span className="active">
                        <Gauge size={14} />
                        Overview
                      </span>

                      <span>
                        <FileText size={14} />
                        Applications
                      </span>

                      <span>
                        <ShieldCheck size={14} />
                        Risk
                      </span>

                      <span>
                        <BrainCircuit size={14} />
                        Intelligence
                      </span>
                    </div>
                  </div>

                  <div className="dashboard-main">
                    <div className="dashboard-heading">
                      <div>
                        <span className="mini-label">
                          Portfolio overview
                        </span>

                        <h3>Good afternoon, team.</h3>
                      </div>

                      <div className="date-chip">
                        <span />
                        Live
                      </div>
                    </div>

                    <div className="dashboard-stats">
                      <div className="mini-stat">
                        <span>Total Applications</span>
                        <strong>1,284</strong>
                        <small className="positive">
                          +12.8%
                        </small>
                      </div>

                      <div className="mini-stat">
                        <span>Approval Rate</span>
                        <strong>72.4%</strong>
                        <small className="positive">
                          +4.6%
                        </small>
                      </div>

                      <div className="mini-stat">
                        <span>High Risk</span>
                        <strong>8.7%</strong>
                        <small className="negative">
                          -2.1%
                        </small>
                      </div>
                    </div>

                    <div className="dashboard-grid">
                      <div className="chart-card">
                        <div className="chart-header">
                          <div>
                            <span>Application flow</span>
                            <strong>1,284</strong>
                          </div>

                          <ChevronDown size={14} />
                        </div>

                        <div className="fake-chart">
                          <div className="chart-line">
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                          </div>

                          <div className="chart-axis">
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                          </div>
                        </div>
                      </div>

                      <div className="risk-card">
                        <div className="chart-header">
                          <span>Risk distribution</span>
                          <ArrowUpRight size={14} />
                        </div>

                        <div className="risk-visual">
                          <div className="risk-ring">
                            <div>
                              <strong>72%</strong>
                              <span>Low</span>
                            </div>
                          </div>

                          <div className="risk-legend">
                            <span>
                              <i className="low" />
                              Low <strong>72%</strong>
                            </span>

                            <span>
                              <i className="medium" />
                              Medium <strong>19%</strong>
                            </span>

                            <span>
                              <i className="high" />
                              High <strong>9%</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ai-preview-card">
                      <div className="ai-preview-icon">
                        <Sparkles size={17} />
                      </div>

                      <div className="ai-preview-content">
                        <div className="ai-preview-title">
                          <strong>AI insight</strong>
                          <span>Updated moments ago</span>
                        </div>

                        <p>
                          Approval efficiency improved 14% this week.
                          Three applications may require additional
                          income verification.
                        </p>
                      </div>

                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                className="floating-insight-card"
                animate={{ y: [0, -9, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="floating-icon">
                  <Sparkles size={15} />
                </div>

                <div>
                  <strong>AI recommendation</strong>
                  <span>Low risk · 94% confidence</span>
                </div>
              </motion.div>

              <motion.div
                className="floating-risk-card"
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <CheckCircle2 size={17} />
                <div>
                  <strong>Verification complete</strong>
                  <span>Application CR-10482</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <button
            className="hero-scroll-indicator"
            onClick={() => scrollToSection("platform")}
          >
            <span>Explore the platform</span>
            <ChevronDown size={17} />
          </button>
        </motion.section>

        {/* Stats */}
        <motion.section
          className="stats-section"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="stats-container">
            <div className="stat-item">
              <strong>01</strong>
              <span>Unified workspace</span>
            </div>

            <div className="stat-item">
              <strong>05+</strong>
              <span>Core credit stages</span>
            </div>

            <div className="stat-item">
              <strong>AI</strong>
              <span>Assisted decisioning</span>
            </div>

            <div className="stat-item">
              <strong>360°</strong>
              <span>Application visibility</span>
            </div>
          </div>
        </motion.section>

        {/* Platform */}
        <motion.section
          className="platform-section"
          id="platform"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-container">
            <div className="section-intro">
              <div className="section-kicker">
                <span />
                THE PLATFORM
              </div>

              <h2>
                Everything your credit
                <span> operation needs.</span>
              </h2>

              <p>
                Replace fragmented workflows with one connected
                operating environment designed around the complete
                loan lifecycle.
              </p>
            </div>

            <div className="capability-grid">
              {capabilityCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <motion.article
                    className={`capability-card accent-${card.accent}`}
                    key={card.number}
                    initial={{ opacity: 0, y: 45 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.65,
                      delay: index * 0.08,
                    }}
                    whileHover={{ y: -8 }}
                  >
                    <div className="capability-top">
                      <span className="capability-number">
                        {card.number}
                      </span>

                      <div className="capability-icon">
                        <Icon size={21} />
                      </div>
                    </div>

                    <div className="capability-content">
                      <h3>{card.title}</h3>

                      <p>{card.description}</p>

                      <ul>
                        {card.points.map((point) => (
                          <li key={point}>
                            <CheckCircle2 size={15} />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      className="card-link"
                      onClick={() => scrollToSection("intelligence")}
                    >
                      Explore capability
                      <ArrowUpRight size={15} />
                    </button>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Intelligence */}
        <motion.section
          className="intelligence-section"
          id="intelligence"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.75 }}
        >
          <div className="intelligence-grid">
            <div className="intelligence-copy">
              <div className="section-kicker light">
                <span />
                INTELLIGENCE LAYER
              </div>

              <h2>
                AI that helps your
                <span> team think faster.</span>
              </h2>

              <p>
                Credora places intelligence directly inside the credit
                workflow. Your teams get context, explanations and
                recommendations without losing human control.
              </p>

              <div className="intelligence-features">
                <div>
                  <Sparkles size={18} />
                  <span>Application-aware AI assistant</span>
                </div>

                <div>
                  <Zap size={18} />
                  <span>Explainable credit and risk insights</span>
                </div>

                <div>
                  <ShieldCheck size={18} />
                  <span>Human-in-the-loop decision governance</span>
                </div>
              </div>

              <Link to="/login" className="dark-button">
                Explore AI intelligence
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="ai-interface">
              <div className="ai-interface-header">
                <div className="ai-header-title">
                  <div className="ai-logo">
                    <Sparkles size={17} />
                  </div>

                  <div>
                    <strong>Credora Intelligence</strong>
                    <span>Application assistant</span>
                  </div>
                </div>

                <span className="ai-live">
                  <i />
                  Live
                </span>
              </div>

              <div className="ai-interface-body">
                <div className="ai-message ai-user">
                  <span className="message-avatar">CO</span>

                  <div className="message-bubble">
                    Summarize the key risk factors for CR-10482.
                  </div>
                </div>

                <div className="ai-message">
                  <span className="message-avatar ai">
                    <Sparkles size={14} />
                  </span>

                  <div className="message-bubble ai-bubble">
                    <strong>
                      Application risk summary
                    </strong>

                    <p>
                      The application currently presents a low-to-medium
                      overall risk profile.
                    </p>

                    <div className="ai-score-row">
                      <span>Risk score</span>
                      <strong>28 / 100</strong>
                    </div>

                    <div className="ai-factor">
                      <span>
                        <CheckCircle2 size={13} />
                        Stable income
                      </span>

                      <b>Positive</b>
                    </div>

                    <div className="ai-factor">
                      <span>
                        <CheckCircle2 size={13} />
                        Strong repayment history
                      </span>

                      <b>Positive</b>
                    </div>

                    <div className="ai-factor warning">
                      <span>
                        <CircleAlert size={13} />
                        Recent credit enquiry
                      </span>

                      <b>Review</b>
                    </div>

                    <div className="ai-recommendation">
                      <Sparkles size={14} />
                      <span>
                        Recommendation: proceed to underwriting with
                        standard verification.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ai-input">
                  <span>Ask about this application...</span>
                  <div>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Workflow */}
        <motion.section
          className="workflow-section"
          id="workflow"
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.75 }}
        >
          <div className="section-container">
            <div className="workflow-heading">
              <div>
                <div className="section-kicker">
                  <span />
                  CONNECTED WORKFLOW
                </div>

                <h2>
                  From application
                  <span> to decision.</span>
                </h2>
              </div>

              <p>
                Every stage connects to the next, giving teams a
                continuous view of progress, risk and decision readiness.
              </p>
            </div>

            <div className="workflow-track">
              <div className="workflow-line" />

              {workflowSteps.map((step, index) => (
                <motion.div
                  className="workflow-step"
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                >
                  <div className="workflow-node">
                    {step.number}
                  </div>

                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Governance */}
        <motion.section
          className="governance-section"
          id="governance"
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.75 }}
        >
          <div className="section-container">
            <div className="governance-header">
              <div className="section-kicker">
                <span />
                GOVERNANCE
              </div>

              <h2>
                Intelligence with
                <span> accountability.</span>
              </h2>

              <p>
                Powerful automation should never mean losing control.
                Credora keeps permissions, approvals, policies and
                decisions transparent.
              </p>
            </div>

            <div className="governance-grid">
              {governanceItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    className="governance-card"
                    key={item.title}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.08,
                    }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="governance-icon">
                      <Icon size={20} />
                    </div>

                    <h3>{item.title}</h3>

                    <p>{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section
          className="final-cta-section"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="final-cta-glow" />

          <div className="final-cta-content">
            <div className="section-kicker light">
              <span />
              THE NEXT GENERATION OF CREDIT OPERATIONS
            </div>

            <h2>
              Build a smarter
              <span> credit operation.</span>
            </h2>

            <p>
              Bring your people, processes, data and intelligence
              together with Credora.
            </p>

            <Link to="/login" className="final-cta-button">
              Enter Credora
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="home-brand">
              <div className="brand-mark">
                <span />
                <span />
                <span />
              </div>

              <div className="brand-copy">
                <strong>Credora</strong>
                <span>Credit Intelligence</span>
              </div>
            </div>

            <p>
              Intelligent loan origination and credit operations,
              designed for modern financial teams.
            </p>
          </div>

          <div className="footer-column">
            <span>Platform</span>
            <button onClick={() => scrollToSection("platform")}>
              Capabilities
            </button>
            <button onClick={() => scrollToSection("workflow")}>
              Workflow
            </button>
            <button onClick={() => scrollToSection("intelligence")}>
              Intelligence
            </button>
          </div>

          <div className="footer-column">
            <span>Enterprise</span>
            <button onClick={() => scrollToSection("governance")}>
              Governance
            </button>
            <button>Security</button>
            <button>Administration</button>
          </div>

          <div className="footer-column">
            <span>Access</span>
            <Link to="/login">Sign in</Link>
            <Link to="/login">Enter Credora</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Credora. Intelligent credit operations.</span>

          <div>
            <span>Privacy</span>
            <span>Security</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;