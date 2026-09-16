import { motion, type Variants } from "framer-motion";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  Filter,
  Gauge,
  Layers3,
  PieChart,
  ShieldAlert,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  //LineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "../Home.css";

const approvalTrend = [
  { month: "Apr", applications: 680, approved: 412, disbursed: 328 },
  { month: "May", applications: 760, approved: 468, disbursed: 371 },
  { month: "Jun", applications: 820, approved: 524, disbursed: 418 },
  { month: "Jul", applications: 910, approved: 587, disbursed: 462 },
  { month: "Aug", applications: 980, approved: 641, disbursed: 518 },
  { month: "Sep", applications: 1080, approved: 712, disbursed: 576 },
];

const portfolioData = [
  { product: "Personal", value: 38 },
  { product: "Business", value: 27 },
  { product: "Vehicle", value: 19 },
  { product: "Home", value: 16 },
];

const riskData = [
  { level: "Low", value: 54 },
  { level: "Medium", value: 29 },
  { level: "High", value: 12 },
  { level: "Critical", value: 5 },
];

const operationalData = [
  { stage: "Submitted", count: 1080 },
  { stage: "Documents", count: 842 },
  { stage: "Verification", count: 716 },
  { stage: "Credit", count: 628 },
  { stage: "Underwriting", count: 493 },
  { stage: "Approved", count: 412 },
];

const COLORS = ["#2563eb", "#4f46e5", "#06b6d4", "#0f172a"];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  positive = true,
  detail,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  change: string;
  positive?: boolean;
  detail: string;
}) {
  return (
    <motion.div className="analytics-metric-card" variants={fadeUp}>
      <div className="analytics-metric-top">
        <div className="analytics-metric-icon">
          <Icon size={18} strokeWidth={1.9} />
        </div>

        <span className={positive ? "metric-change positive" : "metric-change negative"}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </span>
      </div>

      <div className="analytics-metric-label">{label}</div>
      <div className="analytics-metric-value">{value}</div>
      <div className="analytics-metric-detail">{detail}</div>
    </motion.div>
  );
}

