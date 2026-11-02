// Copy for the extended pages (services detail, operations, sustainability,
// partnerships, careers, insights). Core company copy stays in site.ts.
// Photography: Unsplash (https://unsplash.com/license) — free to use, no attribution required.

export type Photo = { src: string; alt: string };

const photo = (name: string, alt: string): Photo => ({ src: `/images/photos/${name}.jpg`, alt });

export const photos = {
  solarAerial: photo("solar-aerial", "Aerial view of rows of solar panels across green farmland"),
  solarSky: photo("solar-sky", "Long rows of solar modules under a wide blue sky"),
  solarArray: photo("solar-array", "Ground-mounted solar array on open grassland"),
  solarTop: photo("solar-panels-top", "Top-down view of solar panels set on grass"),
  solarRows: photo("solar-rows", "Close view of solar panel rows stretching to the horizon"),
  solarTechnician: photo("solar-technician", "Technician in work gloves fitting a solar module"),
  solarSunset: photo("solar-sunset", "Solar panels on a large industrial roof at sunset"),
  windSunset: photo("wind-sunset", "Wind turbines silhouetted against a golden sunset over fields"),
  windHills: photo("wind-hills", "Wind turbines along rolling green hills"),
  windHorizon: photo("wind-horizon", "A line of wind turbines standing on a calm horizon"),
  hybrid: photo("hybrid-wind-solar", "A wind turbine rising behind solar panels against a clear sky"),
  grid: photo("grid-transmission", "High-voltage transmission towers at sunrise"),
  sapling: photo("sapling-hands", "Cupped hands holding a young green plant"),
  fieldSunrise: photo("field-sunrise", "Sun rising over open agricultural land"),
  engineering: photo("engineering-drawings", "Engineer reviewing technical drawings at a desk"),
  team: photo("team-collaboration", "A team collaborating around laptops at a shared table"),
  partnership: photo("partnership", "Two colleagues celebrating an agreement with a high five"),
} as const;

export type ServiceSlug = "solar" | "wind" | "hybrid-bess";

export const serviceDetails: Record<
  ServiceSlug,
  {
    label: string;
    title: string;
    accent: string[];
    lead: string;
    hero: Photo;
    overviewTitle: string;
    overview: string[];
    overviewImage: Photo;
    capabilities: { title: string; text: string }[];
    gallery: [Photo, Photo];
    metaDescription: string;
  }
