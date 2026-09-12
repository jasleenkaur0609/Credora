import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileCheck2,
  FileSearch,
  FileText,
  Fingerprint,
  ScanLine,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { motion } from "framer-motion";

const processingSteps = [
  {
    number: "01",
    title: "Upload",
    description: "Securely receive application documents.",
  },
  {
    number: "02",
    title: "Classify",
    description: "Identify document type and purpose.",
  },
  {
    number: "03",
    title: "Extract",
    description: "Convert relevant fields into structured data.",
  },
  {
    number: "04",
    title: "Validate",
    description: "Check extracted information against context.",
  },
  {
    number: "05",
    title: "Analyze",
    description: "Surface inconsistencies and decision signals.",
  },
];

const extractedFields = [
  ["Applicant", "Aarav Mehta"],
  ["Employer", "Meridian Technologies"],
  ["Monthly income", "₹ 128,500"],
  ["Employment", "Full time"],
  ["Statement period", "Apr 2026 – Jun 2026"],
];

function DocumentIntelligence() {
  return (
    <section className="document-section" id="documents">
      <div className="document-glow document-glow-one" />

      <div className="section-container">
        <motion.div
          className="document-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <span className="section-label">
              DOCUMENT INTELLIGENCE
            </span>

            <h2>
              From documents
              <span> to decision-ready data.</span>
            </h2>
          </div>

          <p>
            Credora transforms the documents behind every loan application
            into structured, validated information that can move directly
            into verification, credit assessment, risk analysis and
            underwriting workflows.
          </p>
        </motion.div>

        <motion.div
          className="document-workspace"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8 }}
        >
          <div className="document-workspace-header">
            <div className="document-brand">
              <div className="document-brand-icon">
                <FileSearch size={17} />
              </div>

              <div>
                <span>DOCUMENT INTELLIGENCE</span>
                <strong>Application document workspace</strong>
              </div>
            </div>

            <div className="document-processing-status">
              <i />
              Processing complete
            </div>
          </div>

          <div className="document-workspace-body">
            <div className="document-preview-column">
              <div className="workspace-label">
                SOURCE DOCUMENT
              </div>

              <div className="document-paper">
                <div className="paper-header">
                  <div className="paper-logo">
                    MT
                  </div>

                  <div>
                    <strong>
                      Meridian Technologies
                    </strong>

                    <span>
                      Salary Statement
                    </span>
                  </div>

                  <FileCheck2 size={15} />
                </div>

                <div className="paper-divider" />

                <div className="paper-row">
                  <span>Employee name</span>
                  <strong>Aarav Mehta</strong>
                </div>

                <div className="paper-row">
                  <span>Employee ID</span>
                  <strong>MT-48291</strong>
                </div>

                <div className="paper-row highlighted">
                  <span>Gross monthly income</span>
                  <strong>₹ 128,500</strong>
                </div>

                <div className="paper-row">
                  <span>Employment type</span>
                  <strong>Full time</strong>
                </div>

                <div className="paper-row highlighted">
                  <span>Statement period</span>
                  <strong>Apr – Jun 2026</strong>
                </div>

                <div className="paper-divider" />

                <div className="paper-summary">
                  <div>
                    <span>Document type</span>
                    <strong>Income statement</strong>
                  </div>

                  <div>
                    <span>Confidence</span>
                    <strong>98.7%</strong>
                  </div>
                </div>

                <motion.div
                  className="scan-line"
                  animate={{
                    top: ["12%", "86%", "12%"],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>

            <div className="document-process-column">
              <div className="workspace-label">
                INTELLIGENCE PIPELINE
              </div>

              <div className="document-pipeline">
                {processingSteps.map((step, index) => (
                  <motion.div
                    className="document-step"
                    key={step.number}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.09,
                    }}
                  >
                    <div className="document-step-number">
                      {step.number}
                    </div>

                    <div className="document-step-content">
                      <strong>{step.title}</strong>

                      <span>
                        {step.description}
                      </span>
                    </div>

                    <CheckCircle2 size={15} />
                  </motion.div>
                ))}
              </div>

              <div className="document-ai-note">
                <Sparkles size={16} />

                <div>
                  <strong>
                    AI extraction complete
                  </strong>

                  <span>
                    27 relevant fields identified from the document.
                  </span>
                </div>
              </div>
            </div>

            <div className="document-data-column">
              <div className="workspace-label">
                STRUCTURED INFORMATION
              </div>

              <div className="extracted-card">
                <div className="extracted-card-header">
                  <div>
                    <strong>
                      Extracted fields
                    </strong>

                    <span>
                      Application profile
                    </span>
                  </div>

                  <div className="confidence">
                    98.7%
                  </div>
                </div>

                <div className="extracted-fields">
                  {extractedFields.map(([label, value]) => (
                    <div
                      className="extracted-field"
                      key={label}
                    >
                      <span>{label}</span>

                      <strong>{value}</strong>

                      <Check size={12} />
                    </div>
                  ))}
                </div>

                <div className="extraction-warning">
                  <TriangleAlert size={14} />

                  <span>
                    No material extraction conflicts detected.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="document-workspace-footer">
            <div>
              <Fingerprint size={15} />

              <span>
                Information can continue into KYC, verification,
                credit and underwriting workflows.
              </span>
            </div>

            <ArrowRight size={16} />
          </div>
        </motion.div>

        <div className="document-capabilities">
          <DocumentCapability
            icon={<ScanLine size={19} />}
            title="OCR & Classification"
            text="Recognize documents and identify their role within the application."
          />

          <DocumentCapability
            icon={<FileText size={19} />}
            title="Structured Extraction"
            text="Extract relevant fields from income, identity, financial and supporting documents."
          />

          <DocumentCapability
            icon={<FileCheck2 size={19} />}
            title="Validation & Comparison"
            text="Compare information across documents and identify inconsistencies."
          />

          <DocumentCapability
            icon={<TriangleAlert size={19} />}
            title="Exception Detection"
            text="Surface missing, conflicting or potentially suspicious information for review."
          />
        </div>

        <motion.div
          className="document-bottom-message"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="document-bottom-icon">
            <Sparkles size={19} />
          </div>

          <div>
            <span>WHY IT MATTERS</span>

            <h3>
              Reduce manual document review without removing human control.
            </h3>

            <p>
              Credora is designed to assist document-heavy lending operations
              while keeping exceptions, evidence and human review visible to
              the teams responsible for the decision.
            </p>
          </div>

          <a href="#intelligence">
            Explore AI intelligence
            <ArrowRight size={15} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function DocumentCapability({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      className="document-capability"
      whileHover={{
        y: -5,
        transition: { duration: 0.2 },
      }}
    >
      <div className="document-capability-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

      <ArrowRight size={14} />
    </motion.div>
  );
}

export default DocumentIntelligence;