function Analytics() {
  return (
    <section className="analytics-section" id="analytics">
      <div className="analytics-container">
        <motion.div
          className="analytics-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
        >
          <motion.div className="analytics-kicker" variants={fadeUp}>
            <BarChart3 size={15} />
            Enterprise Analytics
          </motion.div>

          <motion.div className="analytics-heading-row" variants={fadeUp}>
            <div>
              <h2>
                Turn lending data into
                <span> decision intelligence.</span>
              </h2>

              <p>
                Credora connects origination, credit, risk, underwriting,
                disbursement and servicing data into a unified analytics layer
                for operational and executive decision-making.
              </p>
            </div>

            <div className="analytics-period-control">
              <CalendarDays size={15} />
              <span>Last 6 months</span>
              <ChevronDown size={15} />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="analytics-workspace"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={stagger}
        >
          <motion.div className="analytics-workspace-bar" variants={fadeUp}>
            <div className="analytics-workspace-brand">
              <div className="analytics-brand-mark">
                <Gauge size={17} />
              </div>

              <div>
                <strong>Credora Analytics</strong>
                <span>Portfolio intelligence workspace</span>
              </div>
            </div>

            <div className="analytics-workspace-actions">
              <button type="button">
                <Filter size={14} />
                Filters
              </button>

              <button type="button">
                <Layers3 size={14} />
                All portfolios
                <ChevronDown size={13} />
              </button>
            </div>
          </motion.div>

          <motion.div className="analytics-metrics" variants={stagger}>
            <MetricCard
              icon={CircleDollarSign}
              label="Managed portfolio"
              value="₹184.6 Cr"
              change="12.8%"
              detail="vs. previous period"
            />

            <MetricCard
              icon={FileCheck2}
              label="Approval rate"
              value="65.9%"
              change="4.6%"
              detail="approval efficiency"
            />

            <MetricCard
              icon={WalletCards}
              label="Disbursement volume"
              value="₹72.4 Cr"
              change="9.3%"
              detail="across active products"
            />

            <MetricCard
              icon={ShieldAlert}
              label="Portfolio at risk"
              value="4.8%"
              change="0.9%"
              positive={false}
              detail="risk exposure"
            />
          </motion.div>

          <div className="analytics-main-grid">
            <motion.div className="analytics-panel analytics-trend-panel" variants={fadeUp}>
              <div className="analytics-panel-header">
                <div>
                  <span className="analytics-panel-eyebrow">
                    Origination performance
                  </span>
                  <h3>Application & approval trend</h3>
                </div>

                <div className="analytics-legend">
                  <span>
                    <i className="legend-dot applications" />
                    Applications
                  </span>
                  <span>
                    <i className="legend-dot approved" />
                    Approved
                  </span>
                  <span>
                    <i className="legend-dot disbursed" />
                    Disbursed
                  </span>
                </div>
              </div>

              <div className="analytics-chart-large">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={approvalTrend}>
                    <defs>
                      <linearGradient id="applicationFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopOpacity={0.22} />
                        <stop offset="100%" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid vertical={false} strokeDasharray="4 4" />

                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="applications"
                      stroke="#2563eb"
                      fill="url(#applicationFill)"
                      strokeWidth={2.5}
                    />

                    <Line
                      type="monotone"
                      dataKey="approved"
                      stroke="#4f46e5"
                      strokeWidth={2.5}
                      dot={false}
                    />

                    <Line
                      type="monotone"
                      dataKey="disbursed"
                      stroke="#06b6d4"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div className="analytics-panel risk-panel" variants={fadeUp}>
              <div className="analytics-panel-header">
                <div>
                  <span className="analytics-panel-eyebrow">Portfolio health</span>
                  <h3>Risk distribution</h3>
                </div>

                <div className="analytics-panel-icon">
                  <ShieldAlert size={17} />
                </div>
              </div>

              <div className="risk-chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={riskData}
                      dataKey="value"
                      nameKey="level"
                      cx="50%"
                      cy="50%"
                      innerRadius={64}
                      outerRadius={92}
                      paddingAngle={3}
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={entry.level} fill={COLORS[index]} />
                      ))}
                    </Pie>

                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>

                <div className="risk-chart-center">
                  <strong>83%</strong>
                  <span>Low / Medium</span>
                </div>
              </div>

              <div className="risk-breakdown">
                {riskData.map((risk, index) => (
                  <div className="risk-row" key={risk.level}>
                    <span>
                      <i
                        className="risk-color"
                        style={{ background: COLORS[index] }}
                      />
                      {risk.level}
                    </span>

                    <strong>{risk.value}%</strong>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="analytics-bottom-grid">
            <motion.div className="analytics-panel portfolio-panel" variants={fadeUp}>
              <div className="analytics-panel-header">
                <div>
                  <span className="analytics-panel-eyebrow">Portfolio mix</span>
                  <h3>Outstanding loan composition</h3>
                </div>

                <PieChart size={18} />
              </div>

              <div className="portfolio-content">
                <div className="portfolio-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={portfolioData}
                        dataKey="value"
                        nameKey="product"
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={74}
                        paddingAngle={4}
                      >
                        {portfolioData.map((entry, index) => (
                          <Cell key={entry.product} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>

                <div className="portfolio-list">
                  {portfolioData.map((item, index) => (
                    <div className="portfolio-item" key={item.product}>
                      <div>
                        <i
                          className="portfolio-color"
                          style={{ background: COLORS[index] }}
                        />
                        <span>{item.product} Loans</span>
                      </div>
                      <strong>{item.value}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div className="analytics-panel funnel-panel" variants={fadeUp}>
              <div className="analytics-panel-header">
                <div>
                  <span className="analytics-panel-eyebrow">
                    Operational throughput
                  </span>
                  <h3>Application funnel</h3>
                </div>

                <Activity size={18} />
              </div>

              <div className="funnel-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={operationalData}
                    layout="vertical"
                    margin={{ left: 10, right: 10 }}
                  >
                    <CartesianGrid horizontal={false} strokeDasharray="4 4" />

                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                    />

                    <YAxis
                      type="category"
                      dataKey="stage"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                      width={82}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="count"
                      radius={[0, 6, 6, 0]}
                      barSize={17}
                      fill="#2563eb"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div className="analytics-panel insight-panel" variants={fadeUp}>
              <div className="analytics-insight-icon">
                <TrendingUp size={19} />
              </div>

              <span className="analytics-panel-eyebrow">AI portfolio insight</span>

              <h3>
                Approval efficiency improved while high-risk exposure declined.
              </h3>

              <p>
                Credora Intelligence identifies changes across application
                volume, policy outcomes, risk signals and portfolio behavior.
              </p>

              <div className="insight-highlight">
                <div>
                  <strong>+4.6%</strong>
                  <span>approval efficiency</span>
                </div>

                <div>
                  <strong>-0.9%</strong>
                  <span>risk exposure</span>
                </div>
              </div>

              <button type="button" className="insight-link">
                Explore portfolio intelligence
                <ArrowUpRight size={15} />
              </button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="analytics-capabilities"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <Users size={19} />
            <div>
              <strong>Executive Intelligence</strong>
              <span>Portfolio-wide decision visibility</span>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <ShieldAlert size={19} />
            <div>
              <strong>Risk Monitoring</strong>
              <span>Early signals across portfolios</span>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Clock3 size={19} />
            <div>
              <strong>Operational Analytics</strong>
              <span>Workflow bottlenecks and SLA visibility</span>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <WalletCards size={19} />
            <div>
              <strong>Financial Analytics</strong>
              <span>Disbursement and portfolio performance</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="analytics-statement"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <span>One intelligence layer.</span>
          <strong>
            From individual applications to enterprise portfolio decisions.
          </strong>
        </motion.div>
      </div>
    </section>
  );
}

export default Analytics;