import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileSearch,
  Gavel,
  LayoutDashboard,
  LockKeyhole,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";

const roleGroups = [
  {
    id: "executive",
    title: "Executive Management",
    description: "Enterprise-wide visibility and strategic oversight.",
    icon: BarChart3,
    roles: [
      "Chief Credit Officer",
      "Chief Risk Officer",
      "Chief Financial Officer",
    ],
  },
  {
    id: "operations",
    title: "Loan Operations",
    description:
      "Origination, processing and customer workflow management.",
    icon: BriefcaseBusiness,
    roles: ["Loan Manager", "Senior Loan Officer", "Loan Officer"],
  },
  {
    id: "credit",
    title: "Credit & Underwriting",
    description:
      "Credit assessment, underwriting and approval decisions.",
    icon: ClipboardCheck,
    roles: ["Credit Manager", "Credit Analyst", "Credit Underwriter"],
  },
  {
    id: "risk",
    title: "Risk & Fraud",
    description:
      "Risk monitoring, fraud detection and investigation.",
    icon: ShieldCheck,
    roles: ["Risk Manager", "Fraud Risk Analyst", "Risk Review Officer"],
  },
  {
    id: "verification",
    title: "Verification & KYC",
    description:
      "Identity, documents and income verification.",
    icon: FileSearch,
    roles: [
      "Verification Manager",
      "KYC Officer",
      "Document Verification Officer",
    ],
  },
  {
    id: "finance",
    title: "Finance & Accounts",
    description:
      "Disbursement, reconciliation and financial controls.",
    icon: WalletCards,
    roles: [
      "Finance Manager",
      "Accounts Officer",
      "Reconciliation Officer",
    ],
  },
];

const dashboardModules = [
  "Role-specific KPIs",
  "Assigned work queue",
  "Priority applications",
  "Risk & exception alerts",
  "Approval actions",
  "Operational insights",
];

