import { cleanList } from "../../lib/project.js";
export const labels = {
  dashboard: "Dashboard",
  projects: "Projects",
  blogs: "Blogs",
  insights: "Insights",
  clients: "Clients",
  team: "Team",
  testimonials: "Testimonials",
  contactPage: "Contact Page",
  stats: "Stats",
  mapLocations: "Client Map",
  whatWeDoServices: "What We Do",
  sections: "Sections",
  profile: "Profile",
  approvals: "Approvals",
  admins: "Employees",
  contactOffices: "Offices",
  submissions: "Contact Leads",
};
export const endpoints = {
  projects: "projects",
  blogs: "blogs",
  insights: "insights",
  clients: "clients",
  team: "team",
  testimonials: "testimonials",
  stats: "stats",
  mapLocations: "map-locations",
  contactOffices: "contact-offices",
  admins: "admins",
  submissions: "submissions",
};
export const navGroups = [
  ["Overview", ["dashboard"]],
  ["Content", ["projects", "blogs", "insights"]],
  ["People", ["clients", "team", "testimonials"]],
  [
    "Website",
    ["contactPage", "stats", "mapLocations", "whatWeDoServices", "sections"],
  ],
  ["Access", ["profile", "approvals", "admins"]],
];
export const permissionKeys = [
  "dashboard",
  "projects",
  "blogs",
  "insights",
  "clients",
  "team",
  "testimonials",
  "contactPage",
  "stats",
  "mapLocations",
  "whatWeDoServices",
  "sections",
];
export const ownerAccess = (user) =>
  Boolean(
    user?.canSaveDirect ||
      user?.isOwner ||
      user?.role === "owner" ||
      user?.email?.toLowerCase() === "alishafaq@gmail.com",
  );
export const managerAccess = (user) =>
  Boolean(user?.canManageAccess || ownerAccess(user) || user?.role === "admin");
export const mayView = (user, key) =>
  Boolean(
    managerAccess(user) ||
      ["profile", "approvals", "admins"].includes(key) ||
      user?.permissions?.includes(
        key === "contactOffices" || key === "submissions" ? "contactPage" : key,
      ),
  );
export const sortRecords = (rows) =>
  [...(rows || [])].sort(
    (a, b) =>
      (Number(a.order) || 0) - (Number(b.order) || 0) ||
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
  );
export function normalizeRecord(type, values) {
  const payload = { ...values };
  delete payload._id;
  delete payload.id;
  delete payload.createdAt;
  delete payload.updatedAt;
  delete payload.__v;
  if (type === "admins") {
    payload.active = payload.active !== false && payload.active !== "false";
    if (!payload.password) delete payload.password;
  } else {
    if ("visible" in payload)
      payload.visible =
        payload.visible !== false && payload.visible !== "false";
    for (const key of [
      "order",
      "rating",
      "readTime",
      "lat",
      "lng",
      "clientsCount",
    ])
      if (key in payload) payload[key] = Number(payload[key] || 0);
  }
  if ("images" in payload) payload.images = cleanList(payload.images);
  for (const key of ["tags", "permissions"])
    if (key in payload && !Array.isArray(payload[key]))
      payload[key] = String(payload[key] || "")
        .split(/[\n,]+/)
        .map((value) => value.trim())
        .filter(Boolean);
  return payload;
}
export const contactDefaults = {
  formTitle: "Tell us about your project",
  formSubtitle:
    "Fill in the details below and our team will get back to you within one business day.",
  sidebarLabel: "Contact details",
  teamTitle: "Meet the team",
  teamSubtitle: "Ready to discuss your project",
  teamStatus: "Team is online · Responds in < 24 h",
  officesTitle: "Our Offices",
  methodsTitle: "Other Ways to Reach Us",
  email: "sakinzo.work@gmail.com",
  emailLabel: "Email us directly",
  linkedinUrl: "https://www.linkedin.com/company/sakinzo",
  linkedinLabel: "Connect on LinkedIn",
  footerCtaTitle: "Ready to start your project?",
  footerCtaSubtitle: "Get a free consultation from our experts.",
  footerCtaButton: "Get in touch →",
};
