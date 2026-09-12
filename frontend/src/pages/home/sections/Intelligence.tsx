import {
  ArrowRight,
  BrainCircuit,
  Check,
  FileSearch,
  Fingerprint,
  Gauge,
  MessageSquareText,
  Network,
  ScanSearch,
  ShieldAlert,
  Sparkles,
  Workflow,
} from "lucide-react";
import { motion } from "framer-motion";

const intelligenceCapabilities = [
  {
    icon: FileSearch,
    number: "01",
    title: "Document Intelligence",
    description:
      "Transform unstructured documents into structured, review-ready information using OCR, classification, extraction and validation.",
    features: [
      "OCR & document classification",
      "Field extraction",
      "Cross-document validation",
      "Exception detection",
    ],
  },
  {
    icon: BrainCircuit,
    number: "02",
    title: "Credit Intelligence",
    description:
      "Bring financial information, credit history and application context together to help teams understand borrower creditworthiness.",
    features: [
      "Credit profile analysis",
      "Financial signal interpretation",
      "Repayment behavior",
      "Decision-support insights",
    ],
  },
  {
    icon: ShieldAlert,
    number: "03",
    title: "Risk Intelligence",
    description:
      "Identify risk factors and policy exceptions while giving risk teams a consolidated view of application and portfolio signals.",
    features: [
      "Risk signal aggregation",
      "Policy exception detection",
      "Risk scoring support",
      "Portfolio risk indicators",
    ],
  },
  {
    icon: Fingerprint,
    number: "04",
    title: "Fraud Intelligence",
    description:
      "Connect identity, documents, customer data and behavioral signals to surface potential inconsistencies and suspicious patterns.",
    features: [
      "Identity inconsistencies",
      "Document anomalies",
      "Pattern detection",
      "Investigation support",
    ],
  },
  {
    icon: Gauge,
    number: "05",
    title: "Underwriting Intelligence",
    description:
      "Give underwriters a consolidated decision workspace where customer, document, credit, risk and policy context meet.",
    features: [
      "Application summarization",
      "Policy-aware insights",
      "Decision context",
      "Review recommendations",
    ],
  },
  {
    icon: MessageSquareText,
    number: "06",
    title: "Enterprise RAG",
    description:
      "Allow authorized users to retrieve answers and insights from organizational policies, procedures, lending guidelines and approved knowledge.",
    features: [
      "Policy knowledge retrieval",
      "Context-aware answers",
      "Source-grounded responses",
      "Permission-aware access",
    ],
  },
];

