// ─── Types ───────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: "github" | "linkedin" | "leetcode" | "mail" | "x";
}

export interface ArchitecturalPillar {
  id: string;
  tag: string;
  title: string;
  description: string;
  techBadge: string;
}

export const architecturalPillars: ArchitecturalPillar[] = [
  {
    id: "01",
    tag: "RESILIENCE // FAULT ISOLATION",
    title: "Zero-Downtime Resilience",
    description:
      "Fault-tolerant microservices built with automated circuit breaking, retry policies, and decoupled async event brokers.",
    techBadge: "CIRCUIT BREAKERS / RETRY",
  },
  {
    id: "02",
    tag: "LATENCY // SUB-MS RECONCILIATION",
    title: "Deterministic State Management",
    description:
      "Real-time data streams optimized for sub-millisecond local latency with reliable event reconciliation.",
    techBadge: "EVENT STREAMING / CQRS",
  },
  {
    id: "03",
    tag: "DEFENSE // ZERO-TRUST RBAC",
    title: "Security-First Architecture",
    description:
      "Multi-layered defense with zero-trust networking, strict RBAC, and end-to-end tokenized payload encryption.",
    techBadge: "JWT / ZERO-TRUST / OIDC",
  },
  {
    id: "04",
    tag: "OPTIMIZATION // MULTI-TIER CACHE",
    title: "Algorithmic Efficiency",
    description:
      "Database query profiling, connection pooling, and optimized multi-tier caching architectures.",
    techBadge: "INDEX TUNING / POOLING",
  },
];

export interface EducationEntry {
  institution: string;
  degree: string;
  duration: string;
  cgpa: string;
  location: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ExperienceEntry {
  role: string;
  company: string;
  location?: string;
  duration: string;
  project?: string;
  responsibilities: string[];
  techTags: string[];
}

export interface ArchNode {
  id: string;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface ArchConnection {
  from: string;
  to: string;
}

export interface Project {
  name: string;
  description: string;
  highlights: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  architecture: {
    nodes: ArchNode[];
    connections: ArchConnection[];
  };
}

export interface Certification {
  name: string;
  provider: string;
  url?: string;
}

// ─── Personal Info ───────────────────────────────────────────────────────────

export const personalInfo = {
  name: "Albin Reji",
  title: "Full Stack Developer",
  tagline:
    "I build secure, scalable web applications and distributed systems using Java, Spring Boot, React, and modern cloud-native technologies.",
  location: "Udupi, Karnataka, India",
  email: "albinrejim30@gmail.com",
  phone: "+91-8123160330",
} as const;

// ─── Navigation ──────────────────────────────────────────────────────────────

export const navItems: NavItem[] = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Notes", href: "#notes" },
  { label: "Contact", href: "#contact" },
];

// ─── Social Links ────────────────────────────────────────────────────────────

export const socialLinks: SocialLink[] = [
  {
    platform: "GitHub",
    url: "https://github.com/Albin-Reji",
    icon: "github",
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/albin--reji",
    icon: "linkedin",
  },
  {
    platform: "X (Twitter)",
    url: "https://x.com/_AlbinReji_",
    icon: "x",
  },
  {
    platform: "LeetCode",
    url: "https://leetcode.com/u/albinrejim30",
    icon: "leetcode",
  },
  {
    platform: "Email",
    url: "mailto:albinrejim30@gmail.com",
    icon: "mail",
  },
];

// ─── About ───────────────────────────────────────────────────────────────────

export const aboutText =
  "Full Stack Developer with expertise in Java, Spring Boot, and React. Proven track record in building secure REST APIs and microservices using Spring Security and JWT. Skilled in PostgreSQL optimization and integrating AI services for scalable web applications. Focused on delivering high-performance, modular solutions with clean, maintainable code.";

export const coreTechnologies = [
  "Java",
  "Spring Boot",
  "React",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "Microservices",
  "REST APIs",
];

// ─── Education ───────────────────────────────────────────────────────────────

export const education: EducationEntry = {
  institution: "Mangalore Institute of Technology & Engineering",
  degree: "Bachelor of Engineering in Computer Science & Engineering",
  duration: "Nov 2021 – May 2025",
  cgpa: "8.5 / 10",
  location: "Mangalore, India",
};

// ─── Skills ──────────────────────────────────────────────────────────────────

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    items: ["Java", "Python", "JavaScript", "SQL"],
  },
  {
    category: "Frameworks",
    items: ["Spring Boot", "Spring Security", "Hibernate", "React.js"],
  },
  {
    category: "Architecture & Protocols",
    items: [
      "Microservices",
      "RESTful APIs",
      "WebSocket",
      "JWT Authentication",
      "MVC",
    ],
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "MySQL", "MongoDB"],
  },
  {
    category: "DevOps & Tools",
    items: [
      "Docker",
      "Git",
      "GitHub",
      "Jenkins",
      "Linux",
      "Maven",
      "Postman",
      "Kubernetes",
      "RabbitMQ",
    ],
  },
  {
    category: "Core Concepts",
    items: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "Software Development Life Cycle",
    ],
  },
];

