import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  Network,
  ServerCog,
  ShieldCheck,
  UserCheck,
  UsersRound,
} from "lucide-react";
import "../Home.css";

const securityControls = [
  {
    icon: LockKeyhole,
    title: "Encryption by design",
    description:
      "Protect sensitive customer, application and financial information with encryption across data in transit and at rest.",
  },
  {
    icon: UserCheck,
    title: "Identity & access control",
    description:
      "Role-based permissions and controlled access ensure users can only perform actions appropriate to their responsibilities.",
  },
  {
    icon: Fingerprint,
    title: "Strong authentication",
    description:
      "Secure authentication flows, session controls, verification and credential protection form the foundation of every workspace.",
  },
  {
    icon: Activity,
    title: "Continuous auditability",
    description:
      "Capture important user, workflow, approval and administrative actions in a traceable audit history.",
  },
  {
    icon: Network,
    title: "Segregation of duties",
    description:
      "Separate operational responsibilities across verification, credit, underwriting, approval and financial workflows.",
  },
  {
    icon: ServerCog,
    title: "Controlled integrations",
    description:
      "Connect external systems through governed integration boundaries with explicit access and operational controls.",
  },
];

const governanceItems = [
  "Role-based access control",
  "Permission-level authorization",
  "Session and authentication controls",
  "Audit event tracking",
  "Approval segregation",
  "Data access governance",
];