function Intelligence() {
  return (
    <section className="intelligence-section" id="intelligence">
      <div className="intelligence-glow intelligence-glow-one" />
      <div className="intelligence-glow intelligence-glow-two" />

      <div className="section-container">
        <motion.div
          className="intelligence-heading"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <span className="section-label">
              CREDORA INTELLIGENCE
            </span>

            <h2>
              AI that understands
              <span> credit operations.</span>
            </h2>
          </div>

          <p>
            Credora Intelligence turns documents, customer information,
            financial data, policies and operational signals into contextual
            intelligence that helps teams make better decisions.
          </p>
        </motion.div>

        <motion.div
          className="intelligence-command"
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8 }}
        >
          <div className="intelligence-command-header">
            <div className="intelligence-command-brand">
              <div className="intelligence-command-logo">
                <Sparkles size={18} />
              </div>

              <div>
                <span>INTELLIGENCE ENGINE</span>
                <strong>Credora AI Context Layer</strong>
              </div>
            </div>

            <div className="intelligence-active">
              <i />
              Context available
            </div>
          </div>

          <div className="intelligence-command-body">
            <div className="intelligence-input-column">
              <span className="intelligence-column-label">
                APPLICATION CONTEXT
              </span>

              <div className="context-card">
                <div className="context-card-icon">
                  <FileSearch size={16} />
                </div>

                <div>
                  <strong>Documents</strong>

                  <span>
                    Identity, income & financial records
                  </span>
                </div>

                <Check size={14} />
              </div>

              <div className="context-card">
                <div className="context-card-icon">
                  <BrainCircuit size={16} />
                </div>

                <div>
                  <strong>Credit profile</strong>

                  <span>
                    Credit history & repayment signals
                  </span>
                </div>

                <Check size={14} />
              </div>

              <div className="context-card">
                <div className="context-card-icon">
                  <ShieldAlert size={16} />
                </div>

                <div>
                  <strong>Risk signals</strong>

                  <span>
                    Risk indicators & policy exceptions
                  </span>
                </div>

                <Check size={14} />
              </div>

              <div className="context-card">
                <div className="context-card-icon">
                  <Workflow size={16} />
                </div>

                <div>
                  <strong>Workflow context</strong>

                  <span>
                    Current stage, tasks & approvals
                  </span>
                </div>

                <Check size={14} />
              </div>
            </div>

            <div className="intelligence-connector">
              <div className="connector-line connector-line-one" />
              <div className="connector-line connector-line-two" />
              <div className="connector-line connector-line-three" />
              <div className="connector-line connector-line-four" />

              <motion.div
                className="intelligence-core"
                animate={{
                  scale: [1, 1.04, 1],
                  boxShadow: [
                    "0 0 30px rgba(37,99,235,.12)",
                    "0 0 65px rgba(37,99,235,.28)",
                    "0 0 30px rgba(37,99,235,.12)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <BrainCircuit size={31} />

                <strong>AI</strong>

                <span>
                  CONTEXT ENGINE
                </span>
              </motion.div>

              <div className="connector-node node-one" />
              <div className="connector-node node-two" />
              <div className="connector-node node-three" />
              <div className="connector-node node-four" />
            </div>

            <div className="intelligence-output-column">
              <span className="intelligence-column-label">
                INTELLIGENT OUTPUT
              </span>

              <div className="output-card primary-output">
                <div className="output-card-top">
                  <div className="output-icon">
                    <Sparkles size={15} />
                  </div>

                  <span>AI INSIGHT</span>
                </div>

                <strong>
                  Application context consolidated
                </strong>

                <p>
                  Relevant information from documents, credit,
                  risk and workflow context has been organized
                  for review.
                </p>
              </div>

              <div className="output-card">
                <div className="output-small-icon">
                  <ScanSearch size={14} />
                </div>

                <div>
                  <strong>
                    Review signals
                  </strong>

                  <span>
                    Surface information requiring attention.
                  </span>
                </div>
              </div>

              <div className="output-card">
                <div className="output-small-icon">
                  <Network size={14} />
                </div>

                <div>
                  <strong>
                    Connected evidence
                  </strong>

                  <span>
                    Trace insights back to relevant context.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="intelligence-command-footer">
            <div>
              <span>INTELLIGENCE PRINCIPLE</span>

              <strong>
                AI assists the decision. People remain accountable for it.
              </strong>
            </div>

            <ShieldAlert size={19} />
          </div>
        </motion.div>

        <div className="intelligence-capabilities">
          {intelligenceCapabilities.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                className="intelligence-card"
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
                  amount: 0.1,
                }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.06,
                }}
                whileHover={{
                  y: -8,
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                <div className="intelligence-card-header">
                  <div className="intelligence-card-icon">
                    <Icon size={21} />
                  </div>

                  <span>
                    {item.number}
                  </span>
                </div>

                <h3>{item.title}</h3>

                <p>{item.description}</p>

                <div className="intelligence-features">
                  {item.features.map((feature) => (
                    <div key={feature}>
                      <Check size={12} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <a href="#platform">
                  Explore capability
                  <ArrowRight size={14} />
                </a>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          className="intelligence-principles"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <div className="principle">
            <Sparkles size={18} />

            <div>
              <strong>Context over isolated answers</strong>

              <span>
                Intelligence is built from the full application context.
              </span>
            </div>
          </div>

          <div className="principle">
            <Network size={18} />

            <div>
              <strong>Evidence-connected intelligence</strong>

              <span>
                Insights can be connected back to underlying information.
              </span>
            </div>
          </div>

          <div className="principle">
            <ShieldCheckIcon />

            <div>
              <strong>Governed AI access</strong>

              <span>
                Intelligence operates within enterprise permissions and controls.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ShieldCheckIcon() {
  return (
    <div className="principle-custom-icon">
      <ShieldAlert size={18} />
    </div>
  );
}

export default Intelligence;