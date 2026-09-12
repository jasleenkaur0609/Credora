import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileSearch,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="credora-hero">
      <div className="hero-copy">
        <motion.div
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span />
          INTELLIGENT CREDIT OPERATING SYSTEM
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.75,
            delay: 0.08,
            ease: "easeOut",
          }}
        >
          Make every lending decision
          <span className="gradient-text">
            faster, smarter, safer.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.18,
          }}
        >
          Credora connects loan origination, customer data, documents,
          verification, credit assessment, risk intelligence, underwriting,
          approval and servicing into one intelligent platform built for
          modern lending operations.
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.65,
            delay: 0.3,
          }}
        >
          <a href="/register" className="primary-action">
            Start with Credora
            <ArrowRight size={17} />
          </a>

          <a href="#platform" className="secondary-action">
            Explore the platform
            <ArrowRight size={16} />
          </a>
        </motion.div>

        <motion.div
          className="hero-trust"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.7,
            delay: 0.48,
          }}
        >
          <span>
            <i />
            End-to-end lending lifecycle
          </span>

          <span>
            <i />
            AI-assisted decisions
          </span>

          <span>
            <i />
            Enterprise-grade controls
          </span>
        </motion.div>
      </div>

      <motion.div
        className="hero-product"
        initial={{
          opacity: 0,
          x: 80,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          x: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.9,
          delay: 0.15,
          ease: "easeOut",
        }}
      >
        <div className="command-center">
          <div className="command-window">
            <div className="command-top">
              <div className="window-dots">
                <i />
                <i />
                <i />
              </div>

              <span>
                CREDORA / OPERATIONS CENTER
              </span>

              <div className="live-status">
                <b />
                Intelligence active
              </div>
            </div>

            <div className="command-body">
              <div className="command-title">
                <div>
                  <small>Enterprise lending intelligence</small>

                  <strong>
                    Credit Operations Overview
                  </strong>
                </div>

                <div className="command-period">
                  Current portfolio
                </div>
              </div>

              <div className="command-metrics">
                <div className="command-metric">
                  <span>Applications</span>

                  <strong>8,420</strong>

                  <small className="metric-change">
                    +18.4% this period
                  </small>
                </div>

                <div className="command-metric">
                  <span>In review</span>

                  <strong>624</strong>

                  <small className="metric-change">
                    Across all queues
                  </small>
                </div>

                <div className="command-metric">
                  <span>Approval flow</span>

                  <strong>72.8%</strong>

                  <small className="metric-change">
                    Decision pipeline
                  </small>
                </div>

                <div className="command-metric">
                  <span>Risk signals</span>

                  <strong>38</strong>

                  <small className="metric-change">
                    Requiring attention
                  </small>
                </div>
              </div>

              <div className="command-content">
                <div className="command-chart">
                  <div className="command-chart-header">
                    <span>Application & decision activity</span>

                    <TrendingUp size={15} />
                  </div>

                  <div className="chart">
                    <div className="chart-lines">
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>

                    <svg
                      className="chart-svg"
                      viewBox="0 0 600 180"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient
                          id="heroChartFill"
                          x1="0"
                          x2="0"
                          y1="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#3b82f6"
                            stopOpacity=".32"
                          />

                          <stop
                            offset="100%"
                            stopColor="#3b82f6"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>

                      <motion.path
                        d="M0 148 C45 140 58 119 95 128 C132 137 150 91 187 105 C224 119 247 71 280 85 C316 101 335 62 370 72 C406 83 425 40 460 53 C495 66 525 25 600 31 L600 180 L0 180 Z"
                        fill="url(#heroChartFill)"
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        transition={{
                          duration: 1.3,
                          delay: 0.7,
                        }}
                      />

                      <motion.path
                        d="M0 148 C45 140 58 119 95 128 C132 137 150 91 187 105 C224 119 247 71 280 85 C316 101 335 62 370 72 C406 83 425 40 460 53 C495 66 525 25 600 31"
                        fill="none"
                        stroke="#5da0ff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{
                          pathLength: 0,
                        }}
                        animate={{
                          pathLength: 1,
                        }}
                        transition={{
                          duration: 1.6,
                          delay: 0.45,
                          ease: "easeOut",
                        }}
                      />
                    </svg>
                  </div>
                </div>

                <div className="command-insights">
                  <div className="insight-title">
                    Intelligence signals
                  </div>

                  <div className="insight-item">
                    <div>
                      <div className="insight-icon">
                        <BrainCircuit size={14} />
                      </div>

                      <strong>
                        Credit intelligence
                      </strong>
                    </div>

                    <p>
                      Credit profile shows consistent
                      repayment behavior.
                    </p>
                  </div>

                  <div className="insight-item">
                    <div>
                      <div className="insight-icon">
                        <FileSearch size={14} />
                      </div>

                      <strong>
                        Document intelligence
                      </strong>
                    </div>

                    <p>
                      Income documents successfully
                      extracted and validated.
                    </p>
                  </div>

                  <div className="insight-item">
                    <div>
                      <div className="insight-icon">
                        <ShieldCheck size={14} />
                      </div>

                      <strong>
                        Risk intelligence
                      </strong>
                    </div>

                    <p>
                      No high-priority fraud indicators
                      detected.
                    </p>
                  </div>
                </div>
              </div>

              <div className="command-footer">
                <Sparkles size={17} />

                <div>
                  <strong>
                    Credora Intelligence recommendation
                  </strong>

                  <p>
                    Application context consolidated across
                    documents, credit and risk signals.
                  </p>
                </div>

                <CheckCircle2 size={17} />
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className="floating-product-card one"
          animate={{
            y: [0, -9, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="floating-card-icon">
            <FileSearch size={16} />
          </div>

          <div>
            <strong>
              Document verified
            </strong>

            <span>
              Identity & income documents
            </span>
          </div>
        </motion.div>

        <motion.div
          className="floating-product-card two"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 4.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="floating-card-icon">
            <ShieldCheck size={16} />
          </div>

          <div>
            <strong>
              Risk assessment ready
            </strong>

            <span>
              Review signals before decision
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;