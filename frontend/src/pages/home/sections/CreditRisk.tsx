import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  CreditCard,
  FileWarning,
  Fingerprint,
  Gauge,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

const riskSignals = [
  {
    label: "Affordability",
    value: "Low Risk",
    score: "92%",
    icon: WalletCards,
    type: "positive",
  },
  {
    label: "Repayment Risk",
    value: "Moderate",
    score: "68%",
    icon: TrendingDown,
    type: "warning",
  },
  {
    label: "Credit Exposure",
    value: "Low Risk",
    score: "87%",
    icon: CreditCard,
    type: "positive",
  },
  {
    label: "Fraud Signals",
    value: "Clear",
    score: "96%",
    icon: Fingerprint,
    type: "positive",
  },
];

const financialMetrics = [
  {
    label: "Monthly Income",
    value: "₹84,500",
    change: "+8.4%",
    positive: true,
  },
  {
    label: "Existing Obligations",
    value: "₹21,200",
    change: "25.1%",
    positive: true,
  },
  {
    label: "FOIR",
    value: "31.4%",
    change: "Within policy",
    positive: true,
  },
  {
    label: "Credit Utilization",
    value: "42.8%",
    change: "-6.2%",
    positive: true,
  },
];

export default function CreditRisk() {
  return (
    <section className="credit-risk-section" id="credit-risk">
      <div className="credit-risk-container">
        {/* Header */}
        <motion.div
          className="credit-risk-header"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
        >
          <div className="section-kicker">
            <span className="section-kicker-icon">
              <Gauge size={14} />
            </span>
            CREDIT & RISK INTELLIGENCE
          </div>

          <div className="credit-risk-heading-row">
            <div>
              <h2>
                See the borrower
                <span> beyond the score.</span>
              </h2>

              <p>
                Credora combines credit history, financial behavior, risk
                signals and fraud indicators into one decision-ready view.
              </p>
            </div>

            <div className="credit-risk-header-badge">
              <BrainCircuit size={17} />
              AI-assisted assessment
            </div>
          </div>
        </motion.div>

        {/* Main Workspace */}
        <motion.div
          className="credit-risk-workspace"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8 }}
        >
          {/* Workspace Header */}
          <div className="credit-workspace-topbar">
            <div className="workspace-breadcrumb">
              <span>Application</span>
              <ArrowUpRight size={13} />
              <strong>CRD-2026-01482</strong>
            </div>

            <div className="workspace-status">
              <span className="status-dot" />
              Assessment in progress
            </div>
          </div>

          {/* Workspace Body */}
          <div className="credit-workspace-body">
            {/* Left Column */}
            <div className="credit-profile-panel">
              <div className="panel-heading">
                <div>
                  <span className="panel-eyebrow">BORROWER PROFILE</span>
                  <h3>Credit Profile</h3>
                </div>

                <div className="profile-status">
                  <CheckCircle2 size={15} />
                  Verified
                </div>
              </div>

              <div className="borrower-profile">
                <div className="borrower-avatar">AR</div>

                <div>
                  <strong>Applicant Profile</strong>
                  <span>Primary borrower · Salaried</span>
                </div>

                <div className="profile-risk">
                  <span>Risk grade</span>
                  <strong>A-</strong>
                </div>
              </div>

              {/* Credit Score */}
              <div className="credit-score-card">
                <div className="credit-score-top">
                  <div>
                    <span>Credit Score</span>
                    <strong>782</strong>
                  </div>

                  <div className="score-trend">
                    <TrendingUp size={15} />
                    +24 pts
                  </div>
                </div>

                <div className="score-bar">
                  <motion.div
                    className="score-bar-fill"
                    initial={{ width: 0 }}
                    whileInView={{ width: "82%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.2 }}
                  />
                </div>

                <div className="score-scale">
                  <span>300</span>
                  <span>500</span>
                  <span>650</span>
                  <span>750</span>
                  <span>900</span>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="financial-section">
                <div className="subsection-heading">
                  <span>FINANCIAL HEALTH</span>
                  <Activity size={15} />
                </div>

                <div className="financial-grid">
                  {financialMetrics.map((metric, index) => (
                    <motion.div
                      className="financial-card"
                      key={metric.label}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.06,
                      }}
                    >
                      <span>{metric.label}</span>
                      <strong>{metric.value}</strong>

                      <small className={metric.positive ? "positive" : ""}>
                        {metric.change}
                      </small>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Column */}
            <div className="risk-analysis-panel">
              <div className="panel-heading">
                <div>
                  <span className="panel-eyebrow">RISK ENGINE</span>
                  <h3>Risk Signals</h3>
                </div>

                <span className="signals-count">04 evaluated</span>
              </div>

              <div className="risk-score-display">
                <div className="risk-ring">
                  <div className="risk-ring-inner">
                    <strong>18</strong>
                    <span>/ 100</span>
                  </div>
                </div>

                <div className="risk-summary">
                  <span>Overall risk score</span>
                  <strong>Low Risk</strong>
                  <p>
                    Current signals remain within the configured credit policy
                    threshold.
                  </p>
                </div>
              </div>

              <div className="risk-signal-list">
                {riskSignals.map((signal, index) => {
                  const Icon = signal.icon;

                  return (
                    <motion.div
                      className={`risk-signal-card ${signal.type}`}
                      key={signal.label}
                      initial={{ opacity: 0, x: 18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.45,
                        delay: index * 0.08,
                      }}
                    >
                      <div className="risk-signal-icon">
                        <Icon size={17} />
                      </div>

                      <div className="risk-signal-content">
                        <span>{signal.label}</span>
                        <strong>{signal.value}</strong>
                      </div>

                      <div className="risk-signal-score">
                        {signal.score}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right Column */}
            <div className="decision-panel">
              <div className="panel-heading">
                <div>
                  <span className="panel-eyebrow">AI ASSESSMENT</span>
                  <h3>Decision Readiness</h3>
                </div>

                <BrainCircuit size={19} />
              </div>

              <div className="decision-score">
                <div className="decision-score-number">86</div>

                <div>
                  <span>Decision readiness</span>
                  <strong>Strong</strong>
                </div>
              </div>

              <div className="decision-divider" />

              <div className="ai-observation">
                <div className="observation-icon">
                  <BrainCircuit size={17} />
                </div>

                <div>
                  <span>AI OBSERVATION</span>
                  <p>
                    Financial capacity is consistent with the requested
                    exposure. Repayment behavior shows stable performance with
                    limited recent risk movement.
                  </p>
                </div>
              </div>

              <div className="evidence-list">
                <div className="evidence-item">
                  <CheckCircle2 size={15} />
                  <span>Income verified against source documents</span>
                </div>

                <div className="evidence-item">
                  <CheckCircle2 size={15} />
                  <span>No material document inconsistencies</span>
                </div>

                <div className="evidence-item">
                  <CheckCircle2 size={15} />
                  <span>Debt exposure within configured threshold</span>
                </div>

                <div className="evidence-item warning">
                  <AlertTriangle size={15} />
                  <span>Recent utilization increase requires review</span>
                </div>
              </div>

              <div className="decision-footer">
                <ShieldCheck size={16} />
                <span>Human review remains required</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Intelligence Cards */}
        <motion.div
          className="credit-risk-capabilities"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="capability-intro">
            <span>ONE CREDIT VIEW</span>
            <h3>
              Connect every signal before
              <br />
              making a credit decision.
            </h3>
          </div>

          <div className="capability-items">
            <div className="credit-capability">
              <CreditCard size={21} />
              <div>
                <strong>Credit Intelligence</strong>
                <p>
                  Consolidate credit history, obligations, utilization and
                  repayment behavior.
                </p>
              </div>
            </div>

            <div className="credit-capability">
              <TrendingUp size={21} />
              <div>
                <strong>Financial Analysis</strong>
                <p>
                  Understand affordability, income stability, cash flow and
                  repayment capacity.
                </p>
              </div>
            </div>

            <div className="credit-capability">
              <FileWarning size={21} />
              <div>
                <strong>Risk & Fraud Detection</strong>
                <p>
                  Surface inconsistencies, anomalies and suspicious patterns
                  before approval.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Statement */}
        <motion.div
          className="credit-risk-statement"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="statement-line" />
          <p>
            <strong>Better context.</strong> Better risk visibility. Better
            credit decisions.
          </p>
          <span className="statement-line" />
        </motion.div>
      </div>
    </section>
  );
}