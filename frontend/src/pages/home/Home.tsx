import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  CreditCard,
  FileCheck2,
  FileText,
  Fingerprint,
  Gauge,
  Globe2,
  Landmark,
  LockKeyhole,
  Menu,
  Network,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  Workflow,
  X,
} from "lucide-react";

import "./Home.css";

const capabilities = [
  {
    icon: FileCheck2,
    eyebrow: "DOCUMENT INTELLIGENCE",
    title: "Understand every document.",
    description:
      "Convert application documents into structured, validated information while reducing repetitive manual review.",
    features: [
      "AI extraction & classification",
      "Missing document detection",
      "Quality & consistency checks",
    ],
  },
  {
    icon: CreditCard,
    eyebrow: "CREDIT INTELLIGENCE",
    title: "See the complete credit picture.",
    description:
      "Bring income, obligations, credit history and financial signals together in one decision-ready workspace.",
    features: [
      "Credit profile analysis",
      "Income & obligation analysis",
      "Explainable recommendations",
    ],
  },
  {
    icon: ShieldCheck,
    eyebrow: "RISK INTELLIGENCE",
    title: "Identify risk before decisions.",
    description:
      "Surface inconsistencies, anomalies and risk signals before they become expensive credit decisions.",
    features: [
      "Multi-dimensional risk scoring",
      "Anomaly detection",
      "Explainable risk factors",
    ],
  },
  {
    icon: UserCheck,
    eyebrow: "UNDERWRITING",
    title: "Empower better decisions.",
    description:
      "Give underwriters a complete view of the applicant with AI-assisted analysis and policy-aware recommendations.",
    features: [
      "Decision-ready workspace",
      "Policy-aware recommendations",
      "Human-in-the-loop controls",
    ],
  },
];

const workflow = [
  {
    number: "01",
    title: "Originate",
    text: "Capture applications and customer information.",
  },
  {
    number: "02",
    title: "Verify",
    text: "Validate identity, documents and financial information.",
  },
  {
    number: "03",
    title: "Assess",
    text: "Evaluate credit, risk and repayment capacity.",
  },
  {
    number: "04",
    title: "Decide",
    text: "Support underwriting and approval decisions.",
  },
  {
    number: "05",
    title: "Fulfil",
    text: "Complete agreements and move toward disbursement.",
  },
];

const enterpriseFeatures = [
  {
    icon: Users,
    title: "Role-based operations",
    text: "Give every team the right workspace, permissions and actions.",
  },
  {
    icon: LockKeyhole,
    title: "Controlled decisioning",
    text: "Configure approval authorities, escalation paths and decision controls.",
  },
  {
    icon: Fingerprint,
    title: "Complete audit trail",
    text: "Track decisions, changes, actions and application history.",
  },
  {
    icon: Globe2,
    title: "Built for scale",
    text: "Support products, branches, regions, teams and multilingual operations.",
  },
];

const navItems = [
  {
    label: "Platform",
    id: "platform",
  },
  {
    label: "Intelligence",
    id: "intelligence",
  },
  {
    label: "Workflow",
    id: "workflow",
  },
  {
    label: "Enterprise",
    id: "enterprise",
  },
];

