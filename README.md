# 🏦 Credora

### Intelligent Loan Origination & Credit Operations Platform

> **Credora** is an enterprise-grade, AI-powered platform designed to modernize the complete lending lifecycle — from customer onboarding and document collection to credit assessment, risk analysis, underwriting, approval, disbursement, and loan servicing.

<br/>

![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge)
![Architecture](https://img.shields.io/badge/Architecture-Full--Stack-blue?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![AI](https://img.shields.io/badge/AI-Python%20%2B%20FastAPI-3776AB?style=for-the-badge\&logo=python\&logoColor=white)
![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20MongoDB-336791?style=for-the-badge)

---

## ✨ Overview

Credora is being built as a **unified digital lending and credit operations platform**.

The platform combines:

* 🧑‍💼 Customer & Applicant Management
* 📝 Loan Application Origination
* 📄 Intelligent Document Processing
* 🔍 Verification Workflows
* 💳 Credit Assessment
* ⚠️ Risk Intelligence
* 🕵️ Fraud Detection
* 🧠 AI-Assisted Underwriting
* ✅ Approval Workflows
* 💰 Offers & Agreements
* 🏦 Disbursement
* 📊 Loan Servicing & Repayment
* 🔔 Notifications & Communications
* 🤖 Enterprise AI Assistant
* 📚 RAG-powered Knowledge Intelligence
* 📈 Analytics & Reporting
* 🔐 Enterprise RBAC & Security
* 🧾 Audit & Compliance

The goal is to create a platform where **human decision-makers are supported by intelligent automation**, while maintaining transparency, security, auditability, and regulatory controls.

---

# 🎯 Product Vision

```text
                    ┌───────────────────────┐
                    │        CREDORA        │
                    │ Intelligent Lending   │
                    └───────────┬───────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
   CUSTOMER                  CREDIT                  OPERATIONS
   EXPERIENCE               INTELLIGENCE             AUTOMATION
        │                       │                       │
        ▼                       ▼                       ▼
   Applications           Risk Analysis           Workflows
   Documents              Credit Assessment        Tasks
   Communication           Fraud Detection         Approvals
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                                ▼
                         HUMAN DECISION
                                │
                                ▼
                       LOAN LIFECYCLE
```

---

# 🚀 Core Capabilities

## 👤 Customer Management

Manage the complete customer lifecycle.

* Customer profiles
* Personal information
* Contact information
* Employment details
* Financial information
* Customer documents
* Customer history
* Application history
* Communication history
* Risk profile

---

## 📝 Loan Origination

Support the complete loan application journey.

```text
Draft
  ↓
Submitted
  ↓
Document Collection
  ↓
Verification
  ↓
Credit Assessment
  ↓
Risk Assessment
  ↓
Underwriting
  ↓
Approval
  ↓
Offer
  ↓
Agreement
  ↓
Disbursement
  ↓
Active Loan
  ↓
Closed
```

Additional states:

* Rejected
* Withdrawn
* On Hold
* Cancelled
* Referred

---

## 📄 Document Intelligence

Credora uses AI to transform unstructured documents into actionable lending information.

### Supported intelligence

* OCR
* Document classification
* Field extraction
* Document quality analysis
* Duplicate detection
* Missing document detection
* Expiry detection
* Cross-document validation
* Data mismatch detection
* Suspicious document indicators

### Example

```text
Uploaded Document
        ↓
Document Classification
        ↓
OCR / Text Extraction
        ↓
Field Extraction
        ↓
Validation
        ↓
Cross-document Comparison
        ↓
AI Confidence Score
        ↓
Human Verification
```

---

# 🧠 AI Intelligence

AI is not treated as a separate demo feature.

It is integrated directly into the lending workflow.

## Credit Intelligence

AI can analyze:

* Income
* Existing obligations
* FOIR
* DTI
* Credit history
* Repayment behavior
* Financial patterns
* Credit bureau information

and produce an explainable credit summary.

---

## ⚠️ Risk Intelligence

Risk analysis can consider:

```text
Credit Risk
    +
Income Risk
    +
Fraud Risk
    +
Document Risk
    +
Repayment Risk
    +
Application Risk
        ↓
   Risk Assessment
        ↓
 Risk Factors + Score
        ↓
 Recommendation
```

AI recommendations remain **decision support**.

Final lending decisions remain under authorized human control.

---

## 🕵️ Fraud Intelligence

Potential fraud indicators can include:

* Identity inconsistencies
* Document inconsistencies
* Duplicate applications
* Suspicious financial patterns
* Multiple applications
* Address mismatches
* Document manipulation indicators
* Unusual application behavior

---

## 🤖 Enterprise AI Assistant

Credora will provide an AI assistant capable of answering questions using authorized enterprise data.

Example queries:

```text
"Summarize application CRD-10293."

"Why was this application referred?"

"What documents are missing?"

"Show the major risk factors."

"What is the current underwriting status?"

"What does our credit policy say about FOIR?"

"Compare this application with the applicable loan policy."
```

The assistant will respect:

* User permissions
* Application access
* Customer access
* Data boundaries
* Audit requirements

---

# 📚 RAG & Knowledge Intelligence

Credora will use Retrieval-Augmented Generation for enterprise knowledge.

```text
Policies
SOPs
Loan Rules
Regulatory Documents
Credit Guidelines
Product Rules
Internal Documentation
        │
        ▼
Knowledge Processing
        │
        ▼
Chunking + Metadata
        │
        ▼
Embeddings
        │
        ▼
Vector Search
        │
        ▼
Relevant Context
        │
        ▼
LLM
        │
        ▼
Grounded Response
```

This allows AI responses to be grounded in organizational knowledge instead of relying solely on general model knowledge.

---

# 🏗️ Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                        CREDORA PLATFORM                      │
└──────────────────────────────────────────────────────────────┘

                           USER
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                     React + TypeScript                       │
│                                                              │
│ Dashboard │ Applications │ Customers │ Documents │ Credit   │
│ Risk │ Underwriting │ Approvals │ Loans │ Analytics │ Admin │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              │ HTTPS / REST API
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                  Node.js + Express + TypeScript              │
│                                                              │
│ Auth │ RBAC │ Applications │ Customers │ Loans │ Documents  │
│ Credit │ Risk │ Underwriting │ Approvals │ Notifications    │
│ Audit │ Administration │ Business Workflows                 │
└──────────────┬───────────────────────────────┬───────────────┘
               │                               │
               │                               │
               ▼                               ▼
┌──────────────────────────┐       ┌───────────────────────────┐
│       PostgreSQL         │       │        MongoDB             │
│                          │       │                           │
│ Core Business Data       │       │ AI / Flexible Data        │
│ Users                    │       │ Document Extractions      │
│ Customers                │       │ AI Analysis               │
│ Applications             │       │ Conversations              │
│ Loans                    │       │ Knowledge Chunks          │
│ Approvals                │       │ AI Outputs                │
│ Audit Logs               │       │                           │
└──────────────────────────┘       └───────────────────────────┘
               │
               │
               ▼
┌──────────────────────────────────────────────────────────────┐
│                    Python + FastAPI AI                       │
│                                                              │
│ OCR │ Document Intelligence │ Embeddings │ RAG │ LLM        │
│ Credit Intelligence │ Risk Intelligence │ Fraud Analysis    │
│ Underwriting Intelligence                                  │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
                    External AI / ML Services

                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                         Firebase                             │
│                                                              │
│ Cloud Storage │ Push Notifications (FCM)                    │
└──────────────────────────────────────────────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

| Technology      | Purpose                   |
| --------------- | ------------------------- |
| React           | UI framework              |
| TypeScript      | Type safety               |
| Vite            | Development/build tooling |
| Tailwind CSS    | UI styling                |
| React Router    | Routing                   |
| Zustand         | Client state management   |
| React Hook Form | Form management           |
| Zod             | Validation                |
| Recharts        | Analytics & visualization |
| Framer Motion   | UI animation              |
| Lucide          | Icons                     |
| date-fns        | Date utilities            |

---

## Backend

| Technology    | Purpose                    |
| ------------- | -------------------------- |
| Node.js       | Runtime                    |
| Express       | API framework              |
| TypeScript    | Type safety                |
| Prisma        | PostgreSQL ORM             |
| Zod           | Request validation         |
| Helmet        | Security headers           |
| CORS          | Cross-origin configuration |
| Cookie Parser | Secure cookie handling     |
| Rate Limiting | API abuse protection       |
| Nodemailer    | Email communication        |

---

## AI Service

| Technology    | Purpose                 |
| ------------- | ----------------------- |
| Python        | AI runtime              |
| FastAPI       | AI service API          |
| LLM           | Generative intelligence |
| Embeddings    | Semantic search         |
| Vector Search | RAG retrieval           |
| OCR           | Document processing     |
| ML Models     | Risk/fraud intelligence |

---

## Databases

### PostgreSQL

Primary system of record.

Used for:

* Users
* Roles
* Permissions
* Customers
* Applications
* Loan Products
* Documents metadata
* Verification
* Credit Assessments
* Risk Assessments
* Underwriting
* Approvals
* Offers
* Agreements
* Disbursements
* Repayments
* Tasks
* Notifications
* Audit Logs

### MongoDB

Used for flexible and AI-oriented data:

* Document extraction results
* AI analysis
* AI conversations
* Knowledge chunks
* AI outputs
* Flexible document structures
* Communication transcripts

---

# 🔐 Security Architecture

Security is a first-class component of Credora.

## Authentication

Planned authentication capabilities:

* Registration
* Login
* Logout
* Email verification
* Forgot password
* Password reset
* Password change
* Access tokens
* Refresh tokens
* Session management
* Account lockout
* Rate limiting
* Password history
* RBAC
* Audit logging

---

## Password Security

Credora will use:

```text
User Password
      ↓
Password Policy Validation
      ↓
Argon2id Hash
      ↓
Database
```

Passwords will never be stored as plaintext.

Temporary registration passwords will be cryptographically generated and sent through email.

Users with:

```text
mustResetPassword = true
```

will be required to reset their password before normal application access.

---

# 👥 Role-Based Access Control

Credora follows:

```text
USER
  ↓
ROLE
  ↓
PERMISSIONS
  ↓
MODULE ACCESS
  ↓
ACTIONS
```

### Planned roles

* Super Admin
* Operations Manager
* Loan Officer
* Verification Officer
* Credit Analyst
* Risk Manager
* Underwriter
* Approver
* Disbursement Officer
* Auditor
* Customer

### Example permissions

```text
APPLICATION_VIEW
APPLICATION_CREATE
APPLICATION_EDIT
APPLICATION_ASSIGN
APPLICATION_SUBMIT

DOCUMENT_VIEW
DOCUMENT_UPLOAD
DOCUMENT_VERIFY
DOCUMENT_REJECT

CREDIT_VIEW
CREDIT_ASSESS
CREDIT_EDIT
CREDIT_SUBMIT
CREDIT_OVERRIDE

APPROVAL_VIEW
APPROVAL_APPROVE
APPROVAL_REJECT
APPROVAL_SEND_BACK
```

---

# 🧾 Audit & Compliance

Important business and security actions will generate immutable audit events.

Examples:

```text
USER_REGISTERED
EMAIL_VERIFIED
LOGIN_SUCCESS
LOGIN_FAILED
ACCOUNT_LOCKED

PASSWORD_RESET_REQUESTED
PASSWORD_RESET_COMPLETED
PASSWORD_CHANGED
LOGOUT
SESSION_REVOKED

APPLICATION_CREATED
APPLICATION_SUBMITTED
APPLICATION_APPROVED
APPLICATION_REJECTED

DOCUMENT_UPLOADED
DOCUMENT_VERIFIED
DOCUMENT_REJECTED

CREDIT_ASSESSMENT_CREATED
RISK_ASSESSMENT_CREATED
UNDERWRITING_COMPLETED
```

Each audit record can capture:

* Actor
* Action
* Resource
* Timestamp
* IP address
* User agent
* Previous state
* New state
* Request correlation ID

---

# 📁 Project Structure

```text
Credora/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── schemas/
│   │   ├── types/
│   │   ├── utils/
│   │   └── routes/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   │   ├── auth/
│   │   │   └── email/
│   │   ├── types/
│   │   ├── utils/
│   │   └── validators/
│   └── package.json
│
├── ai-service/
│   ├── app/
│   ├── api/
│   ├── services/
│   ├── models/
│   ├── rag/
│   ├── document_intelligence/
│   ├── credit_intelligence/
│   ├── risk_intelligence/
│   └── requirements.txt
│
├── database/
│   ├── prisma/
│   ├── migrations/
│   ├── seeds/
│   └── mongo/
│
├── infrastructure/
│   ├── docker/
│   ├── nginx/
│   └── monitoring/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── security/
│   ├── ai/
│   └── workflows/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .gitignore
└── README.md
```

---

# 🧩 Module Map

```text
CREDORA
│
├── Identity & Access
│
├── Customer Management
│
├── Loan Products
│
├── Application Origination
│
├── Document Management
│
├── Verification
│
├── Credit Assessment
│
├── Risk Assessment
│
├── Fraud Detection
│
├── Underwriting
│
├── Approval Workflow
│
├── Offer Management
│
├── Agreement Management
│
├── Disbursement
│
├── Loan Servicing
│
├── Repayments
│
├── Tasks
│
├── Communications
│
├── Notifications
│
├── AI Intelligence
│
├── Analytics
│
├── Administration
│
└── Audit & Compliance
```

---

# ⚙️ Local Development

## Prerequisites

Install the following before starting development:

* Node.js
* npm
* Python
* Git
* Docker Desktop
* PostgreSQL *(Docker-managed in development)*
* MongoDB *(Docker-managed in development)*

---

# 🚀 Getting Started

Clone the repository:

```bash
git clone <repository-url>
cd Credora
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Backend

Open another terminal:

```bash
cd backend
npm install
npm run dev
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
GET /api/v1/health
```

---

## AI Service

```bash
cd ai-service
python -m venv .venv
```

Windows:

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn app.main:app --reload --port 8000
```

---

# 🐳 Infrastructure

Credora uses Docker for local infrastructure.

Planned services:

```text
Docker Compose
│
├── PostgreSQL
│
├── MongoDB
│
└── Future infrastructure services
```

Persistent volumes will be used so database data survives container restarts.

---

# 🔄 Development Workflow

Credora follows a structured development workflow.

```text
Requirement
    ↓
Architecture
    ↓
Database Design
    ↓
Backend API
    ↓
AI Integration
    ↓
Frontend UI
    ↓
Validation
    ↓
Testing
    ↓
Security Review
    ↓
Documentation
    ↓
Git Commit
```

---

# 🧪 Testing Strategy

Testing will be introduced progressively.

### Frontend

* Unit tests
* Component tests
* Form validation tests
* Integration tests

Planned tools:

```text
Vitest
React Testing Library
```

### Backend

* Unit tests
* API tests
* Authentication tests
* Authorization tests
* Validation tests
* Service tests

### End-to-End

```text
Playwright
```

Example critical flows:

```text
Registration
   ↓
Email Verification
   ↓
Password Reset
   ↓
Login
   ↓
Dashboard
```

and:

```text
Application
   ↓
Documents
   ↓
Verification
   ↓
Credit
   ↓
Risk
   ↓
Underwriting
   ↓
Approval
   ↓
Disbursement
```

---

# 📊 Observability & Reliability

Future production capabilities include:

* Structured logging
* Correlation IDs
* API monitoring
* Error tracking
* Health checks
* Database monitoring
* Performance monitoring
* AI latency monitoring
* AI confidence monitoring
* Audit trails

---

# 🔌 API Architecture

The backend follows versioned APIs:

```text
/api/v1/
```

Example structure:

```text
/api/v1/auth
/api/v1/users
/api/v1/customers
/api/v1/applications
/api/v1/documents
/api/v1/verifications
/api/v1/credit
/api/v1/risk
/api/v1/underwriting
/api/v1/approvals
/api/v1/offers
/api/v1/agreements
/api/v1/disbursements
/api/v1/loans
/api/v1/repayments
/api/v1/tasks
/api/v1/notifications
/api/v1/analytics
/api/v1/admin
/api/v1/audit
```

API documentation will eventually be maintained using OpenAPI / Swagger.

---

# 🤝 Engineering Principles

Credora follows these core principles:

### 1. Security First

Authentication, authorization, validation, auditability, and secure data handling are built into the architecture.

### 2. Human-in-the-Loop AI

AI provides recommendations and intelligence.

Authorized humans remain responsible for final credit decisions.

### 3. API-First Design

Frontend, backend, and AI services communicate through clearly defined contracts.

### 4. Strong Data Ownership

PostgreSQL remains the source of truth for core business transactions.

MongoDB is used where flexible document-oriented storage provides a clear advantage.

### 5. No Fake Core Functionality

Core features should use real:

* APIs
* Database operations
* Authentication
* AI services
* File processing
* Validation
* Business rules

rather than hardcoded mock responses.

### 6. Explainability

Important AI outputs should provide:

```text
Recommendation
    +
Confidence
    +
Supporting Factors
    +
Relevant Evidence
```

### 7. Least Privilege

Users receive only the permissions required for their responsibilities.

---

# 🗺️ Development Roadmap

## Phase 1 — Foundation

* [x] Repository initialization
* [x] Frontend initialization
* [x] Backend initialization
* [ ] Docker infrastructure
* [ ] PostgreSQL
* [ ] Prisma
* [ ] MongoDB
* [ ] Environment configuration

---

## Phase 2 — Identity & Access

* [ ] User model
* [ ] Role model
* [ ] Permission model
* [ ] Registration
* [ ] Email verification
* [ ] Temporary password
* [ ] Password reset
* [ ] Login
* [ ] Logout
* [ ] Refresh tokens
* [ ] Session management
* [ ] Account lockout
* [ ] RBAC
* [ ] Audit events

---

## Phase 3 — Core Lending

* [ ] Customer management
* [ ] Loan products
* [ ] Applications
* [ ] Application workflow
* [ ] Document management
* [ ] Verification
* [ ] Tasks
* [ ] Notifications

---

## Phase 4 — Credit & Risk

* [ ] Credit assessment
* [ ] Financial analysis
* [ ] Risk assessment
* [ ] Fraud indicators
* [ ] Underwriting
* [ ] Approval workflows
* [ ] Offers
* [ ] Agreements

---

## Phase 5 — AI Intelligence

* [ ] AI service
* [ ] OCR
* [ ] Document classification
* [ ] Data extraction
* [ ] Document validation
* [ ] Embeddings
* [ ] Vector search
* [ ] RAG
* [ ] Credit intelligence
* [ ] Risk intelligence
* [ ] Fraud intelligence
* [ ] Underwriting intelligence
* [ ] Enterprise AI assistant

---

## Phase 6 — Loan Operations

* [ ] Disbursement
* [ ] Loan servicing
* [ ] Repayment tracking
* [ ] Delinquency tracking
* [ ] Customer communications
* [ ] Notifications
* [ ] Operational dashboards

---

## Phase 7 — Analytics & Enterprise

* [ ] Executive dashboards
* [ ] Portfolio analytics
* [ ] Credit analytics
* [ ] Risk analytics
* [ ] Operational analytics
* [ ] Audit dashboards
* [ ] AI analytics
* [ ] Advanced administration

---

# 📌 Current Project Status

```text
Credora
│
├── Frontend       ██████████░░░░░░░░░░  Foundation
├── Backend        ██████████░░░░░░░░░░  Foundation
├── Database       ██░░░░░░░░░░░░░░░░░░  Setup
├── AI             ░░░░░░░░░░░░░░░░░░░░  Planned
├── Security       ██░░░░░░░░░░░░░░░░░░  Foundation
├── Testing        ░░░░░░░░░░░░░░░░░░░░  Planned
└── Infrastructure ░░░░░░░░░░░░░░░░░░░░  Planned
```

**Current milestone:** Database & Infrastructure Foundation

---

# 🏛️ Enterprise Design Goals

Credora is being designed with future enterprise requirements in mind:

* Scalability
* Maintainability
* Security
* Auditability
* Observability
* Modularity
* Extensibility
* AI governance
* Data integrity
* Role isolation
* API versioning
* Testability
* Production deployment readiness

---

# 📖 Documentation

Project documentation will be maintained under:

```text
docs/
├── architecture/
├── api/
├── security/
├── ai/
└── workflows/
```

Documentation will cover:

* System architecture
* Database architecture
* API contracts
* Authentication
* RBAC
* AI architecture
* RAG architecture
* Business workflows
* Security decisions
* Deployment procedures

---

# 🌱 Git Strategy

Meaningful changes should be committed using conventional commit messages.

Examples:

```text
chore: initialize Credora project
chore: initialize Credora React frontend
chore: initialize Credora Express backend
chore: configure Docker infrastructure
feat: implement authentication module
feat: add customer management
feat: implement loan application workflow
feat: add document intelligence service
feat: implement credit assessment
fix: resolve application validation issue
refactor: improve authentication service
docs: update architecture documentation
test: add authentication integration tests
```

---

# 🛡️ Security Notice

Credora handles potentially sensitive financial and customer information.

Production deployments must implement appropriate:

* Encryption
* Secret management
* Access controls
* Network security
* Data retention policies
* Audit controls
* Compliance requirements
* Monitoring
* Backup and recovery procedures

Development credentials must **never** be committed to Git.

---

# 📄 License

This project is currently under private development.

License and distribution terms will be defined before production release.

---

<div align="center">

### 🏦 Credora

**Intelligent Lending. Better Decisions. Stronger Operations.**

Built with ❤️ using React, Node.js, Python, PostgreSQL, MongoDB and AI.

</div>
