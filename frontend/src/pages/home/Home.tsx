import {
  ArrowRight,
  ChevronDown,
  Menu,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

import Hero from "./sections/Hero";
import Lifecycle from "./sections/Lifecycle";
import Platform from "./sections/Platform";
import Intelligence from "./sections/Intelligence";
 import DocumentIntelligence from "./sections/DocumentIntelligence";
import CreditRisk from "./sections/CreditRisk";
import Underwriting from "./sections/Underwriting";
// import Roles from "./sections/Roles";
// import Analytics from "./sections/Analytics";
// import Security from "./sections/Security";
// import Integrations from "./sections/Integrations";
// import CTA from "./sections/CTA";

import "./Home.css";

function Home() {
  return (
    <div className="credora-page">
      <div className="announcement">
        <div className="announcement-content">
          <Sparkles size={14} />

          <span>
            Credora Intelligence — AI-powered credit operations
          </span>

          <a href="#intelligence">
            Explore Intelligence
            <ArrowRight size={13} />
          </a>
        </div>
      </div>

      <header className="credora-navbar">
        <a href="/" className="credora-logo">
          <span className="logo-mark">
            C
          </span>

          <span className="logo-text">
            Credora
          </span>
        </a>

        <nav className="credora-nav">
          <a href="#platform">
            Platform
            <ChevronDown size={13} />
          </a>

          <a href="#intelligence">
            Intelligence
            <ChevronDown size={13} />
          </a>

          <a href="#enterprise">
            Solutions
            <ChevronDown size={13} />
          </a>

          <a href="#security">
            Security
          </a>

          <a href="#integrations">
            Integrations
          </a>
        </nav>

        <div className="navbar-actions">
          <a href="/login" className="navbar-login">
            Sign in
          </a>

          <a href="/register" className="navbar-button">
            Get started
            <ArrowRight size={15} />
          </a>
        </div>

        <button
          className="mobile-menu"
          type="button"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>
      </header>

      <main>
        <Hero />
         <Lifecycle />
       <Platform />
         <Intelligence />
        <DocumentIntelligence />
        <CreditRisk />
        <Underwriting />
        {/*<Roles />
        <Analytics />
        <Security />
        <Integrations />
        <CTA /> */}
      </main>

      <footer className="credora-footer">
        <div className="footer-grid">
          <div className="footer-company">
            <a href="/" className="credora-logo">
              <span className="logo-mark">
                C
              </span>

              <span className="logo-text">
                Credora
              </span>
            </a>

            <p>
              Intelligent infrastructure for modern lending,
              credit operations and financial decision-making.
            </p>

            <div className="footer-status">
              <span />
              Platform infrastructure
            </div>
          </div>

          <div className="footer-column">
            <h4>Platform</h4>

            <a href="#platform">Loan Origination</a>
            <a href="#platform">Customer Management</a>
            <a href="#platform">Documents</a>
            <a href="#platform">Verification</a>
            <a href="#platform">Credit Assessment</a>
            <a href="#platform">Risk & Fraud</a>
          </div>

          <div className="footer-column">
            <h4>Operations</h4>

            <a href="#platform">Underwriting</a>
            <a href="#platform">Approval Workflow</a>
            <a href="#platform">Disbursement</a>
            <a href="#platform">Loan Servicing</a>
            <a href="#platform">Collections</a>
            <a href="#platform">Analytics</a>
          </div>

          <div className="footer-column">
            <h4>Intelligence</h4>

            <a href="#intelligence">Document AI</a>
            <a href="#intelligence">Credit Intelligence</a>
            <a href="#intelligence">Risk Intelligence</a>
            <a href="#intelligence">Fraud Detection</a>
            <a href="#intelligence">Underwriting AI</a>
            <a href="#intelligence">Enterprise RAG</a>
          </div>

          <div className="footer-column">
            <h4>Enterprise</h4>

            <a href="#enterprise">Roles & Workspaces</a>
            <a href="#security">Security</a>
            <a href="#security">Governance</a>
            <a href="#security">Audit</a>
            <a href="#integrations">Integrations</a>
            <a href="/register">Get started</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © 2026 Credora. All rights reserved.
          </span>

          <div>
            <a href="#security">Privacy</a>
            <a href="#security">Terms</a>
            <a href="#security">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;