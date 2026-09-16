import {
  Activity,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Database,
  FileCheck2,
  FileText,
  Fingerprint,
  Gauge,
  Landmark,
  LockKeyhole,
  Network,
  //ScanSearch,
  SearchCheck,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Users,
  WalletCards,
  Workflow,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const capabilityGroups = [
  {
    category: "CUSTOMER & ORIGINATION",
    description:
      "Create a complete digital foundation for customer onboarding and loan origination.",
    capabilities: [
      {
        icon: Users,
        title: "Customer Management",
        text: "Manage borrower profiles, relationships, co-applicants, guarantors and business entities.",
      },
      {
        icon: BriefcaseBusiness,
        title: "Loan Origination",
        text: "Capture and manage applications from initial submission through decisioning.",
      },
      {
        icon: CreditCard,
        title: "Loan Products",
        text: "Configure products, eligibility criteria, limits, pricing and lending policies.",
      },
      {
        icon: Workflow,
        title: "Workflow Management",
        text: "Route applications and operational work through configurable processes.",
      },
    ],
  },
  {
    category: "DOCUMENTS & VERIFICATION",
    description:
      "Turn fragmented customer information into structured, verified application data.",
    capabilities: [
      {
        icon: FileText,
        title: "Document Management",
        text: "Collect, organize, version and securely manage application documentation.",
      },
      {
        icon: FileCheck2,
        title: "Document Intelligence",
        text: "Extract, classify, validate and compare information using AI-powered document processing.",
      },
      {
        icon: Fingerprint,
        title: "KYC & Identity",
        text: "Coordinate identity, KYC and customer verification workflows.",
      },
      {
        icon: SearchCheck,
        title: "Verification",
        text: "Manage income, employment, field and supporting verification activities.",
      },
    ],
  },
  {
    category: "CREDIT, RISK & FRAUD",
    description:
      "Give decision-makers a consolidated view of credit quality, risk and potential fraud.",
    capabilities: [
      {
        icon: BarChart3,
        title: "Credit Assessment",
        text: "Build comprehensive credit profiles using financial and application information.",
      },
      {
        icon: ShieldAlert,
        title: "Risk Assessment",
        text: "Identify risk factors, policy exceptions and emerging portfolio signals.",
      },
      {
        icon: ShieldCheck,
        title: "Fraud Detection",
        text: "Surface suspicious patterns and indicators requiring investigation.",
      },
      {
        icon: Gauge,
        title: "Risk Scoring",
        text: "Combine relevant signals into structured risk and decision-support views.",
      },
    ],
  },
  {
    category: "DECISION & LOAN OPERATIONS",
    description:
      "Move approved applications into controlled execution and ongoing loan operations.",
    capabilities: [
      {
        icon: ClipboardCheck,
        title: "Underwriting",
        text: "Consolidate customer, credit, risk, documents and policy context for review.",
      },
      {
        icon: CheckCircle2,
        title: "Approval Workflow",
        text: "Route decisions through authority levels, business rules and approvals.",
      },
      {
        icon: WalletCards,
        title: "Disbursement",
        text: "Coordinate final checks, instructions, finance controls and release of funds.",
      },
      {
        icon: Landmark,
        title: "Loan Servicing",
        text: "Manage active loans, repayment activity, schedules and customer servicing.",
      },
    ],
  },
  {
    category: "COLLECTIONS, DATA & GOVERNANCE",
    description:
      "Extend the platform beyond origination into portfolio management and governance.",
    capabilities: [
      {
        icon: Activity,
        title: "Collections & Recovery",
        text: "Manage collection queues, recovery activities, field operations and escalations.",
      },
      {
        icon: BarChart3,
        title: "Analytics",
        text: "Monitor applications, portfolio performance, risk, operations and business KPIs.",
      },
      {
        icon: LockKeyhole,
        title: "Compliance & Audit",
        text: "Maintain controlled processes, audit trails, governance and compliance visibility.",
      },
      {
        icon: Settings2,
        title: "Administration",
        text: "Configure users, roles, permissions, policies, workflows and platform settings.",
      },
    ],
  },
];

const architectureLayers = [
  {
    icon: Users,
    label: "Customer",
    text: "Borrowers, co-applicants, guarantors & organizations",
  },
  {
    icon: Workflow,
    label: "Operations",
    text: "Origination, verification, underwriting & servicing",
  },
  {
    icon: ShieldCheck,
    label: "Decision Intelligence",
    text: "Credit, risk, fraud, policy & AI-assisted insights",
  },
  {
    icon: BarChart3,
    label: "Data & Governance",
    text: "Analytics, compliance, audit & operational intelligence",
  },
];

function Platform() {
  return (
    <section className="platform-section" id="platform">
      <div className="platform-background" />

      <div className="section-container platform-container">
        <motion.div
          className="platform-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <span className="section-label">
              THE CREDORA PLATFORM
            </span>

            <h2>
              One platform.
              <span> Every credit operation.</span>
            </h2>
          </div>

          <p>
            Credora brings the systems, workflows, intelligence and controls
            required to manage the complete lending lifecycle without forcing
            teams to operate across disconnected tools.
          </p>
        </motion.div>

        <motion.div
          className="platform-architecture"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.75 }}
        >
          <div className="architecture-header">
            <div>
              <span>CONNECTED CREDIT INFRASTRUCTURE</span>

              <strong>
                Credora Operating Architecture
              </strong>
            </div>

            <div className="architecture-status">
              <i />
              Connected platform
            </div>
          </div>

          <div className="architecture-body">
            <div className="architecture-core">
              <div className="core-ring core-ring-one" />
              <div className="core-ring core-ring-two" />

              <motion.div
                className="architecture-core-icon"
                animate={{
                  boxShadow: [
                    "0 0 25px rgba(37,99,235,.12)",
                    "0 0 50px rgba(37,99,235,.25)",
                    "0 0 25px rgba(37,99,235,.12)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                <Network size={30} />
              </motion.div>

              <strong>CREDORA</strong>

              <span>INTELLIGENT CREDIT PLATFORM</span>
            </div>

            <div className="architecture-layers">
              {architectureLayers.map((layer, index) => {
                const Icon = layer.icon;

                return (
                  <motion.div
                    className="architecture-layer"
                    key={layer.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                    }}
                  >
                    <div className="architecture-layer-icon">
                      <Icon size={17} />
                    </div>

                    <div>
                      <strong>{layer.label}</strong>
                      <span>{layer.text}</span>
                    </div>

                    <ArrowRight size={15} />
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="architecture-footer">
            <div>
              <Database size={15} />
              <span>Connected data foundation</span>
            </div>

            <div>
              <Zap size={15} />
              <span>Workflow automation</span>
            </div>

            <div>
              <ShieldCheck size={15} />
              <span>Enterprise governance</span>
            </div>

            <div>
              <SparkleIcon />
              <span>AI intelligence layer</span>
            </div>
          </div>
        </motion.div>

        <div className="platform-capabilities">
          {capabilityGroups.map((group, groupIndex) => (
            <motion.div
              className="capability-group"
              key={group.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.6,
                delay: groupIndex * 0.05,
              }}
            >
              <div className="capability-group-heading">
                <div>
                  <span>{group.category}</span>
                  <h3>{group.category.replace(/&/g, " & ")}</h3>
                </div>

                <p>{group.description}</p>
              </div>

              <div className="capability-items">
                {group.capabilities.map((capability, index) => {
                  const Icon = capability.icon;

                  return (
                    <motion.article
                      className="platform-capability"
                      key={capability.title}
                      whileHover={{
                        y: -6,
                        transition: {
                          duration: 0.2,
                        },
                      }}
                    >
                      <div className="platform-capability-icon">
                        <Icon size={21} />
                      </div>

                      <div className="platform-capability-content">
                        <div className="platform-capability-top">
                          <span>
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <CheckCircle2 size={14} />
                        </div>

                        <h4>{capability.title}</h4>

                        <p>{capability.text}</p>

                        <a href="#intelligence">
                          Learn more
                          <ArrowRight size={14} />
                        </a>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="platform-bottom-banner"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <div className="platform-bottom-icon">
            <LockKeyhole size={21} />
          </div>

          <div>
            <span>ONE CONTROLLED ENVIRONMENT</span>

            <h3>
              Connect people, processes, data and decisions.
            </h3>

            <p>
              Credora is designed so operational teams, credit teams, risk
              teams, finance, compliance, audit and leadership work from a
              shared source of truth.
            </p>
          </div>

          <a href="#enterprise">
            Explore enterprise capabilities
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function SparkleIcon() {
  return (
    <span className="platform-sparkle">
      ✦
    </span>
  );
}

export default Platform;