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
      "Fault-tolerant microservices built with automated circuit breaking, retry policies, and decoupled async event brokers to **isolate** failures and **guarantee** uptime.",
    techBadge: "CIRCUIT BREAKERS / RETRY",
  },
  {
    id: "02",
    tag: "LATENCY // SUB-MS RECONCILIATION",
    title: "Deterministic State Management",
    description:
      "Real-time data streams optimized for sub-millisecond local latency to **reconcile** state flawlessly across distributed nodes.",
    techBadge: "EVENT STREAMING / CQRS",
  },
  {
    id: "03",
    tag: "DEFENSE // ZERO-TRUST RBAC",
    title: "Security-First Architecture",
    description:
      "Multi-layered defense with zero-trust networking, strict RBAC, and end-to-end tokenized payload encryption to **lock down** the mesh.",
    techBadge: "JWT / ZERO-TRUST / OIDC",
  },
  {
    id: "04",
    tag: "OPTIMIZATION // MULTI-TIER CACHE",
    title: "Algorithmic Efficiency",
    description:
      "Database query profiling, connection pooling, and optimized multi-tier caching architectures to **accelerate** response times at scale.",
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

export type ArchNodeType =
  | "client"
  | "gateway"
  | "service"
  | "data"
  | "broker"
  | "external"
  | "governance";

export type ArchConnectionType =
  | "rest"
  | "event"
  | "ws"
  | "jdbc"
  | "auth"
  | "discovery";

export interface ArchNode {
  id: string;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  tier?: ArchNodeType;
  tierLabel?: string;
  category?: string;
  tech?: string;
  port?: string;
  description?: string;
}

export interface ArchConnection {
  from: string;
  to: string;
  label?: string;
  type?: ArchConnectionType;
  protocol?: string;
  description?: string;
  bidirectional?: boolean;
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
  image: string;
  url?: string;
}

// ─── Personal Info ───────────────────────────────────────────────────────────

export const personalInfo = {
  name: "Albin Reji",
  title: "Software Engineer",
  tagline:
    "I **architect** secure, scalable web applications and distributed systems using Java, Spring Boot, React, and modern cloud-native technologies.",
  location: "Udupi, Karnataka, India",
  email: "albinrejim30@gmail.com",
  phone: "+91-8123160330",
} as const;

// ─── Navigation ──────────────────────────────────────────────────────────────

export const navItems: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
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
    url: "https://leetcode.com/u/_albinreji_/",
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
  "Software Engineer with expertise in Java, Spring Boot, and React. A proven track record **shipping** secure REST APIs and microservices — built to **survive** production, not just pass a demo. Skilled in PostgreSQL optimization and integrating AI services to **scale** web applications. Focused on **delivering** high-performance, modular solutions with clean, maintainable code.";

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
      "A secure, containerized microservices platform built with Spring Boot and React, designed to **scale** service communication and **centralize** authentication.",
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
        {
          id: "client",
          label: "React Client UI",
          sublabel: "Vite / SockJS / STOMP",
          x: 400,
          y: 25,
          width: 200,
          height: 46,
          tier: "client",
          tierLabel: "Client Tier",
          category: "Frontend Application",
          tech: "React 18 + Vite + Tailwind",
          port: ":5173",
          description:
            "Single-page application featuring interactive UI, location discovery, real-time STOMP chat, and Keycloak authentication.",
        },
        {
          id: "keycloak",
          label: "Keycloak IAM",
          sublabel: "OAuth2 / OIDC / JWT",
          x: 90,
          y: 115,
          width: 200,
          height: 46,
          tier: "gateway",
          tierLabel: "Edge & Security",
          category: "Identity Provider",
          tech: "Keycloak 26.5 (Container)",
          port: ":8090",
          description:
            "Centralized OpenID Connect & OAuth2 identity provider managing user authentication, JWT token issuance, and security realms.",
        },
        {
          id: "gateway",
          label: "Spring Cloud Gateway",
          sublabel: "JWT Verification & Router",
          x: 395,
          y: 115,
          width: 210,
          height: 46,
          tier: "gateway",
          tierLabel: "Edge & Security",
          category: "API Gateway",
          tech: "Spring Cloud Gateway / WebFlux",
          port: ":8080",
          description:
            "Unified entry point reverse-proxying REST endpoints and WebSocket channels with Keycloak JWKS token verification.",
        },
        {
          id: "eureka",
          label: "Netflix Eureka Server",
          sublabel: "Service Registry & Discovery",
          x: 710,
          y: 115,
          width: 200,
          height: 46,
          tier: "governance",
          tierLabel: "Service Governance",
          category: "Service Discovery",
          tech: "Spring Cloud Netflix Eureka",
          port: ":8761",
          description:
            "Dynamic service registry tracking runtime health, IP addresses, and load-balancing instance lists for all backend microservices.",
        },
        {
          id: "user-service",
          label: "User Service",
          sublabel: "Keycloak Sync & Auth",
          x: 60,
          y: 230,
          width: 195,
          height: 46,
          tier: "service",
          tierLabel: "Microservices Mesh",
          category: "Microservice",
          tech: "Java 21 / Spring Boot 3",
          port: ":8081",
          description:
            "Manages user registration, role assignments, profile metadata, and Keycloak Admin user account synchronization.",
        },
        {
          id: "profile-service",
          label: "Profile Service",
          sublabel: "CA Profiles & Stages",
          x: 285,
          y: 230,
          width: 195,
          height: 46,
          tier: "service",
          tierLabel: "Microservices Mesh",
          category: "Microservice",
          tech: "Java 21 / Spring Boot 3",
          port: ":8083",
          description:
            "Handles Chartered Accountant extended profile info, exam qualification stages (Foundation/Inter/Final), and address data.",
        },
        {
          id: "location-service",
          label: "Location Service",
          sublabel: "Geo Radius & Nearest CA",
          x: 515,
          y: 230,
          width: 195,
          height: 46,
          tier: "service",
          tierLabel: "Microservices Mesh",
          category: "Microservice",
          tech: "Java 21 / Spring Boot 3",
          port: ":8082",
          description:
            "Computes distance algorithms, nearest-neighbor queries, and spatial searches for CA professionals in user vicinity.",
        },
        {
          id: "messaging-service",
          label: "Messaging Service",
          sublabel: "WebSocket / STOMP",
          x: 745,
          y: 230,
          width: 195,
          height: 46,
          tier: "service",
          tierLabel: "Microservices Mesh",
          category: "Microservice",
          tech: "Spring WebSocket / STOMP",
          port: ":8084",
          description:
            "Real-time peer-to-peer chat broker with JWT handshake authentication, connection tracking, and chat history persistence.",
        },
        {
          id: "postgres",
          label: "PostgreSQL 15 DB",
          sublabel: "Relational Multi-Schema",
          x: 230,
          y: 360,
          width: 220,
          height: 46,
          tier: "data",
          tierLabel: "Data Layer",
          category: "RDBMS",
          tech: "PostgreSQL 15 Alpine",
          port: ":5432",
          description:
            "Persistent relational database storing user accounts, profile stages, location indices, chat history, and Keycloak realm data.",
        },
        {
          id: "opencage",
          label: "OpenCage Geocoder API",
          sublabel: "External REST API",
          x: 580,
          y: 360,
          width: 220,
          height: 46,
          tier: "external",
          tierLabel: "External Integrations",
          category: "External Cloud API",
          tech: "External HTTPS Geocoding",
          description:
            "Third-party geocoding service providing forward/reverse coordinates lookup and address normalization via WebClient.",
        },
      ],
      connections: [
        {
          from: "client",
          to: "keycloak",
          type: "auth",
          protocol: "OAuth2 / OIDC",
          label: "Login / Token Issue",
          description: "Client authenticates via Keycloak Authorization Code flow with PKCE to obtain JWT.",
        },
        {
          from: "client",
          to: "gateway",
          type: "rest",
          protocol: "HTTPS / REST",
          label: "API Requests + JWT",
          description: "All API interactions pass through Gateway with Authorization Bearer token header.",
        },
        {
          from: "client",
          to: "gateway",
          type: "ws",
          protocol: "WSS / STOMP",
          label: "Real-time Chat",
          description: "Full-duplex WebSocket connection routed through Gateway to Messaging Service.",
        },
        {
          from: "gateway",
          to: "keycloak",
          type: "auth",
          protocol: "JWKS /certs",
          label: "Validate JWT Signature",
          description: "Spring Security OAuth2 Resource Server validates token signatures against Keycloak certificates.",
        },
        {
          from: "gateway",
          to: "eureka",
          type: "discovery",
          protocol: "Service Discovery",
          label: "Resolve Instances",
          description: "Gateway discovers service IPs and port mappings dynamically from Eureka registry.",
        },
        {
          from: "gateway",
          to: "user-service",
          type: "rest",
          protocol: "HTTP / REST",
          label: "/api/users/**",
          description: "Reverse proxies user registration and profile management endpoints.",
        },
        {
          from: "gateway",
          to: "profile-service",
          type: "rest",
          protocol: "HTTP / REST",
          label: "/api/profiles/**",
          description: "Reverse proxies CA qualification and exam status endpoints.",
        },
        {
          from: "gateway",
          to: "location-service",
          type: "rest",
          protocol: "HTTP / REST",
          label: "/api/locations/**",
          description: "Reverse proxies geospatial queries and nearby search requests.",
        },
        {
          from: "gateway",
          to: "messaging-service",
          type: "ws",
          protocol: "WSS / STOMP",
          label: "/ws/** & /api/messages/**",
          description: "Proxies STOMP protocol handshakes and chat history REST queries.",
        },
        {
          from: "user-service",
          to: "eureka",
          type: "discovery",
          protocol: "Eureka Client",
          label: "Heartbeat",
          description: "Regular heartbeat registration maintaining instance health in Eureka.",
        },
        {
          from: "profile-service",
          to: "eureka",
          type: "discovery",
          protocol: "Eureka Client",
          label: "Heartbeat",
          description: "Regular heartbeat registration maintaining instance health in Eureka.",
        },
        {
          from: "location-service",
          to: "eureka",
          type: "discovery",
          protocol: "Eureka Client",
          label: "Heartbeat",
          description: "Regular heartbeat registration maintaining instance health in Eureka.",
        },
        {
          from: "messaging-service",
          to: "eureka",
          type: "discovery",
          protocol: "Eureka Client",
          label: "Heartbeat",
          description: "Regular heartbeat registration maintaining instance health in Eureka.",
        },
        {
          from: "user-service",
          to: "keycloak",
          type: "rest",
          protocol: "Admin REST API",
          label: "Sync User Accounts",
          description: "User Service provisions and synchronizes registered accounts directly with Keycloak realm.",
        },
        {
          from: "user-service",
          to: "postgres",
          type: "jdbc",
          protocol: "JDBC / JPA",
          label: "Users & Roles Table",
          description: "Persists user account records, roles, and status flags.",
        },
        {
          from: "profile-service",
          to: "postgres",
          type: "jdbc",
          protocol: "JDBC / JPA",
          label: "Profiles & Exam Stages",
          description: "Persists CA qualifications, experience details, and address records.",
        },
        {
          from: "location-service",
          to: "postgres",
          type: "jdbc",
          protocol: "JDBC / JPA",
          label: "Geo Spatial Index",
          description: "Stores latitude, longitude, and locality metadata for distance queries.",
        },
        {
          from: "messaging-service",
          to: "postgres",
          type: "jdbc",
          protocol: "JDBC / JPA",
          label: "Chat Messages & Status",
          description: "Persists chat transcripts, sender/recipient IDs, and delivery states.",
        },
        {
          from: "keycloak",
          to: "postgres",
          type: "jdbc",
          protocol: "JDBC",
          label: "Keycloak DB",
          description: "Keycloak internal database storing realms, client scopes, and credential hashes.",
        },
        {
          from: "profile-service",
          to: "opencage",
          type: "rest",
          protocol: "HTTPS WebClient",
          label: "Forward Geocoding",
          description: "Converts user physical address into coordinates via OpenCage Geocoder API.",
        },
        {
          from: "location-service",
          to: "opencage",
          type: "rest",
          protocol: "HTTPS WebClient",
          label: "Radius & Distance",
          description: "Calculates spatial radius and reverse coordinates for nearby CA discovery.",
        },
      ],
    },
  },
  {
    name: "AI-Powered Fitness App",
    description:
      "An AI-powered fitness platform that **generates** personalized workout plans using Gemini AI and **orchestrates** event-driven microservices for high-volume activity logging.",
    highlights: [
      "Replaced generic workout content with AI-generated personalized plans using Gemini API.",
      "Unified backend services through Spring Cloud Gateway with reactive Keycloak user synchronization.",
      "Adopted RabbitMQ for asynchronous event-driven AI workout recommendations.",
      "Used Spring Cloud Config for centralized multi-environment configuration management.",
      "Designed polyglot persistence utilizing PostgreSQL for users and MongoDB for high-volume activity & AI logs.",
    ],
    techStack: [
      "Spring Boot",
      "React",
      "Gemini AI",
      "PostgreSQL",
      "MongoDB",
      "RabbitMQ",
      "Spring Cloud Gateway",
    ],
    architecture: {
      nodes: [
        {
          id: "react-client",
          label: "React Client SPA",
          sublabel: "Redux / Vite",
          x: 400,
          y: 25,
          width: 200,
          height: 46,
          tier: "client",
          tierLabel: "Client Tier",
          category: "Frontend Application",
          tech: "React 18 + Redux Toolkit + Vite",
          port: ":5173",
          description:
            "Client interface for workout logging, personalized recommendations feed, and Keycloak session management.",
        },
        {
          id: "keycloak",
          label: "Keycloak IAM",
          sublabel: "OAuth2 / OIDC :8090",
          x: 60,
          y: 115,
          width: 190,
          height: 46,
          tier: "gateway",
          tierLabel: "Edge & Security",
          category: "Identity Provider",
          tech: "Keycloak (fitness-oauth2 realm)",
          port: ":8090",
          description:
            "Manages identity tokens, OAuth2 authorization, and OIDC user credentials for the fitness platform.",
        },
        {
          id: "gateway",
          label: "Spring Cloud Gateway",
          sublabel: "Keycloak Sync Filter :8080",
          x: 285,
          y: 115,
          width: 215,
          height: 46,
          tier: "gateway",
          tierLabel: "Edge & Security",
          category: "API Gateway",
          tech: "Spring Cloud Gateway / WebFlux",
          port: ":8080",
          description:
            "Central gateway featuring KeyCloakUserSyncFilter to extract JWT claims, sync users via WebClient, and route traffic.",
        },
        {
          id: "config-server",
          label: "Spring Cloud Config",
          sublabel: "Centralized Config :8888",
          x: 530,
          y: 115,
          width: 200,
          height: 46,
          tier: "governance",
          tierLabel: "Governance & Config",
          category: "Config Server",
          tech: "Spring Cloud Config Server",
          port: ":8888",
          description:
            "Hosts centralized configuration files (gateway.yml, user-service.yml, activity-service.yml, ai-service.yml).",
        },
        {
          id: "eureka",
          label: "Eureka Server",
          sublabel: "Discovery Registry :8761",
          x: 760,
          y: 115,
          width: 185,
          height: 46,
          tier: "governance",
          tierLabel: "Governance & Config",
          category: "Service Discovery",
          tech: "Netflix Eureka",
          port: ":8761",
          description:
            "Dynamic service registry enabling microservice discovery and client-side load balancing via Spring Cloud.",
        },
        {
          id: "user-service",
          label: "User Service",
          sublabel: "User Profiles :8081",
          x: 90,
          y: 230,
          width: 195,
          height: 46,
          tier: "service",
          tierLabel: "Microservices Mesh",
          category: "Microservice",
          tech: "Java 21 / Spring Boot 3",
          port: ":8081",
          description:
            "Maintains user records and provides the /api/users/{userId}/validate endpoint for inter-service validation.",
        },
        {
          id: "activity-service",
          label: "Activity Service",
          sublabel: "Workout Tracker :8082",
          x: 400,
          y: 230,
          width: 200,
          height: 46,
          tier: "service",
          tierLabel: "Microservices Mesh",
          category: "Microservice",
          tech: "Java 21 / Spring Boot 3",
          port: ":8082",
          description:
            "Tracks activities and calories, verifies users synchronously via WebClient, and publishes events to RabbitMQ.",
        },
        {
          id: "ai-service",
          label: "AI Recommendation Service",
          sublabel: "Gemini Integration :8083",
          x: 715,
          y: 230,
          width: 225,
          height: 46,
          tier: "service",
          tierLabel: "Microservices Mesh",
          category: "Microservice",
          tech: "Java 21 / Spring Boot 3",
          port: ":8083",
          description:
            "Consumes activity messages via RabbitListener, queries Google Gemini API, and saves customized recommendations.",
        },
        {
          id: "postgres",
          label: "PostgreSQL DB",
          sublabel: "fitness_user_db :5432",
          x: 90,
          y: 360,
          width: 195,
          height: 46,
          tier: "data",
          tierLabel: "Data Layer",
          category: "RDBMS",
          tech: "PostgreSQL 15",
          port: ":5432",
          description:
            "Relational database persisting relational user accounts and credential metadata via Spring Data JPA.",
        },
        {
          id: "rabbitmq",
          label: "RabbitMQ Broker",
          sublabel: "fitness.exchange :5672",
          x: 400,
          y: 360,
          width: 200,
          height: 46,
          tier: "broker",
          tierLabel: "Messaging Layer",
          category: "Message Broker",
          tech: "RabbitMQ AMQP 0-9-1",
          port: ":5672",
          description:
            "Asynchronous message broker routing activity.tracking events to activity.queue for decoupled AI processing.",
        },
        {
          id: "mongodb",
          label: "MongoDB Cluster",
          sublabel: "Activity & AI DB :27017",
          x: 715,
          y: 360,
          width: 225,
          height: 46,
          tier: "data",
          tierLabel: "Data Layer",
          category: "NoSQL Document Store",
          tech: "MongoDB 7.x",
          port: ":27017",
          description:
            "Document database storing unstructured workout logs (fitness_activity_db) and AI recommendations (fitness_recommendation_db).",
        },
        {
          id: "gemini",
          label: "Google Gemini AI API",
          sublabel: "Generative LLM Engine",
          x: 715,
          y: 450,
          width: 225,
          height: 46,
          tier: "external",
          tierLabel: "External Integrations",
          category: "External Cloud AI",
          tech: "Google Gemini REST API",
          description:
            "Cloud generative AI model producing tailored nutritional suggestions, workout plans, and health tips.",
        },
      ],
      connections: [
        {
          from: "react-client",
          to: "keycloak",
          type: "auth",
          protocol: "OAuth2 / OIDC",
          label: "Login & Token Issue",
          description: "React client authenticates with Keycloak to obtain JSON Web Tokens.",
        },
        {
          from: "react-client",
          to: "gateway",
          type: "rest",
          protocol: "HTTPS / REST",
          label: "API Requests + Bearer JWT",
          description: "HTTP REST calls sent with Bearer JWT tokens in the Authorization header.",
        },
        {
          from: "gateway",
          to: "keycloak",
          type: "auth",
          protocol: "JWKS /certs",
          label: "Validate JWT Signature",
          description: "Validates incoming tokens with Keycloak's public keys via Spring Security OAuth2.",
        },
        {
          from: "gateway",
          to: "config-server",
          type: "discovery",
          protocol: "Config Import",
          label: "Pull Gateway Routes",
          description: "Fetches dynamic routing rules and security parameters from central Config Server.",
        },
        {
          from: "gateway",
          to: "eureka",
          type: "discovery",
          protocol: "Route Resolution",
          label: "Discover Service IPs",
          description: "Resolves microservice instances through Eureka client registry.",
        },
        {
          from: "gateway",
          to: "user-service",
          type: "rest",
          protocol: "WebClient Sync",
          label: "Keycloak User Sync",
          description: "KeyCloakUserSyncFilter validates/registers new users synchronously via WebClient and injects X-User-ID header.",
        },
        {
          from: "gateway",
          to: "activity-service",
          type: "rest",
          protocol: "HTTP / REST",
          label: "/api/activities/**",
          description: "Reverse proxies workout logging and activity retrieval endpoints.",
        },
        {
          from: "gateway",
          to: "ai-service",
          type: "rest",
          protocol: "HTTP / REST",
          label: "/api/recommendation/**",
          description: "Reverse proxies AI plan queries and fitness insights endpoints.",
        },
        {
          from: "user-service",
          to: "config-server",
          type: "discovery",
          protocol: "Spring Cloud Config",
          label: "Fetch Config",
          description: "Loads datasource credentials and port settings from user-service.yml.",
        },
        {
          from: "activity-service",
          to: "config-server",
          type: "discovery",
          protocol: "Spring Cloud Config",
          label: "Fetch Config",
          description: "Loads MongoDB URI and RabbitMQ exchange parameters from activity-service.yml.",
        },
        {
          from: "ai-service",
          to: "config-server",
          type: "discovery",
          protocol: "Spring Cloud Config",
          label: "Fetch Config",
          description: "Loads Gemini API endpoints and queue bindings from ai-service.yml.",
        },
        {
          from: "user-service",
          to: "eureka",
          type: "discovery",
          protocol: "Eureka Client",
          label: "Heartbeat",
          description: "Registers user-service instance with Eureka registry.",
        },
        {
          from: "activity-service",
          to: "eureka",
          type: "discovery",
          protocol: "Eureka Client",
          label: "Heartbeat",
          description: "Registers activity-service instance with Eureka registry.",
        },
        {
          from: "ai-service",
          to: "eureka",
          type: "discovery",
          protocol: "Eureka Client",
          label: "Heartbeat",
          description: "Registers ai-service instance with Eureka registry.",
        },
        {
          from: "activity-service",
          to: "user-service",
          type: "rest",
          protocol: "WebClient GET",
          label: "Validate User Exists",
          description: "Calls /api/users/{userId}/validate synchronously before accepting activity logs.",
        },
        {
          from: "user-service",
          to: "postgres",
          type: "jdbc",
          protocol: "JDBC / JPA",
          label: "fitness_user_db",
          description: "Persists user entities, hashed credentials, and role assignments in PostgreSQL.",
        },
        {
          from: "activity-service",
          to: "mongodb",
          type: "jdbc",
          protocol: "Spring Data MongoDB",
          label: "fitness_activity_db",
          description: "Saves high-frequency workout documents and metrics in MongoDB.",
        },
        {
          from: "activity-service",
          to: "rabbitmq",
          type: "event",
          protocol: "AMQP 0-9-1 Pub",
          label: "activity.tracking",
          description: "Publishes activity events to fitness.exchange using RabbitTemplate.",
        },
        {
          from: "rabbitmq",
          to: "ai-service",
          type: "event",
          protocol: "RabbitListener Sub",
          label: "activity.queue",
          description: "Asynchronously dequeues activity events for automated AI processing.",
        },
        {
          from: "ai-service",
          to: "gemini",
          type: "rest",
          protocol: "HTTPS WebClient",
          label: "Generate Workout Plan",
          description: "Sends workout prompt payload to Google Gemini API to produce personalized recommendations.",
        },
        {
          from: "ai-service",
          to: "mongodb",
          type: "jdbc",
          protocol: "Spring Data MongoDB",
          label: "fitness_recommendation_db",
          description: "Persists AI-generated personalized workout plans and fitness insights.",
        },
      ],
    },
  },
];

