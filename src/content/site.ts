// Single source of truth for all copy on the site (from info/content.docx).

export const site = {
  name: "NEXEN POWER",
  shortName: "Nexen Power",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexenpower.in",
  description:
    "NEXEN POWER is an Independent Power Producer building and operating utility-scale solar, wind, hybrid and battery storage infrastructure across India — 580+ MW operational across 8 states.",
  tagline: "Proven Renewable Operations. Strategic Growth. Sustainable Impact.",
  contact: {
    address: [
      "4th Floor, Scorpio House",
      "Central Avenue Road, Hiranandani Gardens",
      "Powai, Mumbai – 400076",
    ],
    phones: ["02425-225011", "9822601644", "9922008700"],
    email: "info@nexenpower.in",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Scorpio+House+Central+Avenue+Road+Hiranandani+Gardens+Powai+Mumbai+400076",
  },
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Board of Directors", href: "/about#board" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const;

export const stats = [
  { value: 580, suffix: "+", unit: "MW", label: "Operational Renewable Capacity" },
  { value: 8, suffix: "", unit: "States", label: "Pan-India Geographic Presence" },
  { value: 25, suffix: "+", unit: "Years", label: "Renewable Energy Expertise" },
] as const;

export const hero = {
  eyebrow: "Independent Power Producer · India",
  title: "Powering India’s $300 Billion Renewable Energy Transformation",
  subtitle: site.tagline,
};

export const intro = {
  label: "Who we are",
  title: "Building India’s Renewable Energy Infrastructure with Strategic Purpose",
  lead: "An Independent Power Producer (IPP) combining operational excellence with ambitious growth plans for India’s clean energy future.",
  body: "Born from decades of renewable energy operations, NEXEN POWER represents the evolution of proven expertise into an independent, growth-focused platform. We bring the stability of established operational assets with the ambition of strategic scaling—building utility-scale infrastructure through partnerships in solar, wind, hybrid, and battery storage technologies that define India’s energy transition.",
  pillars: [
    {
      title: "Operational Excellence",
      text: "Multi-state portfolio delivering consistent renewable energy performance",
    },
    {
      title: "Strategic Growth Platform",
      text: "Independent IPP model scaling through partnerships and capital efficiency",
    },
    {
      title: "Future-Ready Technologies",
      text: "Expanding into hybrid, BESS, and next-generation renewable solutions",
    },
  ],
};

export type ServiceKind = "solar" | "wind" | "storage";

export const services = {
  label: "Services",
  title: "Renewable Energy, Endless Possibilities",
  items: [
    {
      kind: "solar" as ServiceKind,
      slug: "solar",
      title: "Solar Development & Operations",
      text: "End-to-end solar project development and operations. Building utility-scale solar infrastructure that delivers reliable performance across multiple regions.",
      tags: ["Utility-scale", "Development", "O&M"],
    },
    {
      kind: "wind" as ServiceKind,
      slug: "wind",
      title: "Wind Development & Operations",
      text: "Comprehensive wind energy solutions from development to operations. Maximizing energy yield across India’s wind corridors with proven operational expertise.",
      tags: ["Wind corridors", "Energy yield", "Operations"],
    },
    {
      kind: "storage" as ServiceKind,
      slug: "hybrid-bess",
      title: "Hybrid & BESS Solutions",
      text: "Integrated hybrid projects combining solar, wind, and battery storage. Investing in next-generation BESS technology for enhanced grid stability and returns.",
      tags: ["Hybrid", "Battery storage", "Grid stability"],
    },
  ],
};

export const approach = {
  label: "Operational Excellence, Strategic Growth",
  title: "Building India’s Renewable Energy Infrastructure Through Strategic Execution",
  lead: "Combining proven operational capabilities with strategic assets and partnerships to deliver scalable clean energy solutions across India.",
  body: "NEXEN POWER brings together decades of renewable energy expertise with a capital-efficient growth model. Our platform leverages operational excellence, strategic land assets, and industrial networks to develop, build, and operate utility-scale renewable projects that power India’s energy transition.",
  items: [
    {
      title: "Proven Operational Track Record",
      text: "Multi-state operational portfolio of wind and solar assets demonstrating consistent performance and reliable energy delivery through decades of proven renewable energy operations.",
    },
    {
      title: "Strategic Asset Leverage",
      text: "Capital-efficient growth model utilizing land portfolio advantages and balance sheet strength to accelerate project development while maintaining financial flexibility and strategic control.",
    },
    {
      title: "Integrated Capabilities",
      text: "End-to-end renewable energy expertise spanning project development, engineering, construction management, and long-term operations assuring quality execution and optimal asset performance.",
    },
    {
      title: "Future-Ready Technologies",
      text: "Strategic focus on next-generation renewable solutions including hybrid projects and Battery Energy Storage Systems (BESS) to meet evolving grid requirements and enhance project economics.",
    },
  ],
};

// Milestones drawn directly from "Our Story".
export const journey = [
  {
    mark: "100+ yrs",
    title: "The Malpani Group",
    text: "A century-old family business with deep industrial roots and networks.",
  },
  {
    mark: "25 yrs ago",
    title: "Entry into renewables",
    text: "The Group enters renewable energy and begins building wind and solar operations.",
  },
  {
    mark: "585 MW",
    title: "Multi-state portfolio",
    text: "Operational wind and solar capacity across 8+ states — decades of performance optimization, grid management and maintenance.",
  },
  {
    mark: "2024",
    title: "NEXEN POWER emerges",
    text: "Proven operations transformed into an independent power producer built for India’s next energy decade.",
  },
  {
    mark: "Next",
    title: "Multi-gigawatt platform",
    text: "Scaling through partnerships into hybrid projects, Battery Energy Storage Systems and emerging solutions.",
  },
];

export const about = {
  label: "About",
  title: "Committed to India’s Renewable Energy Future",
  vision:
    "To become a leading renewable energy platform recognized for operational excellence, strategic partnerships, and sustainable impact across India’s energy landscape.",
  mission:
    "Building and operating utility-scale renewable infrastructure through proven capabilities, strategic partnerships, and capital-efficient growth that delivers reliable performance and lasting value.",
  storyLead:
    "India’s renewable energy sector is at a defining moment, with over $300 billion in planned investments through 2030. The opportunity lies in building platforms that can scale and operate with excellence.",
  storyHook: "NEXEN POWER was created for this moment.",
  story: [
    "Our story begins with the Malpani Group, a century-old family business that entered renewable energy 25 years ago. Over time, this grew into 585 MW of operational wind and solar capacity across 8+ states. These assets reflect decades of experience in performance optimization, grid management, and long-term maintenance.",
    "In 2024, a strategic decision was made to transform these proven operations into an independent power producer (IPP) built for India’s next energy decade. NEXEN POWER emerged with an operational portfolio, an experienced team, and the strong backing of the Malpani Group. As an independent IPP, we gained the agility to move faster and the flexibility to build partnerships needed for a multi-gigawatt platform.",
    "Today, NEXEN POWER brings together operational expertise with a strong growth vision. We run utility-scale projects that deliver consistent returns and are developing capabilities across development, engineering, construction, and operations. Our strengths—land holdings, financial stability, and industrial networks—support smart expansion through partnerships with institutional investors and corporate buyers.",
    "We are investing in future-focused technologies such as hybrid projects, Battery Energy Storage Systems, and other emerging solutions that combine technology, economics, and policy.",
  ],
  storyClose: [
    "NEXEN POWER is credible, ambitious, and fast-moving. We’re building what India’s energy transition needs.",
    "Join us in powering India’s clean energy future.",
  ],
  values: [
    { title: "Long-Term Thinking", text: "Building infrastructure that delivers reliable performance for decades, not quarters." },
    { title: "Integrity", text: "Operating with complete transparency and trust in every partnership." },
    { title: "Execution Excellence", text: "Delivering on our commitments consistently and exceeding expectations." },
    { title: "Innovation & Adaptability", text: "Embracing emerging technologies and evolving market dynamics." },
    { title: "Collaborative Partnership", text: "Creating shared value through strategic collaboration with all stakeholders." },
    { title: "Accountability", text: "Taking full ownership of our commitments and learning from every project." },
  ],
};

export const board = {
  title: "Meet the Current Board of Directors",
  members: [
    { name: "Rajesh Malpani", role: "Chairman & Director", image: "/images/board/rajesh-malpani.webp" },
    { name: "Harshvardhan Malpani", role: "MD & Interim CEO", image: "/images/board/harshvardhan-malpani.webp" },
    { name: "Prafulla Khinvansara", role: "Director & CPO", image: "/images/board/prafulla-khinvansara.webp" },
    { name: "Ishwar Chand Mangal", role: "Independent Director", image: "/images/board/ishwar-chand-mangal.webp" },
  ],
  advisoryTitle: "Advisory Board Members",
  advisory: ["Kailas Bankar", "Sagar Durgawale", "Prashant Runwal", "Balaji Patil", "Tushar Katariya"],
};

export const contactCopy = {
  label: "Contact",
  pageTitle: "Contact Us to Power the Future with Clean Energy",
  title: "Let’s Build India’s Renewable Future Together",
  text: "We’re always open to partnerships, investment collaborations, and business opportunities that contribute to India’s renewable energy growth. Get in touch with our team to explore how NEXEN POWER can deliver strategic, sustainable energy solutions for your goals.",
  interests: ["Partnership", "Investment collaboration", "Power purchase (C&I)", "Land & project development", "Careers", "Other"],
};

/** International tel: link for an Indian number — "02425-225011" → "tel:+912425225011". */
export const telHref = (phone: string) => `tel:+91${phone.replace(/\D/g, "").replace(/^0/, "")}`;