function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { scrollYProgress } = useScroll();

  const heroY = useTransform(
    scrollYProgress,
    [0, 0.25],
    [0, -65],
  );

  const heroOpacity = useTransform(
    scrollYProgress,
    [0, 0.2],
    [1, 0.25],
  );

  const scrollToSection = (id: string) => {
    setMobileOpen(false);

    const element = document.getElementById(id);

    if (!element) return;

    const offset = 84;

    const position =
      element.getBoundingClientRect().top +
      window.scrollY -
      offset;

    window.scrollTo({
      top: position,
      behavior: "smooth",
    });
  };

  return (
    <div className="home-page">
      <div className="home-ambient">
        <div className="ambient-grid" />
        <div className="ambient-glow glow-one" />
        <div className="ambient-glow glow-two" />
        <div className="ambient-glow glow-three" />
      </div>

      {/* HEADER */}
      <header className="home-header">
        <div className="home-header-inner">
          <button
            className="home-logo"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            <div className="logo-symbol">
              <span />
              <span />
              <span />
            </div>

            <div className="logo-text">
              <strong>Credora</strong>
              <small>Credit Operations Platform</small>
            </div>
          </button>

          <nav
            className={`main-nav ${
              mobileOpen ? "mobile-open" : ""
            }`}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}

            <Link
              to="/login"
              className="mobile-enter-button"
              onClick={() => setMobileOpen(false)}
            >
              Open workspace
              <ArrowRight size={17} />
            </Link>
          </nav>

          <div className="header-actions">
            <Link to="/login" className="header-signin">
              Sign in
            </Link>

            <Link to="/login" className="header-enter">
              Open workspace
              <ArrowRight size={16} />
            </Link>
          </div>

          <button
            className="mobile-menu"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <motion.section
          className="hero"
          style={{
            y: heroY,
            opacity: heroOpacity,
          }}
        >
          <div className="hero-inner">
            <div className="hero-copy">
              <motion.div
                className="enterprise-label"
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                }}
              >
                <span className="status-pulse" />
                INTELLIGENT CREDIT OPERATIONS
              </motion.div>

              <motion.h1
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.75,
                  delay: 0.08,
                }}
              >
                One operating system
                <span>for every credit decision.</span>
              </motion.h1>

              <motion.p
                className="hero-text"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.65,
                  delay: 0.18,
                }}
              >
                Credora connects loan origination, documents,
                verification, credit, risk, underwriting, approvals
                and disbursement in one intelligent enterprise
                workspace.
              </motion.p>

              <motion.div
                className="hero-buttons"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.65,
                  delay: 0.28,
                }}
              >
                <Link
                  to="/login"
                  className="hero-primary"
                >
                  Enter Credora
                  <ArrowRight size={18} />
                </Link>

                <button
                  className="hero-secondary"
                  onClick={() =>
                    scrollToSection("platform")
                  }
                >
                  <Play size={14} fill="currentColor" />
                  Explore platform
                </button>
              </motion.div>

              <motion.div
                className="hero-proof"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.45,
                }}
              >
                <div>
                  <CheckCircle2 size={18} />
                  Human-controlled decisions
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  Complete application visibility
                </div>
              </motion.div>
            </div>

            {/* DASHBOARD */}
            <motion.div
              className="hero-dashboard-wrap"
              initial={{
                opacity: 0,
                x: 65,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.9,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="dashboard-glow" />

              <div className="enterprise-dashboard">
                <div className="dashboard-top">
                  <div className="dashboard-brand">
                    <div className="dashboard-logo">
                      <span />
                      <span />
                      <span />
                    </div>

                    <strong>Credora</strong>
                  </div>

                  <div className="dashboard-top-actions">
                    <div className="dashboard-search">
                      <Search size={12} />
                      Search applications
                    </div>

                    <div className="dashboard-bell">
                      <Bell size={14} />
                      <i />
                    </div>

                    <div className="dashboard-avatar">
                      JK
                    </div>
                  </div>
                </div>

                <div className="dashboard-body">
                  <aside className="dashboard-side">
                    <span className="side-label">
                      WORKSPACE
                    </span>

                    <div className="side-link active">
                      <Gauge size={14} />
                      Overview
                    </div>

                    <div className="side-link">
                      <FileText size={14} />
                      Applications
                    </div>

                    <div className="side-link">
                      <Users size={14} />
                      Customers
                    </div>

                    <span className="side-label operations">
                      CREDIT OPERATIONS
                    </span>

                    <div className="side-link">
                      <FileCheck2 size={14} />
                      Documents
                    </div>

                    <div className="side-link">
                      <ShieldCheck size={14} />
                      Risk
                    </div>

                    <div className="side-link">
                      <BrainCircuit size={14} />
                      Intelligence
                    </div>

                    <div className="side-link">
                      <Workflow size={14} />
                      Underwriting
                    </div>
                  </aside>

                  <div className="dashboard-main">
                    <div className="dashboard-heading">
                      <div>
                        <span>
                          PORTFOLIO OVERVIEW
                        </span>

                        <h3>Credit operations</h3>
                      </div>

                      <div className="dashboard-period">
                        <span />
                        Live portfolio
                        <ChevronDown size={12} />
                      </div>
                    </div>

                    <div className="kpi-grid">
                      <div className="kpi-card">
                        <span>Applications</span>
                        <strong>1,284</strong>

                        <small className="positive">
                          <TrendingUp size={11} />
                          12.8%
                        </small>
                      </div>

                      <div className="kpi-card">
                        <span>Approval rate</span>
                        <strong>72.4%</strong>

                        <small className="positive">
                          <TrendingUp size={11} />
                          4.6%
                        </small>
                      </div>

                      <div className="kpi-card">
                        <span>Avg. processing</span>
                        <strong>2.8d</strong>

                        <small className="positive">
                          <TrendingDown size={11} />
                          18.2%
                        </small>
                      </div>

                      <div className="kpi-card">
                        <span>High risk</span>
                        <strong>8.7%</strong>

                        <small className="negative">
                          <CircleAlert size={11} />
                          1.4%
                        </small>
                      </div>
                    </div>

                    <div className="dashboard-content-grid">
                      <div className="portfolio-chart">
                        <div className="panel-heading">
                          <div>
                            <span>
                              APPLICATION ACTIVITY
                            </span>

                            <strong>
                              1,284 applications
                            </strong>
                          </div>

                          <BarChart3 size={16} />
                        </div>

                        <div className="chart-area">
                          <div className="chart-y-axis">
                            <span>300</span>
                            <span>200</span>
                            <span>100</span>
                            <span>0</span>
                          </div>

                          <div className="chart-visual">
                            <div className="grid-line one" />
                            <div className="grid-line two" />
                            <div className="grid-line three" />

                            <div className="activity-bars">
                              <span style={{ height: "35%" }} />
                              <span style={{ height: "49%" }} />
                              <span style={{ height: "41%" }} />
                              <span style={{ height: "67%" }} />
                              <span style={{ height: "58%" }} />
                              <span style={{ height: "78%" }} />
                              <span style={{ height: "88%" }} />
                              <span style={{ height: "72%" }} />
                              <span style={{ height: "95%" }} />
                              <span style={{ height: "82%" }} />
                              <span style={{ height: "100%" }} />
                              <span style={{ height: "91%" }} />
                            </div>

                            <div className="chart-months">
                              <span>Jan</span>
                              <span>Feb</span>
                              <span>Mar</span>
                              <span>Apr</span>
                              <span>May</span>
                              <span>Jun</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="risk-panel">
                        <div className="panel-heading">
                          <div>
                            <span>RISK PROFILE</span>
                            <strong>Portfolio health</strong>
                          </div>

                          <ShieldCheck size={16} />
                        </div>

                        <div className="risk-score">
                          <div className="risk-circle">
                            <div>
                              <strong>72</strong>
                              <span>Low risk</span>
                            </div>
                          </div>
                        </div>

                        <div className="risk-list">
                          <div>
                            <span>
                              <i className="low" />
                              Low
                            </span>
                            <strong>72%</strong>
                          </div>

                          <div>
                            <span>
                              <i className="medium" />
                              Medium
                            </span>
                            <strong>19%</strong>
                          </div>

                          <div>
                            <span>
                              <i className="high" />
                              High
                            </span>
                            <strong>9%</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="dashboard-ai">
                      <div className="ai-symbol">
                        <Sparkles size={15} />
                      </div>

                      <div className="ai-copy">
                        <div>
                          <strong>
                            Credora Intelligence
                          </strong>

                          <span>
                            Updated now
                          </span>
                        </div>

                        <p>
                          18 applications may require additional
                          income verification before underwriting.
                        </p>
                      </div>

                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                className="floating-ai"
                animate={{
                  y: [0, -7, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div>
                  <Sparkles size={16} />
                </div>

                <section>
                  <strong>AI recommendation</strong>
                  <span>94% confidence · Low risk</span>
                </section>
              </motion.div>

              <motion.div
                className="floating-sla"
                animate={{
                  y: [0, 7, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Clock3 size={17} />

                <section>
                  <strong>SLA performance</strong>
                  <span>94.6% within target</span>
                </section>
              </motion.div>
            </motion.div>
          </div>

          <button
            className="hero-down"
            onClick={() =>
              scrollToSection("platform")
            }
          >
            <span>Explore Credora</span>
            <ChevronDown size={17} />
          </button>
        </motion.section>

        {/* OPERATING AREAS */}
        <section className="operating-strip">
          <div className="operating-inner">
            <span className="operating-title">
              ONE PLATFORM FOR
            </span>

            <div>
              <Landmark size={19} />
              Lending Operations
            </div>

            <div>
              <CreditCard size={19} />
              Credit Teams
            </div>

            <div>
              <ShieldCheck size={19} />
              Risk Management
            </div>

            <div>
              <UserCheck size={19} />
              Underwriting
            </div>

            <div>
              <BarChart3 size={19} />
              Operations Leadership
            </div>
          </div>
        </section>

        {/* PLATFORM */}
        <motion.section
          className="platform-section"
          id="platform"
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.12,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <div className="section-container">
            <div className="section-header">
              <div>
                <div className="section-eyebrow">
                  <span />
                  CORE PLATFORM
                </div>

                <h2>
                  Everything connected.
                  <span> Nothing fragmented.</span>
                </h2>
              </div>

              <p>
                Credora creates one operational record across the
                entire credit lifecycle so teams can work from the
                same context.
              </p>
            </div>

            <div className="capability-grid">
              {capabilities.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.article
                    className="capability"
                    key={item.title}
                    initial={{
                      opacity: 0,
                      y: 35,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.07,
                    }}
                    whileHover={{
                      y: -7,
                    }}
                  >
                    <div className="capability-top">
                      <div className="capability-icon">
                        <Icon size={23} />
                      </div>

                      <span>
                        0{index + 1}
                      </span>
                    </div>

                    <span className="capability-eyebrow">
                      {item.eyebrow}
                    </span>

                    <h3>{item.title}</h3>

                    <p>{item.description}</p>

                    <div className="capability-features">
                      {item.features.map((feature) => (
                        <div key={feature}>
                          <Check size={14} />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        scrollToSection("intelligence")
                      }
                    >
                      Explore capability
                      <ArrowUpRight size={16} />
                    </button>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* INTELLIGENCE */}
        <motion.section
          className="intelligence-section"
          id="intelligence"
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{
            duration: 0.75,
          }}
        >
          <div className="intelligence-container">
            <div className="intelligence-copy">
              <div className="section-eyebrow light">
                <span />
                INTELLIGENCE LAYER
              </div>

              <h2>
                AI inside the workflow.
                <span> Not outside it.</span>
              </h2>

              <p>
                Credora puts intelligence directly where credit teams
                work. Analyze applications, understand risk and
                surface recommendations without moving between
                disconnected tools.
              </p>

              <div className="intelligence-list">
                <div>
                  <div className="feature-icon">
                    <Sparkles size={18} />
                  </div>

                  <div>
                    <strong>
                      Application-aware AI
                    </strong>

                    <span>
                      Ask questions and receive context-aware answers
                      about an application.
                    </span>
                  </div>
                </div>

                <div>
                  <div className="feature-icon">
                    <Target size={18} />
                  </div>

                  <div>
                    <strong>
                      Explainable recommendations
                    </strong>

                    <span>
                      Understand the signals behind credit and risk
                      recommendations.
                    </span>
                  </div>
                </div>

                <div>
                  <div className="feature-icon">
                    <ShieldCheck size={18} />
                  </div>

                  <div>
                    <strong>
                      Human-controlled decisions
                    </strong>

                    <span>
                      AI assists the team while authorized humans
                      retain final decision authority.
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/login"
                className="intelligence-button"
              >
                Explore intelligence
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="intelligence-interface">
              <div className="interface-top">
                <div className="interface-title">
                  <div className="interface-icon">
                    <Sparkles size={17} />
                  </div>

                  <div>
                    <strong>
                      Credora Intelligence
                    </strong>

                    <span>
                      Application analysis
                    </span>
                  </div>
                </div>

                <span className="interface-live">
                  <i />
                  Active
                </span>
              </div>

              <div className="interface-content">
                <div className="analysis-header">
                  <div>
                    <span>APPLICATION</span>
                    <strong>CR-10482</strong>
                  </div>

                  <div className="analysis-status">
                    <CheckCircle2 size={14} />
                    Analysis complete
                  </div>
                </div>

                <div className="analysis-summary">
                  <div className="analysis-score">
                    <div className="score-ring">
                      <span>28</span>
                    </div>

                    <div>
                      <span>Overall risk</span>
                      <strong>Low risk</strong>
                    </div>
                  </div>

                  <div className="confidence">
                    <span>AI confidence</span>
                    <strong>94%</strong>
                  </div>
                </div>

                <div className="analysis-title">
                  Key risk factors
                </div>

                <div className="factor-list">
                  <div className="factor">
                    <div className="factor-left">
                      <CheckCircle2 size={16} />

                      <div>
                        <strong>
                          Stable income profile
                        </strong>

                        <span>
                          Positive indicator
                        </span>
                      </div>
                    </div>

                    <b>Positive</b>
                  </div>

                  <div className="factor">
                    <div className="factor-left">
                      <CheckCircle2 size={16} />

                      <div>
                        <strong>
                          Strong repayment history
                        </strong>

                        <span>
                          Positive indicator
                        </span>
                      </div>
                    </div>

                    <b>Positive</b>
                  </div>

                  <div className="factor warning">
                    <div className="factor-left">
                      <CircleAlert size={16} />

                      <div>
                        <strong>
                          Recent credit enquiry
                        </strong>

                        <span>
                          Requires review
                        </span>
                      </div>
                    </div>

                    <b>Review</b>
                  </div>
                </div>

                <div className="ai-recommendation">
                  <Sparkles size={16} />

                  <div>
                    <strong>
                      AI recommendation
                    </strong>

                    <p>
                      Proceed to underwriting with standard verification.
                      No critical risk indicators detected.
                    </p>
                  </div>
                </div>

                <div className="analysis-input">
                  <span>
                    Ask about this application...
                  </span>

                  <button>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* WORKFLOW */}
        <motion.section
          className="workflow-section"
          id="workflow"
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.12,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <div className="section-container">
            <div className="section-header">
              <div>
                <div className="section-eyebrow">
                  <span />
                  LOAN LIFECYCLE
                </div>

                <h2>
                  From application
                  <span> to decision.</span>
                </h2>
              </div>

              <p>
                Every stage carries information forward, giving
                operations teams one continuous view of application
                progress.
              </p>
            </div>

            <div className="workflow-visual">
              <div className="workflow-line" />

              {workflow.map((step, index) => (
                <motion.div
                  className="workflow-item"
                  key={step.number}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.3,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                >
                  <div className="workflow-number">
                    {step.number}
                  </div>

                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lifecycle-card">
              <div className="lifecycle-icon">
                <Workflow size={20} />
              </div>

              <div>
                <strong>
                  Complete loan lifecycle visibility
                </strong>

                <p>
                  Draft → Submitted → Verification → Credit →
                  Risk → Underwriting → Approval → Offer →
                  Agreement → Disbursement → Active → Closed
                </p>
              </div>

              <ArrowUpRight size={18} />
            </div>
          </div>
        </motion.section>

        {/* ENTERPRISE */}
        <motion.section
          className="enterprise-section"
          id="enterprise"
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <div className="section-container">
            <div className="enterprise-intro">
              <div className="section-eyebrow">
                <span />
                ENTERPRISE CONTROL
              </div>

              <h2>
                Intelligence with
                <span> accountability.</span>
              </h2>

              <p>
                Credit operations require more than automation.
                Credora combines intelligence with governance,
                permissions, approvals and complete operational
                traceability.
              </p>
            </div>

            <div className="enterprise-grid">
              {enterpriseFeatures.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    className="enterprise-card"
                    key={item.title}
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.07,
                    }}
                    whileHover={{
                      y: -5,
                    }}
                  >
                    <div className="enterprise-icon">
                      <Icon size={20} />
                    </div>

                    <h3>{item.title}</h3>

                    <p>{item.text}</p>

                    <span>
                      0{index + 1}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="governance-banner">
              <div className="governance-left">
                <div className="governance-icon">
                  <ShieldCheck size={23} />
                </div>

                <div>
                  <span>AI GOVERNANCE</span>

                  <strong>
                    AI assists. Authorized humans decide.
                  </strong>
                </div>
              </div>

              <div className="governance-points">
                <span>
                  <Check size={14} />
                  Explainable
                </span>

                <span>
                  <Check size={14} />
                  Auditable
                </span>

                <span>
                  <Check size={14} />
                  Permission-aware
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          className="final-section"
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.8,
          }}
        >
          <div className="final-grid" />

          <div className="final-glow" />

          <div className="final-content">
            <div className="section-eyebrow light">
              <span />
              CREDORA
            </div>

            <h2>
              Make credit operations
              <span> intelligent by design.</span>
            </h2>

            <p>
              One platform for applications, people, data,
              intelligence and decisions.
            </p>

            <Link
              to="/login"
              className="final-button"
            >
              Enter Credora
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.section>
      </main>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <button
              className="home-logo"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
            >
              <div className="logo-symbol">
                <span />
                <span />
                <span />
              </div>

              <div className="logo-text">
                <strong>Credora</strong>
                <small>
                  Credit Operations Platform
                </small>
              </div>
            </button>

            <p>
              Intelligent loan origination and credit operations
              for modern financial teams.
            </p>
          </div>

          <div className="footer-column">
            <strong>Platform</strong>

            <button
              onClick={() =>
                scrollToSection("platform")
              }
            >
              Capabilities
            </button>

            <button
              onClick={() =>
                scrollToSection("intelligence")
              }
            >
              Intelligence
            </button>

            <button
              onClick={() =>
                scrollToSection("workflow")
              }
            >
              Lifecycle
            </button>
          </div>

          <div className="footer-column">
            <strong>Enterprise</strong>

            <button
              onClick={() =>
                scrollToSection("enterprise")
              }
            >
              Governance
            </button>

            <button>Security</button>

            <button>Administration</button>
          </div>

          <div className="footer-column">
            <strong>Workspace</strong>

            <Link to="/login">Sign in</Link>

            <Link to="/login">
              Open workspace
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © 2026 Credora. All rights reserved.
          </span>

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