// ─── Experience ──────────────────────────────────────────────────────────────

export const experiences: ExperienceEntry[] = [
  {
    role: "Software Developer Intern",
    company: "Udupi Web Solutions",
    location: "Udupi, India",
    duration: "Feb 2025 – May 2025",
    responsibilities: [
      "Engineered a full-stack AI chat platform using Spring Boot and ReactJS, utilizing Maven for build automation within a scalable Microservices architecture.",
      "Integrated AI-powered APIs to enhance conversational accuracy and built optimized REST endpoints for seamless real-time messaging.",
      "Implemented a hybrid data storage strategy using PostgreSQL for relational user data and MongoDB for unstructured chat logs, managed via Git version control.",
    ],
    techTags: [
      "Spring Boot",
      "ReactJS",
      "Microservices",
      "REST",
      "PostgreSQL",
      "MongoDB",
      "AI APIs",
      "Maven",
      "Git",
    ],
  },
  {
    role: "Data Science Intern",
    company: "Saara IT Solutions Pvt Ltd",
    duration: "Oct 2023 – Nov 2023",
    project: "Heart Attack Disease Prediction",
    responsibilities: [
      "Developed a Machine Learning model in Python, achieving 96% accuracy using Scikit-learn and Pandas with advanced data preprocessing.",
      "Analyzed and visualized complex healthcare data to communicate insights to clinical stakeholders, enabling data-driven decision-making.",
      "Implemented an end-to-end ML pipeline with feature engineering, model validation, and performance optimization to enhance operational efficiency.",
    ],
    techTags: [
      "Python",
      "Scikit-learn",
      "Pandas",
      "Machine Learning",
      "Data Analysis",
      "Data Visualization",
    ],
  },
];

// ─── Projects ────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    name: "CA Connecting Platform",
    description:
      "A secure, containerized microservices platform built with Spring Boot and React, designed for scalable service communication and centralized authentication.",
    highlights: [
      "Built a microservices platform with Spring Boot and API Gateway, reducing inter-service coupling and improving scalability and maintainability.",
      "Integrated Keycloak using OAuth2/OIDC to provide centralized authentication and authorization across services.",
      "Containerized services with Docker and created Kubernetes configurations for consistent deployment and cloud scalability.",
    ],
    techStack: [
      "Spring Boot",
      "React",
      "Docker",
      "Kubernetes",
      "Keycloak",
      "PostgreSQL",
    ],
    architecture: {
      nodes: [
        { id: "client", label: "Client", x: 250, y: 35 },
        { id: "gateway", label: "API Gateway", x: 250, y: 110 },
        { id: "user-svc", label: "User Service", x: 130, y: 195 },
        { id: "other-svc", label: "Other Services", x: 370, y: 195 },
        { id: "postgres", label: "PostgreSQL", x: 250, y: 280 },
        {
          id: "keycloak",
          label: "Keycloak",
          sublabel: "OAuth2 / OIDC",
          x: 470,
          y: 110,
        },
      ],
      connections: [
        { from: "client", to: "gateway" },
        { from: "gateway", to: "user-svc" },
        { from: "gateway", to: "other-svc" },
        { from: "user-svc", to: "postgres" },
        { from: "other-svc", to: "postgres" },
        { from: "keycloak", to: "gateway" },
      ],
    },
  },
  {
    name: "AI-Powered Fitness App",
    description:
      "An AI-powered fitness platform that generates personalized workout plans using Gemini AI and uses event-driven microservices for scalable backend communication.",
    highlights: [
      "Replaced generic workout content with AI-generated personalized plans using Gemini API.",
      "Unified backend services through Spring Cloud Gateway.",
      "Adopted RabbitMQ for asynchronous event-driven communication.",
      "Used Spring Cloud Config for centralized configuration management.",
      "Designed services to remain decoupled and consistent across environments.",
    ],
    techStack: [
      "Spring Boot",
      "React",
      "Gemini AI",
      "PostgreSQL",
      "RabbitMQ",
      "Spring Cloud Gateway",
    ],
    architecture: {
      nodes: [
        { id: "react", label: "React Client", x: 250, y: 35 },
        { id: "gateway", label: "Spring Cloud Gateway", x: 250, y: 110 },
        { id: "user-svc", label: "User Service", x: 90, y: 195 },
        { id: "fitness", label: "Fitness API", x: 250, y: 195 },
        { id: "ai-svc", label: "AI Service", x: 410, y: 195 },
        { id: "postgres", label: "PostgreSQL", x: 90, y: 280 },
        { id: "gemini", label: "Gemini AI", x: 410, y: 280 },
        { id: "rabbitmq", label: "RabbitMQ", x: 250, y: 335 },
      ],
      connections: [
        { from: "react", to: "gateway" },
        { from: "gateway", to: "user-svc" },
        { from: "gateway", to: "fitness" },
        { from: "gateway", to: "ai-svc" },
        { from: "user-svc", to: "postgres" },
        { from: "ai-svc", to: "gemini" },
        { from: "user-svc", to: "rabbitmq" },
        { from: "fitness", to: "rabbitmq" },
        { from: "ai-svc", to: "rabbitmq" },
      ],
    },
  },
];

