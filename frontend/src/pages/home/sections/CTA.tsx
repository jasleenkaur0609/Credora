import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  FileCheck2,
  Fingerprint,
  Layers3,
  LockKeyhole,
  MessageSquare,
  Play,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import "../Home.css";

const capabilities = [
  {
    icon: Workflow,
    title: "Loan Origination",
    description: "Manage applications from intake through decisioning.",
  },
  {
    icon: FileCheck2,
    title: "Document Intelligence",
    description: "Extract, validate and connect information from documents.",
  },
  {
    icon: ShieldCheck,
    title: "Credit & Risk",
    description: "Bring credit analysis and risk signals into one workspace.",
  },
  {
    icon: CircleDollarSign,
    title: "Disbursement & Servicing",
    description: "Continue the lifecycle beyond approval and agreement.",
  },
];

const trustItems = [
  {
    icon: LockKeyhole,
    text: "Controlled access",
  },
  {
    icon: Fingerprint,
    text: "Secure authentication",
  },
  {
    icon: ShieldCheck,
    text: "Governed workflows",
  },
  {
    icon: MessageSquare,
    text: "Connected operations",
  },
];

function CTA() {
  return (
    <section className="cta-section" id="cta">
      <div className="cta-orb cta-orb-one" />
      <div className="cta-orb cta-orb-two" />
      <div className="cta-grid" />

      <div className="cta-container">
        <motion.div
          className="cta-kicker"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles size={15} />
          The Credora Platform
        </motion.div>

        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
        >
          <div className="cta-copy">
            <h2>
              Build the future of
              <span> intelligent lending.</span>
            </h2>

            <p>
              Bring origination, documents, verification, credit, risk,
              underwriting, approval and servicing together in one
              intelligent lending platform.
            </p>

            <div className="cta-actions">
              <button type="button" className="cta-primary">
                Explore Credora
                <ArrowRight size={17} />
              </button>

              <button type="button" className="cta-secondary">
                <Play size={15} />
                See how it works
              </button>
            </div>

            <div className="cta-trust-row">
              {trustItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.text}>
                    <Icon size={14} />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <motion.div
            className="cta-product-preview"
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.12 }}
          >
            <div className="cta-preview-glow" />

            <div className="cta-preview-header">
              <div className="cta-preview-brand">
                <div className="cta-preview-logo">
                  <Layers3 size={15} />
                </div>

                <div>
                  <strong>Credora</strong>
                  <span>Intelligent Lending Platform</span>
                </div>
              </div>

              <div className="cta-preview-status">
                <span />
                Platform ready
              </div>
            </div>

            <div className="cta-preview-body">
              <div className="cta-preview-welcome">
                <span>Enterprise lending workspace</span>
                <strong>Everything connected.</strong>
              </div>

              <div className="cta-preview-flow">
                <div className="preview-flow-card">
                  <div className="preview-flow-icon">
                    <Workflow size={15} />
                  </div>

                  <div>
                    <strong>Origination</strong>
                    <span>Applications</span>
                  </div>

                  <CheckCircle2 size={14} />
                </div>

                <ChevronRight className="preview-arrow" size={14} />

                <div className="preview-flow-card">
                  <div className="preview-flow-icon">
                    <Bot size={15} />
                  </div>

                  <div>
                    <strong>Intelligence</strong>
                    <span>AI + Risk</span>
                  </div>

                  <CheckCircle2 size={14} />
                </div>

                <ChevronRight className="preview-arrow" size={14} />

                <div className="preview-flow-card">
                  <div className="preview-flow-icon">
                    <ShieldCheck size={15} />
                  </div>

                  <div>
                    <strong>Decisioning</strong>
                    <span>Underwriting</span>
                  </div>

                  <CheckCircle2 size={14} />
                </div>
              </div>

              <div className="cta-ai-card">
                <div className="cta-ai-icon">
                  <Sparkles size={15} />
                </div>

                <div className="cta-ai-copy">
                  <span>Credora Intelligence</span>
                  <strong>
                    Context-aware intelligence across the loan lifecycle
                  </strong>
                </div>

                <div className="cta-ai-pulse">
                  <span />
                  Active
                </div>
              </div>

              <div className="cta-preview-footer">
                <div>
                  <CircleDollarSign size={14} />
                  <span>Portfolio</span>
                  <strong>Connected</strong>
                </div>

                <div>
                  <FileCheck2 size={14} />
                  <span>Documents</span>
                  <strong>Intelligent</strong>
                </div>

                <div>
                  <LockKeyhole size={14} />
                  <span>Security</span>
                  <strong>Governed</strong>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="cta-capabilities"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="cta-capabilities-heading">
            <span>One platform.</span>
            <strong>Every critical lending workflow.</strong>
          </div>

          <div className="cta-capability-list">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;

              return (
                <motion.div
                  className="cta-capability"
                  key={capability.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.06,
                  }}
                >
                  <div className="cta-capability-icon">
                    <Icon size={17} />
                  </div>

                  <div>
                    <strong>{capability.title}</strong>
                    <span>{capability.description}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="cta-bottom"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="cta-bottom-line" />

          <div className="cta-bottom-copy">
            <span>Ready to transform lending operations?</span>
            <strong>Start with Credora.</strong>
          </div>

          <div className="cta-bottom-line" />
        </motion.div>
      </div>
    </section>
  );
}

export default CTA;