> = {
  solar: {
    label: "Solar Development & Operations",
    title: "Utility-Scale Solar, Built to Perform for Decades",
    accent: ["Perform", "Decades"],
    lead: "End-to-end solar project development and operations — building utility-scale infrastructure that delivers reliable performance across multiple regions.",
    hero: photos.solarAerial,
    overviewTitle: "From land to long-term generation.",
    overview: [
      "Solar is the backbone of India’s clean energy build-out, and the difference between a good project and a great one is decided long before the first module is installed. We bring decades of operating experience to every stage — site selection, resource assessment, grid connectivity and design — so that projects are engineered for the yield they will deliver over their full life.",
      "Once commissioned, our operations teams focus on what keeps solar assets earning: clean modules, healthy inverters, fast fault response and data-led performance tuning.",
    ],
    overviewImage: photos.solarTechnician,
    capabilities: [
      { title: "Site & resource assessment", text: "Irradiance studies, land evaluation and grid-connectivity analysis to identify sites with strong, bankable generation profiles." },
      { title: "Design & engineering", text: "Layout, module and inverter selection, and structural design optimised for yield, durability and lifetime cost." },
      { title: "Construction management", text: "Oversight of EPC execution with a focus on quality, safety, schedule and clean commissioning." },
      { title: "Operations & maintenance", text: "Preventive maintenance, module cleaning regimes, inverter care and continuous performance monitoring." },
    ],
    gallery: [photos.solarSky, photos.solarTop],
    metaDescription: "Utility-scale solar development, engineering, construction management and O&M by NEXEN POWER across India.",
  },
  wind: {
    label: "Wind Development & Operations",
    title: "Harnessing India’s Wind Corridors with Proven Expertise",
    accent: ["Wind", "Corridors"],
    lead: "Comprehensive wind energy solutions from development to operations — maximizing energy yield across India’s wind corridors with proven operational expertise.",
    hero: photos.windHills,
    overviewTitle: "Decades of turning wind into dependable power.",
    overview: [
      "Wind is where the Malpani Group’s renewable journey began. That long operating history gives us a practical understanding of how turbines behave across seasons, sites and grid conditions — and how to keep them generating.",
      "We apply that experience to new development: careful wind resource measurement, micro-siting for maximum yield, and operating strategies that protect availability over the asset’s full life.",
    ],
    overviewImage: photos.windSunset,
    capabilities: [
      { title: "Wind resource measurement", text: "Long-term data collection and analysis to understand the true energy potential of each site." },
      { title: "Micro-siting & layout", text: "Turbine placement that balances wake losses, terrain and access for the strongest lifetime yield." },
      { title: "Grid integration", text: "Evacuation planning and grid management drawn from years of operating multi-state wind assets." },
      { title: "Availability-focused O&M", text: "Scheduled maintenance, component health tracking and rapid response to keep turbines turning." },
    ],
    gallery: [photos.windHorizon, photos.grid],
    metaDescription: "Wind energy development, micro-siting, grid integration and operations by NEXEN POWER across India’s wind corridors.",
  },
  "hybrid-bess": {
    label: "Hybrid & BESS Solutions",
    title: "Round-the-Clock Clean Power with Hybrid & Storage",
    accent: ["Round-the-Clock", "Clean", "Power"],
    lead: "Integrated hybrid projects combining solar, wind, and battery storage — investing in next-generation BESS technology for enhanced grid stability and returns.",
    hero: photos.hybrid,
    overviewTitle: "When sun and wind work together — and storage fills the gaps.",
    overview: [
      "Solar peaks at midday; wind is often strongest in the evening, at night and during the monsoon. Combining them on shared land and grid infrastructure produces a smoother, more valuable generation profile than either can alone.",
      "Battery Energy Storage Systems (BESS) take this further — shifting energy to when it is needed most, supporting grid stability and opening new revenue streams. We are building the capabilities to deliver these integrated projects at scale.",
    ],
    overviewImage: photos.grid,
    capabilities: [
      { title: "Hybrid system design", text: "Sizing the right mix of solar and wind capacity to match demand profiles and grid requirements." },
      { title: "Battery energy storage", text: "Evaluating and integrating BESS to firm up supply, shift energy and support grid services." },
      { title: "Shared infrastructure", text: "Co-locating technologies on common land and evacuation assets to improve project economics." },
      { title: "Firm & dispatchable supply", text: "Structuring projects to meet the round-the-clock needs of utilities and corporate buyers." },
    ],
    gallery: [photos.solarSunset, photos.windHorizon],
    metaDescription: "Hybrid solar-wind projects and Battery Energy Storage Systems (BESS) for firm, round-the-clock renewable power from NEXEN POWER.",
  },
};

export const lifecycle = {
  label: "How we deliver",
  title: "One team across the full project lifecycle.",
  accent: ["full", "lifecycle."],
  steps: [
    { title: "Develop", text: "Land, resource assessment, permits and grid connectivity — the foundations of a bankable project." },
    { title: "Engineer", text: "Design and technology choices optimised for yield, reliability and lifetime cost." },
    { title: "Build", text: "Construction management focused on quality, safety and on-time commissioning." },
    { title: "Operate", text: "Long-term asset management that protects performance for decades." },
  ],
};