// ─── Certifications ──────────────────────────────────────────────────────────
// Add new certifications here. The component will auto-adapt.
// Each entry needs: name, provider, image, and optionally url.
// ─────────────────────────────────────────────────────────────────────────────

export const certifications: Certification[] = [
  {
    name: "Java Spring Framework 6 with Spring Boot 3",
    provider: "Udemy",
    image: "/certificate-assets/sprinboot_certificate.jpg",
    url: "https://ude.my/UC-fe840c60-03d7-482a-a052-569829261c50",
  },
  {
    name: "100 Days of Code: Python Bootcamp",
    provider: "Udemy",
    image: "/certificate-assets/python-bootcamp.jpg",
    url: "https://ude.my/UC-4455a1ca-89b6-447d-8229-7371c40d01b8",
  },
  {
    name: "The Complete Machine Learning Course with Python",
    provider: "Udemy",
    image: "/certificate-assets/Machine_Learning_udemy.jpg",
    url: "https://www.udemy.com/certificate/UC-b7d58726-c1ec-4b1e-be09-be981490dd78/",
  },
];

// ─── Engineering Notes / Tech Dispatches (X Posts) ───────────────────────────
// Add new engineering notes here. The carousel and component will auto-adapt.
// Each entry needs: id, category, title, description, date, image, url.
// ─────────────────────────────────────────────────────────────────────────────

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
  | "LEARNING"
  | "SECURITY";
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
    title: "One Pattern. Many Names — Reverse Proxy Explained",
    description:
      "CDN, Load Balancer, API Gateway — different infrastructure, same reverse-proxy idea. A single entry point that hides backend topology from the client.",
    date: "19 AUG 2026",
    image: "/twitter-assets/reverse_proxy.png",
    url: "https://x.com/_AlbinReji_/status/2092902053529985150",
  },
  {
    id: "post-2",
    category: "SECURITY",
    title: "Spring Security Authentication Flow — End to End",
    description:
      "How SecurityFilterChain, AuthenticationManager, ProviderManager, and SecurityContext work together to authenticate a request from login to thread-local storage.",
    date: "16 AUG 2026",
    image: "/twitter-assets/spring_security.png",
    url: "https://x.com/_AlbinReji_/status/2091880684570150351",
  },
  {
    id: "post-3",
    category: "BACKEND",
    title: "Optimistic Locking — Solving Race Conditions at Write Time",
    description:
      "Both transactions read the same version, but only one can safely write. Understanding the race condition problem before any locking strategy kicks in.",
    date: "13 AUG 2026",
    image: "/twitter-assets/optimistic_locking.png",
    url: "https://x.com/_AlbinReji_/status/2090080208464527612",
  },
  {
    id: "post-4",
    category: "ARCHITECTURE",
    title: "What is Keycloak? — Identity & Access Management Explained",
    description:
      "Centralized authentication, RBAC, SSO, and standard protocols (OIDC, OAuth2, SAML). How Keycloak architecture connects clients, microservices, and user federation.",
    date: "12 AUG 2026",
    image: "/twitter-assets/keycloak.png",
    url: "https://x.com/_AlbinReji_/status/2089717880560742711",
  },
];

// ─── Contact ─────────────────────────────────────────────────────────────────

export const contactHeading = "Let\u2019s build something useful.";
export const contactSubtext =
  "I\u2019m open to software engineering opportunities, technical collaborations, and interesting projects.";

