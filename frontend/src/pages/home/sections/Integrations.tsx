import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Code2,
  Database,
  FileCheck2,
  Globe2,
  KeyRound,
  Link2,
  MessageSquare,
  Network,
  PlugZap,
  RefreshCw,
  Server,
  ShieldCheck,
  Webhook,
  Workflow,
  Zap,
} from "lucide-react";
import "../Home.css";

const integrationGroups = [
  {
    icon: Database,
    title: "Data & Financial Systems",
    description:
      "Connect customer, financial and portfolio data across the systems that power lending operations.",
    items: ["Core banking", "Credit bureaus", "Banking data", "ERP & accounting"],
  },
  {
    icon: FileCheck2,
    title: "Documents & Verification",
    description:
      "Bring documents, identity information and verification results into a unified origination workflow.",
    items: ["OCR providers", "KYC services", "Identity verification", "Document storage"],
  },
  {
    icon: MessageSquare,
    title: "Communication",
    description:
      "Coordinate customer and internal communications across the lending lifecycle.",
    items: ["Email", "SMS", "Push notifications", "Communication providers"],
  },
  {
    icon: Workflow,
    title: "Enterprise Workflow",
    description:
      "Connect operational systems and downstream services through controlled workflow integrations.",
    items: ["Webhooks", "REST APIs", "Workflow engines", "Event services"],
  },
];

const architectureNodes = [
  {
    icon: Globe2,
    title: "External Systems",
    description: "Banks · Bureaus · KYC · CRM",
  },
  {
    icon: PlugZap,
    title: "Integration Layer",
    description: "APIs · Webhooks · Events",
  },
  {
    icon: Network,
    title: "Credora Platform",
    description: "Origination · Credit · Risk",
  },
  {
    icon: Cloud,
    title: "Enterprise Services",
    description: "Data · Analytics · Notifications",
  },
];

const apiFeatures = [
  "RESTful API architecture",
  "Webhook-based event delivery",
  "Secure service authentication",
  "Structured request validation",
  "Integration monitoring",
  "Controlled data exchange",
];

function Integrations() {
  return (
    <section className="integrations-section" id="integrations">
      <div className="integrations-grid-bg" />

      <div className="integrations-container">
        <motion.div
          className="integrations-header"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="integrations-kicker">
            <Link2 size={15} />
            Integrations & APIs
          </div>

          <div className="integrations-heading-row">
            <div>
              <h2>
                Connect the systems
                <span> behind every lending operation.</span>
              </h2>

              <p>
                Credora is designed to sit at the center of your lending
                ecosystem, connecting data, verification, financial,
                communication and enterprise services through governed
                integration patterns.
              </p>
            </div>

            <div className="integration-api-badge">
              <Code2 size={16} />
              API-first architecture
            </div>
          </div>
        </motion.div>

        <motion.div
          className="integration-architecture"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.7 }}
        >
          <div className="integration-architecture-top">
            <div>
              <span>Integration architecture</span>
              <h3>One controlled connection layer</h3>
            </div>

            <div className="integration-live-status">
              <span />
              Integration layer ready
            </div>
          </div>

          <div className="integration-flow">
            {architectureNodes.map((node, index) => {
              const Icon = node.icon;

              return (
                <div className="integration-flow-group" key={node.title}>
                  <motion.div
                    className={`integration-flow-node ${
                      index === 2 ? "core-node" : ""
                    }`}
                    initial={{ opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.1,
                    }}
                  >
                    <div className="integration-flow-icon">
                      <Icon size={20} />
                    </div>

                    <strong>{node.title}</strong>
                    <span>{node.description}</span>
                  </motion.div>

                  {index < architectureNodes.length - 1 && (
                    <div className="integration-connector">
                      <div className="connector-line" />
                      <ChevronRight size={15} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="integration-event-strip">
            <div>
              <Webhook size={15} />
              <span>Event-driven workflows</span>
            </div>

            <div>
              <RefreshCw size={15} />
              <span>Data synchronization</span>
            </div>

            <div>
              <ShieldCheck size={15} />
              <span>Governed access</span>
            </div>

            <div>
              <Zap size={15} />
              <span>Real-time service events</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="integration-groups"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {integrationGroups.map((group, index) => {
            const Icon = group.icon;

            return (
              <motion.div
                className="integration-group-card"
                key={group.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.06,
                }}
              >
                <div className="integration-group-icon">
                  <Icon size={20} />
                </div>

                <h3>{group.title}</h3>

                <p>{group.description}</p>

                <div className="integration-items">
                  {group.items.map((item) => (
                    <div key={item}>
                      <CheckCircle2 size={13} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="integration-api-section"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
        >
          <div className="api-copy">
            <div className="api-icon">
              <Code2 size={21} />
            </div>

            <span className="integration-eyebrow">
              Developer & integration platform
            </span>

            <h3>
              Build connected workflows
              <span> without breaking control.</span>
            </h3>

            <p>
              Credora provides structured integration boundaries for
              connecting internal applications, external providers and
              enterprise services while maintaining authentication,
              validation, observability and governance.
            </p>

            <div className="api-feature-list">
              {apiFeatures.map((feature) => (
                <div key={feature}>
                  <CheckCircle2 size={14} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button type="button" className="integration-api-link">
              Explore integration architecture
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="api-console">
            <div className="api-console-header">
              <div className="api-console-dots">
                <span />
                <span />
                <span />
              </div>

              <span>credora-api</span>

              <div className="api-console-secure">
                <KeyRound size={12} />
                Secure
              </div>
            </div>

            <div className="api-console-body">
              <div className="api-request">
                <span className="api-method">POST</span>
                <span>/api/v1/applications</span>
              </div>

              <div className="api-code">
                <span className="code-muted">{"{"}</span>
                <span>
                  <b>"customerId"</b>: "CUS-20481",
                </span>
                <span>
                  <b>"product"</b>: "PERSONAL_LOAN",
                </span>
                <span>
                  <b>"amount"</b>: 850000,
                </span>
                <span>
                  <b>"currency"</b>: "INR"
                </span>
                <span className="code-muted">{"}"}</span>
              </div>

              <div className="api-response">
                <div className="response-status">
                  <CheckCircle2 size={13} />
                  201 Created
                </div>

                <div className="response-details">
                  Application accepted · Workflow initiated
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="integration-security-strip"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div>
            <Server size={18} />
            <div>
              <strong>Service boundaries</strong>
              <span>Isolated integration responsibilities</span>
            </div>
          </div>

          <div>
            <ShieldCheck size={18} />
            <div>
              <strong>Authentication</strong>
              <span>Controlled service access</span>
            </div>
          </div>

          <div>
            <RefreshCw size={18} />
            <div>
              <strong>Observability</strong>
              <span>Track integration activity</span>
            </div>
          </div>

          <div>
            <Database size={18} />
            <div>
              <strong>Data contracts</strong>
              <span>Structured information exchange</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="integrations-statement"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span>Connected by architecture.</span>
          <strong>Controlled by design.</strong>
        </motion.div>
      </div>
    </section>
  );
}

export default Integrations;