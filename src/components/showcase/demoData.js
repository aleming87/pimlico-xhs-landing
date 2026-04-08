/**
 * Demo data for the product showcase.
 * All data is synthetic — realistic but contains no real client information.
 * Designed to photograph well in marketing screenshots and video clips.
 */

// ── Organisation ────────────────────────────────────────
export const DEMO_ORG = {
  name: "Meridian Compliance",
  logoUrl: null, // Falls back to Pimlico branding
};

// ── Regulatory Updates ──────────────────────────────────
export const DEMO_UPDATES = [
  {
    id: "upd-001",
    title: "UKGC publishes new remote gambling and software technical standards",
    region: "United Kingdom",
    regionCode: "GB",
    vertical: "Gambling",
    category: "Standards",
    status: "Published",
    stage: "Final",
    date: "2026-04-07",
    source: "Gambling Commission",
  },
  {
    id: "upd-002",
    title: "MiCA transitional period ends — full CASP authorisation required",
    region: "European Union",
    regionCode: "EU",
    vertical: "Crypto",
    category: "Regulation",
    status: "In Force",
    stage: "Implementation",
    date: "2026-04-06",
    source: "European Securities and Markets Authority",
  },
  {
    id: "upd-003",
    title: "Finland opens online gambling licence application window",
    region: "Finland",
    regionCode: "FI",
    vertical: "Gambling",
    category: "Licensing",
    status: "Open",
    stage: "Application",
    date: "2026-04-05",
    source: "National Police Board of Finland",
  },
  {
    id: "upd-004",
    title: "DORA implementation deadline passes \u2014 full ICT compliance now required",
    region: "European Union",
    regionCode: "EU",
    vertical: "Payments",
    category: "Legislation",
    status: "Adopted",
    stage: "Final",
    date: "2026-04-04",
    source: "European Parliament",
  },
  {
    id: "upd-005",
    title: "Netherlands KSA imposes \u20AC1.2M fine for AML compliance failures",
    region: "Netherlands",
    regionCode: "NL",
    vertical: "Gambling",
    category: "Enforcement",
    status: "Final",
    stage: "Decision",
    date: "2026-04-03",
    source: "Kansspelautoriteit",
  },
  {
    id: "upd-006",
    title: "EU AI Act Article 6 high-risk classification guidance published",
    region: "European Union",
    regionCode: "EU",
    vertical: "AI",
    category: "Guidance",
    status: "Published",
    stage: "Implementation",
    date: "2026-04-02",
    source: "AI Office",
  },
];

// ── Watchlists ──────────────────────────────────────────
export const DEMO_WATCHLISTS = [
  { id: "w1", name: "UK Gambling & Licensing", enabled: true, jurisdictionCount: 1, alertCount: 3 },
  { id: "w2", name: "EU Payments (PSD2/MiCA)", enabled: true, jurisdictionCount: 4, alertCount: 1 },
  { id: "w3", name: "Nordic Market Entry", enabled: true, jurisdictionCount: 3, alertCount: 5 },
  { id: "w4", name: "AI Act Compliance", enabled: false, jurisdictionCount: 1, alertCount: 0 },
];

// ── Projects ────────────────────────────────────────────
export const DEMO_PROJECTS = [
  {
    id: "p1",
    name: "German Market Entry",
    status: "active",
    color: "#3B82F6",
    progress: { completed: 12, total: 18 },
    dueDate: "2026-06-30",
    members: ["SC", "JM"],
  },
  {
    id: "p2",
    name: "Finland Licence Application",
    status: "active",
    color: "#10B981",
    progress: { completed: 4, total: 14 },
    dueDate: "2026-08-15",
    members: ["EV", "DK"],
  },
  {
    id: "p3",
    name: "Netherlands Compliance Review",
    status: "active",
    color: "#F59E0B",
    progress: { completed: 8, total: 10 },
    dueDate: "2026-05-01",
    members: ["SC", "AK"],
  },
];

// ── News Articles ───────────────────────────────────────
export const DEMO_NEWS = [
  {
    id: "n1",
    title: "Regulatory Catalyst: Finland\u2019s Gambling Market Opens",
    category: "Gambling",
    date: "2026-04-07",
    readTime: "5 min",
    author: "Pimlico XHS\u2122 Team",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=400&fit=crop",
  },
  {
    id: "n2",
    title: "DORA & MiCA: What Payment Operators Need to Know",
    category: "Payments",
    date: "2026-04-05",
    readTime: "7 min",
    author: "Pimlico XHS\u2122 Team",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
  },
  {
    id: "n3",
    title: "EU AI Act Compliance Deadlines Approaching",
    category: "AI Regulation",
    date: "2026-04-03",
    readTime: "6 min",
    author: "Pimlico XHS\u2122 Team",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=400&fit=crop",
  },
];

// ── Country Detail — Finland ────────────────────────────
export const DEMO_COUNTRY = {
  name: "Finland",
  code: "FI",
  flag: "\ud83c\uddeb\ud83c\uddee",
  photo: "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=800&h=500&fit=crop",
  sectors: [
    { name: "Gambling", status: "Transitioning", color: "#F59E0B" },
    { name: "Payments", status: "Regulated", color: "#10B981" },
    { name: "Crypto", status: "MiCA Aligned", color: "#3B82F6" },
    { name: "AI", status: "EU AI Act", color: "#8B5CF6" },
  ],
  keyFacts: {
    population: "5.6M",
    capital: "Helsinki",
    currency: "EUR",
    euMember: true,
  },
  regulators: [
    "National Police Board",
    "Finnish Financial Supervisory Authority",
    "Transport and Communications Agency",
  ],
  timeline: [
    { date: "2026-01-01", event: "Gambling Act 2026 enters force" },
    { date: "2026-04-01", event: "Licence application window opens" },
    { date: "2026-06-30", event: "MiCA full application deadline" },
    { date: "2027-01-01", event: "Regulated market launch" },
  ],
};

// ── Workspace Products ──────────────────────────────────
export const DEMO_PRODUCTS = [
  { id: "projects", title: "Projects", desc: "Task lists, assignments, and compliance workflows.", icon: "FolderKanban" },
  { id: "lens", title: "Lens\u2122", desc: "AI-powered regulatory analysis and framework comparison.", icon: "ScanSearch" },
  { id: "technical", title: "Technical\u2122", desc: "Technical compliance standards and testing.", icon: "Wrench" },
  { id: "blocklists", title: "Blocklists\u2122", desc: "Country-level restricted entity monitoring.", icon: "Shield" },
  { id: "competitors", title: "Competitors\u2122", desc: "Track competitor licences, fines, and activity.", icon: "Users" },
  { id: "collaborators", title: "Collaborators\u2122", desc: "Partnerships and collaborative work streams.", icon: "Star" },
];

// ── Workflow Builder Blocks ─────────────────────────────
export const DEMO_WORKFLOW = {
  name: "Licence Impact Assessment",
  blocks: [
    { id: "b1", type: "jurisdiction-select", label: "Select Jurisdictions", output: "Finland, Germany, Netherlands" },
    { id: "b2", type: "ai-analysis", label: "AI Impact Analysis", output: "Analysing 3 jurisdictions..." },
    { id: "b3", type: "conditional", label: "High Risk?", output: "If risk score > 7" },
    { id: "b4", type: "response", label: "Generate Report", output: "PDF export with citations" },
    { id: "b5", type: "notify", label: "Notify Team", output: "Slack #compliance-alerts" },
  ],
};