export const operations = {
  label: "Operations",
  title: "Operational Excellence Across Every Megawatt",
  accent: ["Every", "Megawatt"],
  lead: "Decades of running wind and solar assets across India have taught us that long-term value is earned in operations. Our teams keep a multi-state portfolio performing — day in, day out.",
  hero: photos.solarSky,
  introTitle: "Performance is a discipline, not a moment.",
  intro: [
    "Our operational portfolio reflects decades of experience in performance optimization, grid management, and long-term maintenance. That experience is the foundation of NEXEN POWER — and the advantage we bring to every new project and partnership.",
    "We treat each asset as a long-term commitment: monitored continuously, maintained proactively and improved over time.",
  ],
  introImage: photos.solarTechnician,
  capabilities: [
    { title: "Performance monitoring", text: "Continuous tracking of generation, availability and losses to catch issues early and benchmark every asset." },
    { title: "Preventive maintenance", text: "Planned maintenance schedules for modules, inverters, turbines and balance-of-plant to reduce unplanned downtime." },
    { title: "Grid management", text: "Coordination with grid operators, scheduling and compliance to keep power flowing reliably." },
    { title: "Performance optimization", text: "Data-led improvements — from cleaning cycles to component upgrades — that lift lifetime yield." },
    { title: "Safety & compliance", text: "Rigorous safety practices and regulatory compliance across every site we operate." },
    { title: "Asset lifecycle planning", text: "Long-horizon planning for repowering, upgrades and life extension of operating assets." },
  ],
  spotlight: {
    title: "Wind and solar, operated side by side.",
    text: "Operating both technologies across multiple states gives us a portfolio-level view of performance — and the practical know-how that our hybrid and storage ambitions are built on.",
    image: photos.windSunset,
  },
};

export const sustainability = {
  label: "Sustainability",
  title: "Clean Energy with Lasting, Responsible Impact",
  accent: ["Lasting,", "Responsible", "Impact"],
  lead: "Every megawatt we build and operate displaces fossil generation. We hold ourselves to the same long-term standard in how we treat land, communities and governance.",
  hero: photos.fieldSunrise,
  pillars: [
    {
      title: "Climate impact",
      text: "Renewable generation that helps India decarbonise its power sector and meet its clean energy commitments.",
      image: photos.solarArray,
    },
    {
      title: "Land stewardship",
      text: "Responsible site selection and land management that respects local ecology and long-term land value.",
      image: photos.solarTop,
    },
    {
      title: "Community partnership",
      text: "Working with the communities around our sites — through local employment, engagement and shared value.",
      image: photos.team,
    },
    {
      title: "Governance & integrity",
      text: "Transparent, accountable operations guided by an experienced board and independent oversight.",
      image: photos.engineering,
    },
  ],
  commitmentTitle: "Built for decades, not quarters.",
  commitment: [
    "Long-term thinking is one of our core values. Renewable infrastructure is designed to operate for decades, so the decisions we make today — about sites, technology, people and partners — shape impact for a generation.",
    "Our focus on hybrid projects and Battery Energy Storage Systems reflects that same view: the cleanest grid is one where renewable power is available whenever it is needed.",
  ],
  commitmentImage: photos.sapling,
};

export const partnerships = {
  label: "Partnerships",
  title: "Scaling India’s Clean Energy Through Partnership",
  accent: ["Clean", "Energy", "Partnership"],
  lead: "As an independent IPP, we build through collaboration. Our operational track record, land holdings, financial stability and industrial networks make NEXEN POWER a dependable partner for long-term renewable growth.",
  hero: photos.partnership,
  types: [
    {
      title: "Institutional investors",
      text: "Co-invest in a capital-efficient platform with operating assets, a development pipeline and decades of operational experience.",
    },
    {
      title: "Corporate & industrial buyers",
      text: "Secure clean, cost-competitive power for your operations through long-term power purchase arrangements.",
    },
    {
      title: "Land & project partners",
      text: "Bring land or early-stage projects to a team that can develop, build and operate them to their full potential.",
    },
    {
      title: "Technology & EPC partners",
      text: "Collaborate with us on solar, wind, hybrid and battery storage projects across India.",
    },
  ],
  strengthsTitle: "What we bring to the table.",
  strengths: [
    "A proven, multi-state operating portfolio",
    "Strategic land holdings and balance sheet strength",
    "End-to-end capabilities from development to operations",
    "The backing of the century-old Malpani Group",
    "The agility of an independent power producer",
  ],
  strengthsImage: photos.solarRows,
  process: [
    { title: "Connect", text: "Tell us about your goals — investment, power needs, land or technology." },
    { title: "Explore", text: "We assess fit together and shape an opportunity that works for both sides." },
    { title: "Structure", text: "Agree a clear, transparent partnership structure built for the long term." },
    { title: "Deliver", text: "Execute with discipline and operate for lasting, shared value." },
  ],
};