// ─── Certifications ──────────────────────────────────────────────────────────

export const certifications: Certification[] = [
  {
    name: "Java Spring Framework 6 with Spring Boot 3",
    provider: "Udemy",
  },
  {
    name: "100 Days of Code: Python Bootcamp",
    provider: "Udemy",
  },
];

// ─── Engineering Notes / Tech Dispatches (X Posts) ───────────────────────────

export interface EngineeringPost {
  id: string;
  category:
    | "SYSTEM DESIGN"
    | "AI"
    | "BACKEND"
    | "DEVOPS"
    | "WEB PERFORMANCE"
    | "ARCHITECTURE"
    | "OPEN SOURCE"
    | "LEARNING";
  title: string;
  description: string;
  date: string;
  image: string;
  url: string;
}

export const engineeringNotes: EngineeringPost[] = [
  {
    id: "post-1",
    category: "SYSTEM DESIGN",
    title: "Why I started designing backend systems around events",
    description:
      "A few lessons I learned while moving from request-driven logic to decoupled event-driven architecture with RabbitMQ and outbox patterns.",
    date: "23 AUG 2026",
    image: "/notes-event-arch.jpg",
    url: "https://x.com/_AlbinReji_",
  },
  {
    id: "post-2",
    category: "AI",
    title: "Building low-latency LLM streaming pipelines with Spring Boot & Gemini",
    description:
      "How we optimized memory-efficient reactive token streaming and WebSocket channels for sub-50ms conversational response times.",
    date: "19 AUG 2026",
    image: "/project-02.jpg",
    url: "https://x.com/_AlbinReji_",
  },
  {
    id: "post-3",
    category: "BACKEND",
    title: "PostgreSQL query profiling: Fixing a 1.2s bottleneck down to 4ms",
    description:
      "Deconstructing EXPLAIN ANALYZE traces, index selection tradeoffs, and connection pool starvation with HikariCP.",
    date: "14 AUG 2026",
    image: "/about-code.jpg",
    url: "https://x.com/_AlbinReji_",
  },
  {
    id: "post-4",
    category: "ARCHITECTURE",
    title: "Zero-Trust microservices security with Keycloak & JWT authorization",
    description:
      "Enforcing fine-grained RBAC tokens, stateless gateway verification, and secure service-to-service communication.",
    date: "08 AUG 2026",
    image: "/about-arch.jpg",
    url: "https://x.com/_AlbinReji_",
  },
  {
    id: "post-5",
    category: "WEB PERFORMANCE",
    title: "React 19 Server Actions & Optimistic UI: What actually speeds up apps",
    description:
      "Measuring DOM mutation overhead, state hydration cost, and real user interaction latency on high-throughput interfaces.",
    date: "01 AUG 2026",
    image: "/about-code.jpg",
    url: "https://x.com/_AlbinReji_",
  },
  {
    id: "post-6",
    category: "DEVOPS",
    title: "Containerizing Spring Boot 3 with GraalVM native images on Kubernetes",
    description:
      "Cutting memory footprint by 65% and achieving instant cold starts for auto-scaling cluster pods.",
    date: "26 JUL 2026",
    image: "/project-01.jpg",
    url: "https://x.com/_AlbinReji_",
  },
  {
    id: "post-7",
    category: "OPEN SOURCE",
    title: "Writing a lightweight Redis caching interceptor for Spring Data",
    description:
      "A small open-source utility for multi-tier cache invalidation with zero configuration overhead.",
    date: "18 JUL 2026",
    image: "/notes-event-arch.jpg",
    url: "https://x.com/_AlbinReji_",
  },
  {
    id: "post-8",
    category: "LEARNING",
    title: "Mental models for distributed state reconciliation and consensus",
    description:
      "Practical insights on eventual consistency, vector clocks, and idempotency guarantees in distributed nodes.",
    date: "11 JUL 2026",
    image: "/about-arch.jpg",
    url: "https://x.com/_AlbinReji_",
  },
];

// ─── Contact ─────────────────────────────────────────────────────────────────

export const contactHeading = "Let\u2019s build something useful.";
export const contactSubtext =
  "I\u2019m open to software engineering opportunities, technical collaborations, and interesting projects.";

