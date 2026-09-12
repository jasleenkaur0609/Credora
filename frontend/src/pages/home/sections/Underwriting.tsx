import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileCheck2,
  Gavel,
  GitBranch,
  LockKeyhole,
  ShieldCheck,
  UserCheck,
  X,
} from "lucide-react";

const policyChecks = [
  {
    name: "Minimum credit score",
    requirement: "≥ 700",
    result: "782",
    status: "pass",
  },
  {
    name: "Maximum FOIR",
    requirement: "≤ 45%",
    result: "31.4%",
    status: "pass",
  },
  {
    name: "Employment stability",
    requirement: "≥ 24 months",
    result: "48 months",
    status: "pass",
  },
  {
    name: "Existing exposure",
    requirement: "≤ ₹8.0L",
    result: "₹4.6L",
    status: "pass",
  },
  {
    name: "Recent utilization",
    requirement: "Review if > 40%",
    result: "42.8%",
    status: "review",
  },
];

const approvalLevels = [
  {
    role: "Credit Analyst",
    status: "completed",
    person: "Initial assessment",
  },
  {
    role: "Senior Underwriter",
    status: "active",
    person: "Decision review",
  },
  {
    role: "Credit Manager",
    status: "pending",
    person: "Final authorization",
  },
];

export default function Underwriting() {
  return (
    <section className="underwriting-section" id="underwriting">
      <div className="underwriting-container">
        {/* Header */}
        <motion.div
          className="underwriting-header"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
        >
          <div className="underwriting-kicker">
            <span>
              <ClipboardCheck size={14} />
            </span>
            UNDERWRITING & APPROVAL INTELLIGENCE
          </div>

          <div className="underwriting-title-row">
            <div>
              <h2>
                Decisions that are
                <span> explainable by design.</span>
              </h2>

              <p>
                Bring policy rules, borrower evidence, AI recommendations and
                human approvals into one controlled underwriting workflow.
              </p>
            </div>

            <div className="governance-badge">
              <LockKeyhole size={16} />
              Governed decisioning
            </div>
          </div>
        </motion.div>

        {/* Main Underwriting Console */}
        <motion.div
          className="underwriting-console"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8 }}
        >
          {/* Console top bar */}
          <div className="underwriting-console-bar">
            <div className="underwriting-breadcrumb">
              <span>Credit Operations</span>
              <ChevronRight size={13} />
              <span>Underwriting</span>
              <ChevronRight size={13} />
              <strong>CRD-2026-01482</strong>
            </div>

            <div className="underwriting-live-status">
              <span />
              Live decision workflow
            </div>
          </div>

          {/* Workflow */}
          <div className="underwriting-workflow">
            <div className="workflow-step completed">
              <div className="workflow-icon">
                <FileCheck2 size={17} />
              </div>

              <div>
                <span>01</span>
                <strong>Evidence</strong>
              </div>
            </div>

            <div className="workflow-connector active" />

            <div className="workflow-step completed">
              <div className="workflow-icon">
                <GitBranch size={17} />
              </div>

              <div>
                <span>02</span>
                <strong>Policy Rules</strong>
              </div>
            </div>

            <div className="workflow-connector active" />

            <div className="workflow-step active">
              <div className="workflow-icon">
                <BrainCircuit size={17} />
              </div>

              <div>
                <span>03</span>
                <strong>AI Assessment</strong>
              </div>
            </div>

            <div className="workflow-connector" />

            <div className="workflow-step">
              <div className="workflow-icon">
                <UserCheck size={17} />
              </div>

              <div>
                <span>04</span>
                <strong>Approval</strong>
              </div>
            </div>
          </div>

          {/* Console content */}
          <div className="underwriting-content">
            {/* Policy evaluation */}
            <div className="policy-panel">
              <div className="underwriting-panel-heading">
                <div>
                  <span>POLICY EVALUATION</span>
                  <h3>Credit Policy Checks</h3>
                </div>

                <div className="policy-summary">
                  <CheckCircle2 size={15} />
                  4 passed · 1 review
                </div>
              </div>

              <div className="policy-list">
                {policyChecks.map((policy, index) => (
                  <motion.div
                    className={`policy-row ${policy.status}`}
                    key={policy.name}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.06,
                    }}
                  >
                    <div className="policy-status-icon">
                      {policy.status === "pass" ? (
                        <Check size={14} />
                      ) : (
                        <AlertCircle size={14} />
                      )}
                    </div>

                    <div className="policy-name">
                      <strong>{policy.name}</strong>
                      <span>{policy.requirement}</span>
                    </div>

                    <div className="policy-result">
                      {policy.result}
                    </div>

                    <div className="policy-status-label">
                      {policy.status === "pass" ? "Passed" : "Review"}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="policy-footer">
                <ShieldCheck size={15} />
                <span>
                  Rules evaluated against the active credit policy version
                  <strong> CP-2026.04</strong>
                </span>
              </div>
            </div>

            {/* AI recommendation */}
            <div className="ai-underwriting-panel">
              <div className="underwriting-panel-heading">
                <div>
                  <span>AI UNDERWRITING ASSISTANT</span>
                  <h3>Assessment</h3>
                </div>

                <div className="ai-badge">
                  <BrainCircuit size={14} />
                  AI
                </div>
              </div>

              <div className="ai-decision-card">
                <div className="ai-decision-header">
                  <div className="ai-decision-icon">
                    <BrainCircuit size={21} />
                  </div>

                  <div>
                    <span>RECOMMENDATION</span>
                    <strong>Approve with review</strong>
                  </div>
                </div>

                <p>
                  The applicant meets the configured affordability, credit and
                  exposure thresholds. A recent increase in credit utilization
                  should be reviewed before final authorization.
                </p>

                <div className="confidence-row">
                  <div>
                    <span>Recommendation confidence</span>
                    <strong>89%</strong>
                  </div>

                  <div className="confidence-bar">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "89%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              </div>

              <div className="reason-heading">
                <span>DECISION FACTORS</span>
              </div>

              <div className="decision-factors">
                <div>
                  <CheckCircle2 size={15} />
                  <span>Strong repayment history</span>
                </div>

                <div>
                  <CheckCircle2 size={15} />
                  <span>Stable verified income</span>
                </div>

                <div>
                  <CheckCircle2 size={15} />
                  <span>Healthy debt capacity</span>
                </div>

                <div className="factor-warning">
                  <AlertCircle size={15} />
                  <span>Credit utilization requires review</span>
                </div>
              </div>
            </div>
          </div>

          {/* Approval matrix */}
          <div className="approval-matrix">
            <div className="approval-heading">
              <div>
                <span>APPROVAL MATRIX</span>
                <h3>Human decision controls</h3>
              </div>

              <div className="approval-protection">
                <LockKeyhole size={14} />
                Segregation of duties enabled
              </div>
            </div>

            <div className="approval-flow">
              {approvalLevels.map((level, index) => (
                <div className="approval-node-wrapper" key={level.role}>
                  <motion.div
                    className={`approval-node ${level.status}`}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.1,
                    }}
                  >
                    <div className="approval-node-icon">
                      {level.status === "completed" ? (
                        <Check size={15} />
                      ) : level.status === "active" ? (
                        <Gavel size={15} />
                      ) : (
                        <UserCheck size={15} />
                      )}
                    </div>

                    <div>
                      <span>{level.person}</span>
                      <strong>{level.role}</strong>
                    </div>

                    <div className="approval-node-status">
                      {level.status === "completed"
                        ? "Completed"
                        : level.status === "active"
                          ? "Current"
                          : "Pending"}
                    </div>
                  </motion.div>

                  {index < approvalLevels.length - 1 && (
                    <div className="approval-arrow">
                      <ArrowRight size={17} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Decision actions */}
          <div className="underwriting-actions">
            <div className="decision-lock">
              <ShieldCheck size={17} />
              <div>
                <strong>Final decision requires authorized reviewer</strong>
                <span>
                  AI recommendations cannot independently approve or reject an
                  application.
                </span>
              </div>
            </div>

            <div className="decision-buttons">
              <button className="decision-button reject">
                <X size={15} />
                Reject
              </button>

              <button className="decision-button refer">
                <AlertCircle size={15} />
                Refer
              </button>

              <button className="decision-button approve">
                <Check size={15} />
                Approve
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom capabilities */}
        <motion.div
          className="underwriting-capabilities"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="underwriting-capability-intro">
            <span>CONTROLLED DECISIONING</span>
            <h3>
              Automation where it helps.
              <br />
              Accountability where it matters.
            </h3>
          </div>

          <div className="underwriting-capability-grid">
            <div>
              <GitBranch size={20} />
              <strong>Policy-driven workflows</strong>
              <p>
                Apply configurable credit policies and approval rules
                consistently across applications.
              </p>
            </div>

            <div>
              <BrainCircuit size={20} />
              <strong>Explainable AI</strong>
              <p>
                Connect recommendations to decision factors, evidence and
                underlying borrower signals.
              </p>
            </div>

            <div>
              <ShieldCheck size={20} />
              <strong>Human oversight</strong>
              <p>
                Preserve authorized review, segregation of duties and complete
                decision accountability.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Statement */}
        <motion.div
          className="underwriting-statement"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span />
          <p>
            <strong>AI accelerates the review.</strong> Policy governs the
            decision. People remain accountable.
          </p>
          <span />
        </motion.div>
      </div>
    </section>
  );
}