function Security() {
  return (
    <section className="security-section" id="security">
      <div className="security-glow security-glow-one" />
      <div className="security-glow security-glow-two" />

      <div className="security-container">
        <motion.div
          className="security-header"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="security-kicker">
            <ShieldCheck size={15} />
            Security & Governance
          </div>

          <h2>
            Built for
            <span> controlled lending operations.</span>
          </h2>

          <p>
            Credora brings identity, authorization, auditability and
            governance into the platform architecture so every critical
            lending action can be controlled, reviewed and traced.
          </p>
        </motion.div>

        <motion.div
          className="security-command-center"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.7 }}
        >
          <div className="security-command-top">
            <div className="security-command-brand">
              <div className="security-command-logo">
                <ShieldCheck size={18} />
              </div>

              <div>
                <strong>Credora Security Center</strong>
                <span>Enterprise governance workspace</span>
              </div>
            </div>

            <div className="security-status">
              <span />
              Security controls active
            </div>
          </div>

          <div className="security-command-body">
            <aside className="security-sidebar">
              <div className="security-sidebar-title">Control domains</div>

              <div className="security-nav-item active">
                <ShieldCheck size={15} />
                Security overview
              </div>

              <div className="security-nav-item">
                <UsersRound size={15} />
                Identity & access
              </div>

              <div className="security-nav-item">
                <KeyRound size={15} />
                Authentication
              </div>

              <div className="security-nav-item">
                <Activity size={15} />
                Audit activity
              </div>

              <div className="security-nav-item">
                <Network size={15} />
                Integrations
              </div>
            </aside>

            <div className="security-dashboard">
              <div className="security-dashboard-header">
                <div>
                  <span>Security posture</span>
                  <h3>Governance overview</h3>
                </div>

                <div className="security-date">
                  <Activity size={13} />
                  Real-time controls
                </div>
              </div>

              <div className="security-posture-grid">
                <div className="security-posture-card">
                  <div className="security-posture-icon">
                    <LockKeyhole size={16} />
                  </div>

                  <div>
                    <span>Access controls</span>
                    <strong>Enforced</strong>
                  </div>

                  <CheckCircle2 size={16} />
                </div>

                <div className="security-posture-card">
                  <div className="security-posture-icon">
                    <Fingerprint size={16} />
                  </div>

                  <div>
                    <span>Authentication</span>
                    <strong>Protected</strong>
                  </div>

                  <CheckCircle2 size={16} />
                </div>

                <div className="security-posture-card">
                  <div className="security-posture-icon">
                    <Activity size={16} />
                  </div>

                  <div>
                    <span>Audit trail</span>
                    <strong>Recording</strong>
                  </div>

                  <CheckCircle2 size={16} />
                </div>
              </div>

              <div className="security-dashboard-grid">
                <div className="security-audit-panel">
                  <div className="security-panel-heading">
                    <div>
                      <span>Recent activity</span>
                      <h4>Governed actions</h4>
                    </div>

                    <Activity size={16} />
                  </div>

                  <div className="security-audit-list">
                    <div className="security-audit-item">
                      <div className="audit-avatar">
                        <UserCheck size={13} />
                      </div>

                      <div>
                        <strong>Credit review completed</strong>
                        <span>Credit Analyst · Application workflow</span>
                      </div>

                      <small>09:42</small>
                    </div>

                    <div className="security-audit-item">
                      <div className="audit-avatar">
                        <ShieldCheck size={13} />
                      </div>

                      <div>
                        <strong>Risk assessment approved</strong>
                        <span>Risk Manager · Decision workflow</span>
                      </div>

                      <small>09:37</small>
                    </div>

                    <div className="security-audit-item">
                      <div className="audit-avatar">
                        <KeyRound size={13} />
                      </div>

                      <div>
                        <strong>Permission policy evaluated</strong>
                        <span>Authorization service · Access control</span>
                      </div>

                      <small>09:31</small>
                    </div>

                    <div className="security-audit-item">
                      <div className="audit-avatar">
                        <LockKeyhole size={13} />
                      </div>

                      <div>
                        <strong>Secure session created</strong>
                        <span>Loan Officer · Authentication</span>
                      </div>

                      <small>09:24</small>
                    </div>
                  </div>
                </div>

                <div className="security-access-panel">
                  <div className="security-panel-heading">
                    <div>
                      <span>Authorization model</span>
                      <h4>Access architecture</h4>
                    </div>

                    <UsersRound size={16} />
                  </div>

                  <div className="security-access-flow">
                    <div className="security-flow-node">
                      <UsersRound size={15} />
                      <span>User</span>
                    </div>

                    <div className="security-flow-line" />

                    <div className="security-flow-node">
                      <ShieldCheck size={15} />
                      <span>Role</span>
                    </div>

                    <div className="security-flow-line" />

                    <div className="security-flow-node">
                      <KeyRound size={15} />
                      <span>Permissions</span>
                    </div>

                    <div className="security-flow-line" />

                    <div className="security-flow-node">
                      <Network size={15} />
                      <span>Actions</span>
                    </div>
                  </div>

                  <div className="security-policy-box">
                    <div className="policy-box-icon">
                      <CheckCircle2 size={14} />
                    </div>

                    <div>
                      <strong>Policy-controlled access</strong>
                      <span>
                        Authorization is evaluated before protected
                        operations are performed.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="security-controls"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {securityControls.map((control, index) => {
            const Icon = control.icon;

            return (
              <motion.div
                key={control.title}
                className="security-control-card"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.06,
                }}
              >
                <div className="security-control-icon">
                  <Icon size={19} />
                </div>

                <h3>{control.title}</h3>

                <p>{control.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="security-governance"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
        >
          <div className="governance-copy">
            <div className="governance-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <span className="security-panel-eyebrow">
                Governance foundation
              </span>

              <h3>
                Security controls designed around
                <span> lending workflows.</span>
              </h3>

              <p>
                From customer onboarding through underwriting, approval,
                disbursement and servicing, Credora provides the control
                framework required to operate sensitive financial workflows
                with accountability.
              </p>
            </div>
          </div>

          <div className="governance-checklist">
            {governanceItems.map((item) => (
              <div key={item}>
                <CheckCircle2 size={15} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="security-warning"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="security-warning-icon">
            <AlertTriangle size={17} />
          </div>

          <div>
            <strong>Human oversight remains part of the control model.</strong>
            <span>
              AI recommendations support decision-making but do not replace
              governed approval authority or required human review.
            </span>
          </div>
        </motion.div>

        <motion.div
          className="security-statement"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span>Secure by architecture.</span>
          <strong>Governed by policy. Traceable by design.</strong>
        </motion.div>
      </div>
    </section>
  );
}

export default Security;