export const careers = {
  label: "Careers",
  title: "Build What India’s Energy Transition Needs",
  accent: ["Energy", "Transition"],
  lead: "Join a team that combines decades of renewable operating experience with the ambition and agility of a fast-growing independent power producer.",
  hero: photos.team,
  whyTitle: "Why NEXEN POWER.",
  why: [
    "We are at an early, defining stage of our growth — which means real ownership, visible impact and the chance to help build a multi-gigawatt platform.",
    "You will work alongside people who have operated renewable assets for years, on technologies that are shaping India’s grid: utility-scale solar, wind, hybrid projects and battery storage.",
  ],
  whyImage: photos.engineering,
  areas: [
    { title: "Project development", text: "Land, permits, resource assessment and grid connectivity." },
    { title: "Engineering & design", text: "Electrical, civil and systems engineering for solar, wind and BESS." },
    { title: "Construction & projects", text: "Project management, quality and safety on site." },
    { title: "Operations & maintenance", text: "Keeping our operating portfolio safe, available and performing." },
    { title: "Finance & partnerships", text: "Capital, investor relations, commercial and power sales." },
    { title: "Corporate functions", text: "Legal, HR, compliance, IT and administration." },
  ],
  applyTitle: "Interested in joining us?",
  applyText: "We’re always glad to hear from talented people. Send your CV and a short note about the role you’re interested in.",
};

export type Insight = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: Photo;
  readTime: string;
  body: { heading?: string; paragraphs: string[] }[];
};

export const insightsPage = {
  label: "Insights",
  title: "Understanding India’s Renewable Energy Transition",
  accent: ["Renewable", "Energy", "Transition"],
  lead: "Explainers on the technologies, business models and ideas shaping clean power in India.",
  hero: photos.windHorizon,
};