export default function Roles() {
  return (
    <section className="roles-section" id="roles">
      <div className="roles-container">
        {/* Header */}
        <motion.div
          className="roles-header"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
        >
          <div className="roles-kicker">
            <span>
              <Users size={14} />
            </span>
            ROLE-BASED ENTERPRISE OPERATIONS
          </div>

          <div className="roles-title-row">
            <div>
              <h2>
                One platform.
                <span> Different view for every role.</span>
              </h2>

              <p>
                Credora adapts the workspace to each team member's
                responsibilities, permissions and operational priorities.
              </p>
            </div>

            <div className="roles-security-badge">
              <LockKeyhole size={16} />
              Permission-aware workspace
            </div>
          </div>
        </motion.div>

        {/* Main Workspace */}
        <motion.div
          className="roles-workspace"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8 }}
        >
          {/* Top Bar */}
          <div className="roles-workspace-bar">
            <div className="roles-breadcrumb">
              <span>Credora</span>
              <ChevronRight size={13} />
              <span>Workspace</span>
              <ChevronRight size={13} />
              <strong>Role Dashboard</strong>
            </div>

            <div className="roles-user-context">
              <span className="roles-user-dot" />
              Role context active
            </div>
          </div>

          {/* Workspace Layout */}
          <div className="roles-workspace-body">
            {/* Role Navigation */}
            <aside className="roles-sidebar">
              <div className="roles-sidebar-heading">
                <span>ROLE GROUPS</span>
              </div>

              {roleGroups.slice(0, 5).map((role, index) => {
                const Icon = role.icon;

                return (
                  <motion.div
                    className={`role-sidebar-item ${
                      index === 2 ? "active" : ""
                    }`}
                    key={role.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.06,
                    }}
                  >
                    <div className="role-sidebar-icon">
                      <Icon size={16} />
                    </div>

                    <div>
                      <strong>{role.title}</strong>
                      <span>{role.roles.length} role profiles</span>
                    </div>
                  </motion.div>
                );
              })}

              <div className="roles-sidebar-more">
                <span>+ additional operational roles</span>
                <ArrowRight size={13} />
              </div>
            </aside>

            {/* Dashboard */}
            <div className="role-dashboard">
              <div className="role-dashboard-heading">
                <div>
                  <span>ACTIVE ROLE</span>

                  <h3>Credit & Underwriting</h3>

                  <p>
                    Workspace configured for credit assessment and
                    underwriting responsibilities.
                  </p>
                </div>

                <div className="active-role-chip">
                  <ClipboardCheck size={14} />
                  Credit Underwriter
                </div>
              </div>

              {/* Dashboard Metrics */}
              <div className="role-dashboard-metrics">
                <div className="role-metric">
                  <span>Assigned Applications</span>

                  <strong>24</strong>

                  <small>
                    <Activity size={11} />
                    Active queue
                  </small>
                </div>

                <div className="role-metric">
                  <span>Pending Reviews</span>

                  <strong>08</strong>

                  <small>
                    <ClipboardCheck size={11} />
                    Requires attention
                  </small>
                </div>

                <div className="role-metric">
                  <span>Exceptions</span>

                  <strong>03</strong>

                  <small className="warning">
                    <Activity size={11} />
                    Review required
                  </small>
                </div>

                <div className="role-metric">
                  <span>Today's Decisions</span>

                  <strong>17</strong>

                  <small>
                    <CheckCircle2 size={11} />
                    Completed
                  </small>
                </div>
              </div>

              {/* Dashboard Main */}
              <div className="role-dashboard-content">
                {/* Work Queue */}
                <div className="role-work-queue">
                  <div className="role-panel-heading">
                    <div>
                      <span>WORK QUEUE</span>
                      <h4>Priority Applications</h4>
                    </div>

                    <ArrowRight size={15} />
                  </div>

                  <div className="role-application-list">
                    <div className="role-application">
                      <div className="application-id">
                        <span>CRD</span>
                        <strong>01482</strong>
                      </div>

                      <div className="application-info">
                        <strong>Personal Loan</strong>
                        <span>₹6.50L · Underwriting review</span>
                      </div>

                      <div className="application-risk low">
                        Low Risk
                      </div>
                    </div>

                    <div className="role-application">
                      <div className="application-id">
                        <span>CRD</span>
                        <strong>01476</strong>
                      </div>

                      <div className="application-info">
                        <strong>Business Loan</strong>
                        <span>₹18.00L · Policy exception</span>
                      </div>

                      <div className="application-risk review">
                        Review
                      </div>
                    </div>

                    <div className="role-application">
                      <div className="application-id">
                        <span>CRD</span>
                        <strong>01461</strong>
                      </div>

                      <div className="application-info">
                        <strong>Home Loan</strong>
                        <span>₹42.00L · Credit assessment</span>
                      </div>

                      <div className="application-risk low">
                        Low Risk
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="role-action-panel">
                  <div className="role-panel-heading">
                    <div>
                      <span>AUTHORIZED ACTIONS</span>
                      <h4>Available to this role</h4>
                    </div>

                    <Gavel size={16} />
                  </div>

                  <div className="role-action-list">
                    <div>
                      <CheckCircle2 size={14} />
                      <span>Review credit assessment</span>
                    </div>

                    <div>
                      <CheckCircle2 size={14} />
                      <span>Request additional documents</span>
                    </div>

                    <div>
                      <CheckCircle2 size={14} />
                      <span>Refer application</span>
                    </div>

                    <div>
                      <CheckCircle2 size={14} />
                      <span>Submit underwriting decision</span>
                    </div>

                    <div className="restricted">
                      <LockKeyhole size={14} />
                      <span>Final approval — restricted</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modules */}
              <div className="role-modules">
                <div className="role-module-heading">
                  <span>DASHBOARD MODULES</span>
                </div>

                <div className="role-module-list">
                  {dashboardModules.map((module, index) => (
                    <motion.div
                      key={module}
                      className="role-module"
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.05,
                      }}
                    >
                      <Check size={13} />
                      {module}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Role Architecture */}
        <motion.div
          className="roles-architecture"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="roles-architecture-intro">
            <span>RBAC ARCHITECTURE</span>

            <h3>
              Access follows responsibility.
              <br />
              Responsibility follows role.
            </h3>
          </div>

          <div className="roles-access-flow">
            <div className="access-node">
              <div>
                <Users size={20} />
              </div>

              <span>User</span>
              <small>Identity</small>
            </div>

            <ArrowRight className="access-arrow" size={20} />

            <div className="access-node">
              <div>
                <BriefcaseBusiness size={20} />
              </div>

              <span>Role</span>
              <small>Responsibility</small>
            </div>

            <ArrowRight className="access-arrow" size={20} />

            <div className="access-node">
              <div>
                <ShieldCheck size={20} />
              </div>

              <span>Permissions</span>
              <small>Authorization</small>
            </div>

            <ArrowRight className="access-arrow" size={20} />

            <div className="access-node">
              <div>
                <LayoutDashboard size={20} />
              </div>

              <span>Workspace</span>
              <small>Experience</small>
            </div>
          </div>
        </motion.div>

        {/* Capability Strip */}
        <motion.div
          className="roles-capability-strip"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <ShieldCheck size={19} />

            <strong>Least-privilege access</strong>

            <span>
              Users see only what their responsibilities require.
            </span>
          </div>

          <div>
            <LayoutDashboard size={19} />

            <strong>Distinct dashboards</strong>

            <span>
              Every role gets a purpose-built operational experience.
            </span>
          </div>

          <div>
            <LockKeyhole size={19} />

            <strong>Controlled actions</strong>

            <span>
              Permissions govern what each role can view and perform.
            </span>
          </div>
        </motion.div>

        {/* Statement */}
        <motion.div
          className="roles-statement"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span />

          <p>
            <strong>One source of truth.</strong> Purpose-built experiences
            for every team.
          </p>

          <span />
        </motion.div>
      </div>
    </section>
  );
}