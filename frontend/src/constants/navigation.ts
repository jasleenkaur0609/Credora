import {
  LayoutDashboard,
  FileText,
  Users,
  FolderOpen,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  ClipboardCheck,
  CheckCircle2,
  Banknote,
  ListTodo,
  MessageSquare,
  Sparkles,
  Languages,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
  permission?: string;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export const navigation: NavigationSection[] = [
  {
    title: "Workspace",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Applications",
        path: "/applications",
        icon: FileText,
        permission: "APPLICATION_VIEW",
      },
      {
        label: "Customers",
        path: "/customers",
        icon: Users,
        permission: "CUSTOMER_VIEW",
      },
    ],
  },

  {
    title: "Credit Operations",
    items: [
      {
        label: "Documents",
        path: "/documents",
        icon: FolderOpen,
        permission: "DOCUMENT_VIEW",
      },
      {
        label: "Verification",
        path: "/verification",
        icon: ShieldCheck,
        permission: "VERIFICATION_VIEW",
      },
      {
        label: "Credit Assessment",
        path: "/credit",
        icon: CreditCard,
        permission: "CREDIT_VIEW",
      },
      {
        label: "Risk Assessment",
        path: "/risk",
        icon: AlertTriangle,
        permission: "RISK_VIEW",
      },
      {
        label: "Underwriting",
        path: "/underwriting",
        icon: ClipboardCheck,
        permission: "UNDERWRITING_VIEW",
      },
      {
        label: "Approvals",
        path: "/approvals",
        icon: CheckCircle2,
        permission: "APPROVAL_VIEW",
      },
      {
        label: "Disbursement",
        path: "/disbursement",
        icon: Banknote,
        permission: "DISBURSEMENT_VIEW",
      },
    ],
  },

  {
    title: "Operations",
    items: [
      {
        label: "Tasks",
        path: "/tasks",
        icon: ListTodo,
      },
      {
        label: "Communication",
        path: "/communication",
        icon: MessageSquare,
      },
    ],
  },

  {
    title: "Intelligence",
    items: [
      {
        label: "AI Assistant",
        path: "/ai",
        icon: Sparkles,
      },
      {
        label: "Translation",
        path: "/translation",
        icon: Languages,
      },
      {
        label: "Analytics",
        path: "/analytics",
        icon: BarChart3,
      },
    ],
  },

  {
    title: "Administration",
    items: [
      {
        label: "Administration",
        path: "/administration",
        icon: Settings,
        permission: "ADMIN_VIEW",
      },
    ],
  },
];