export const insights: Insight[] = [
  {
    slug: "what-is-an-independent-power-producer",
    category: "Business model",
    title: "What Is an Independent Power Producer (IPP)?",
    excerpt: "IPPs build, own and operate power plants and sell electricity to utilities and businesses. Here’s how the model works — and why it matters for renewables.",
    image: photos.solarAerial,
    readTime: "4 min read",
    body: [
      {
        paragraphs: [
          "An Independent Power Producer (IPP) is a company that develops, owns and operates power generation assets and sells the electricity it produces — typically to utilities, grid operators or large commercial and industrial consumers. Unlike a traditional vertically-integrated utility, an IPP does not own the transmission and distribution networks that deliver power to homes.",
        ],
      },
      {
        heading: "How an IPP creates value",
        paragraphs: [
          "An IPP’s value comes from the full lifecycle of its assets: finding good sites, engineering projects efficiently, building them well and, above all, operating them reliably for decades. Revenue usually comes from long-term power purchase agreements (PPAs), which give both the buyer and the producer visibility over price and volume.",
          "Because renewable plants have no fuel cost, operational excellence — high availability, low losses, fast fault response — translates directly into long-term returns.",
        ],
      },
      {
        heading: "Why IPPs matter for India’s energy transition",
        paragraphs: [
          "India has set an ambitious goal of 500 GW of non-fossil electricity capacity by 2030. Reaching it requires many capable developers and operators who can bring capital, expertise and speed. IPPs play a central role: they attract institutional investment, compete on cost and specialise in building and running renewable infrastructure at scale.",
        ],
      },
      {
        heading: "The NEXEN POWER approach",
        paragraphs: [
          "NEXEN POWER was formed to take decades of operational experience from the Malpani Group and scale it as an independent platform. Being independent gives us the agility to move faster and the flexibility to partner with institutional investors and corporate buyers.",
        ],
      },
    ],
  },
  {
    slug: "why-battery-storage-matters",
    category: "Technology",
    title: "Why Battery Energy Storage Matters for India’s Grid",
    excerpt: "As renewable capacity grows, storage becomes essential. A look at what BESS does, how it supports the grid and why it improves project economics.",
    image: photos.grid,
    readTime: "5 min read",
    body: [
      {
        paragraphs: [
          "Solar and wind are now among the most cost-effective sources of new electricity, but they generate when the sun shines and the wind blows — not necessarily when demand peaks. As their share of the grid rises, the ability to store energy and release it on demand becomes critical. That is the role of Battery Energy Storage Systems (BESS).",
        ],
      },
      {
        heading: "What a BESS does",
        paragraphs: [
          "A BESS stores electricity in batteries — today typically lithium-ion — and discharges it when needed. Paired with renewable plants, it can shift midday solar output into the evening peak, smooth short-term fluctuations and help meet scheduled supply commitments.",
        ],
      },
      {
        heading: "Supporting grid stability",
        paragraphs: [
          "Batteries respond in milliseconds, which makes them well suited to grid services such as frequency support and balancing. As India integrates ever more variable renewable power, these fast-responding resources help grid operators keep supply and demand in balance.",
        ],
      },
      {
        heading: "Better project economics",
        paragraphs: [
          "For producers, storage can turn variable generation into firmer, more valuable power — enabling round-the-clock or peak-supply contracts and reducing curtailment. Falling battery costs are steadily strengthening that case.",
          "This is why NEXEN POWER is investing in next-generation BESS capabilities alongside its solar, wind and hybrid portfolio.",
        ],
      },
    ],
  },
  {
    slug: "hybrid-renewable-projects-explained",
    category: "Projects",
    title: "Hybrid Renewable Projects, Explained",
    excerpt: "Combining solar and wind at one site makes for steadier generation and better use of land and grid. Here’s why hybrids are gaining ground.",
    image: photos.hybrid,
    readTime: "4 min read",
    body: [
      {
        paragraphs: [
          "A hybrid renewable project combines two or more generation technologies — most commonly solar and wind, often with battery storage — connected through shared infrastructure. The idea is simple: different resources peak at different times, so together they deliver a more consistent supply.",
        ],
      },
      {
        heading: "Complementary generation",
        paragraphs: [
          "In much of India, solar output is strongest around midday, while wind speeds frequently pick up in the evenings, overnight and during the monsoon months. Combining them flattens the generation curve and raises the utilisation of the grid connection.",
        ],
      },
      {
        heading: "Shared land and grid infrastructure",
        paragraphs: [
          "Co-locating technologies lets projects share land, substations and transmission lines. That improves capital efficiency and makes better use of scarce evacuation capacity.",
        ],
      },
      {
        heading: "The path to round-the-clock clean power",
        paragraphs: [
          "Add battery storage and a hybrid project can come close to delivering firm, round-the-clock renewable power — exactly what utilities and industrial consumers increasingly ask for. With experience operating both wind and solar, NEXEN POWER is building towards these integrated projects.",
        ],
      },
    ],
  },
  {
    slug: "operations-and-maintenance-in-renewables",
    category: "Operations",
    title: "Why Operations & Maintenance Decide Renewable Returns",
    excerpt: "Renewable plants run for decades with no fuel cost — so how well they are operated shapes their value. What good O&M looks like.",
    image: photos.solarTechnician,
    readTime: "4 min read",
    body: [
      {
        paragraphs: [
          "A solar or wind plant has no fuel bill. Once it is built, its value depends almost entirely on how much energy it produces over its life — and that depends on operations and maintenance (O&M).",
        ],
      },
      {
        heading: "Availability is everything",
        paragraphs: [
          "Every hour a turbine or inverter is down is generation that can never be recovered. Good O&M teams minimise downtime through preventive maintenance, spare-parts planning and fast response when faults occur.",
        ],
      },
      {
        heading: "Small gains, compounded",
        paragraphs: [
          "Module soiling, minor shading, inverter clipping and wake losses can each shave a little off output. Over decades and across a portfolio, steady data-led improvements in these areas add up to meaningful extra energy.",
        ],
      },
      {
        heading: "Experience as an advantage",
        paragraphs: [
          "Operating assets across multiple states and technologies builds a practical knowledge base that new entrants lack. It is the foundation NEXEN POWER brings to every new project and partnership.",
        ],
      },
    ],
  },
];

export const getInsight = (slug: string) => insights.find((a) => a.slug === slug);
