import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  FileCheck2,
  FileText,
  Landmark,
  ScanSearch,
  ShieldCheck,
  UserRoundCheck,
  WalletCards,
} from "lucide-react";
import { motion } from "framer-motion";

const stages = [
  {
    number: "01",
    icon: FileText,
    title: "Application",
    description:
      "Capture customer, loan, financial and application information through a structured origination journey.",
    status: "ORIGINATION",
  },
  {
    number: "02",
    icon: FileCheck2,
    title: "Documents",
    description:
      "Collect, classify, extract and validate the documents required for the application.",
    status: "DOCUMENT INTELLIGENCE",
  },
  {
    number: "03",
    icon: UserRoundCheck,
    title: "Verification",
    description:
      "Coordinate KYC, identity, income, employment and field verification activities.",
    status: "VERIFICATION",
  },
  {
    number: "04",
    icon: CreditCard,
    title: "Credit Assessment",
    description:
      "Build a consolidated credit profile from financial information, credit history and application data.",
    status: "CREDIT",
  },
  {
    number: "05",
    icon: ShieldCheck,
    title: "Risk & Fraud",
    description:
      "Surface risk indicators, policy exceptions, suspicious patterns and potential fraud signals.",
    status: "RISK INTELLIGENCE",
  },
  {
    number: "06",
    icon: ScanSearch,
    title: "Underwriting",
    description:
      "Bring customer, document, credit, risk and policy context together for underwriting.",
    status: "UNDERWRITING",
  },
  {
    number: "07",
    icon: ClipboardCheck,
    title: "Approval",
    description:
      "Route decisions through configurable approval hierarchies, authorities and business rules.",
    status: "DECISION WORKFLOW",
  },
  {
    number: "08",
    icon: FileText,
    title: "Agreement",
    description:
      "Generate, review and manage loan offers, agreements and required legal documentation.",
    status: "AGREEMENT",
  },
  {
    number: "09",
    icon: WalletCards,
    title: "Disbursement",
    description:
      "Coordinate final checks, disbursement instructions, finance controls and release of funds.",
    status: "DISBURSEMENT",
  },
  {
    number: "10",
    icon: Landmark,
    title: "Loan Servicing",
    description:
      "Continue managing active loans, repayment schedules, customer interactions and account activity.",
    status: "SERVICING",
  },
];

function Lifecycle() {
  return (
    <section className="lifecycle-section" id="workflow">
      <div className="lifecycle-orb lifecycle-orb-one" />
      <div className="lifecycle-orb lifecycle-orb-two" />

      <div className="section-container">
        <motion.div
          className="lifecycle-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <span className="section-label">
              THE COMPLETE LENDING LIFECYCLE
            </span>

            <h2>
              One connected workflow.
              <span> Every stage.</span>
            </h2>
          </div>

          <p>
            Credora brings every stage of the lending journey into one
            connected operating model, giving teams shared context from the
            first application through servicing and beyond.
          </p>
        </motion.div>

        <motion.div
          className="lifecycle-intro-bar"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="lifecycle-intro-item">
            <CheckCircle2 size={17} />

            <div>
              <strong>Connected customer context</strong>
              <span>
                Information follows the application throughout its lifecycle.
              </span>
            </div>
          </div>

          <div className="lifecycle-divider" />

          <div className="lifecycle-intro-item">
            <CheckCircle2 size={17} />

            <div>
              <strong>Intelligence at every decision point</strong>
              <span>
                AI-assisted insights appear where teams need them.
              </span>
            </div>
          </div>

          <div className="lifecycle-divider" />

          <div className="lifecycle-intro-item">
            <CheckCircle2 size={17} />

            <div>
              <strong>Controlled operational workflows</strong>
              <span>
                Roles, permissions and approvals stay connected.
              </span>
            </div>
          </div>
        </motion.div>

        <div className="lifecycle-grid">
          {stages.map((stage, index) => {
            const Icon = stage.icon;

            return (
              <motion.article
                key={stage.number}
                className="lifecycle-card"
                initial={{
                  opacity: 0,
                  y: 30,
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
                  duration: 0.55,
                  delay: index * 0.055,
                }}
                whileHover={{
                  y: -7,
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                <div className="lifecycle-card-top">
                  <span className="lifecycle-number">
                    {stage.number}
                  </span>

                  <span className="lifecycle-status">
                    {stage.status}
                  </span>
                </div>

                <div className="lifecycle-icon">
                  <Icon size={21} />
                </div>

                <h3>{stage.title}</h3>

                <p>{stage.description}</p>

                <div className="lifecycle-card-footer">
                  <span>Credora workflow</span>

                  <ArrowRight size={15} />
                </div>

                {index < stages.length - 1 && (
                  <div className="lifecycle-flow-dot" />
                )}
              </motion.article>
            );
          })}
        </div>

        <motion.div
          className="lifecycle-end-state"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <div className="end-state-icon">
            <Landmark size={22} />
          </div>

          <div>
            <span>CONTINUOUS LOAN OPERATIONS</span>

            <h3>
              The lifecycle doesn't stop at disbursement.
            </h3>

            <p>
              Credora continues the operational journey through active loan
              servicing, repayment, collections, recovery, customer support,
              reporting and closure.
            </p>
          </div>

          <div className="end-state-arrow">
            <ArrowDown size={18} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Lifecycle;