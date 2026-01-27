import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, ThemeProvider, keyframes } from 'styled-components';

// ==================== GLOBAL STYLES ====================
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Space+Mono:wght@400;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Space Mono', monospace;
    background: ${props => props.theme.bg};
    color: ${props => props.theme.text};
    overflow-x: hidden;
    transition: all 0.3s ease;
  }

  ::selection {
    background: ${props => props.theme.accent};
    color: ${props => props.theme.bg};
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.bgAlt};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.accent};
    border-radius: 4px;
  }
`;

// ==================== THEMES ====================
const themes = {
  dark: {
    bg: '#0a0e27',
    bgAlt: '#151a35',
    card: '#1a1f3a',
    text: '#e0e6ff',
    textAlt: '#8892b0',
    accent: '#00ffcc',
    accentAlt: '#7c3aed',
    border: '#2d3561',
  },
  light: {
    bg: '#f8fafc',
    bgAlt: '#e2e8f0',
    card: '#ffffff',
    text: '#0f172a',
    textAlt: '#475569',
    accent: '#6366f1',
    accentAlt: '#ec4899',
    border: '#cbd5e1',
  }
};

// ==================== ANIMATIONS ====================
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px ${props => props.theme?.accent || '#00ffcc'}; }
  50% { box-shadow: 0 0 40px ${props => props.theme?.accent || '#00ffcc'}, 0 0 60px ${props => props.theme?.accent || '#00ffcc'}; }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// ==================== STYLED COMPONENTS ====================
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Navbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background: ${props => props.theme.card}ee;
  border-bottom: 1px solid ${props => props.theme.border};
  padding: 20px 0;
  transition: all 0.3s ease;

  ${Container} {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const Logo = styled.div`
  font-family: 'Orbitron', sans-serif;
  font-size: 24px;
  font-weight: 900;
  background: linear-gradient(135deg, ${props => props.theme.accent}, ${props => props.theme.accentAlt});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: ${props => props.theme.textAlt};
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.accent};
    transform: translateY(-2px);
  }
`;

const ThemeToggle = styled.button`
  background: ${props => props.theme.card};
  border: 2px solid ${props => props.theme.accent};
  color: ${props => props.theme.accent};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: rotate(180deg);
    box-shadow: 0 0 20px ${props => props.theme.accent};
  }
`;

const Hero = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 100px 0 50px;

  &::before {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: ${props => props.theme.accent};
    border-radius: 50%;
    filter: blur(150px);
    opacity: 0.1;
    top: -200px;
    right: -200px;
    animation: ${float} 6s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: ${props => props.theme.accentAlt};
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.1;
    bottom: -150px;
    left: -150px;
    animation: ${float} 8s ease-in-out infinite;
  }
`;

const HeroContent = styled.div`
  text-align: center;
  z-index: 1;
  animation: ${fadeInUp} 1s ease;
`;

const HeroTitle = styled.h1`
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(48px, 8vw, 96px);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, ${props => props.theme.text}, ${props => props.theme.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
`;

const HeroSubtitle = styled.h2`
  font-size: clamp(20px, 3vw, 32px);
  color: ${props => props.theme.accent};
  margin-bottom: 30px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const HeroDescription = styled.p`
  font-size: 18px;
  color: ${props => props.theme.textAlt};
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.8;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.a`
  padding: 15px 35px;
  background: ${props => props.primary ? `linear-gradient(135deg, ${props.theme.accent}, ${props.theme.accentAlt})` : 'transparent'};
  border: 2px solid ${props => props.theme.accent};
  color: ${props => props.primary ? props.theme.bg : props.theme.accent};
  text-decoration: none;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 50px;
  transition: all 0.3s ease;
  cursor: pointer;
  font-size: 14px;
  display: inline-block;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px ${props => props.theme.accent}40;
    ${props => !props.primary && `
      background: linear-gradient(135deg, ${props.theme.accent}, ${props.theme.accentAlt});
      color: ${props.theme.bg};
    `}
  }
`;

const Section = styled.section`
  padding: 100px 0;
  position: relative;
`;

const SectionTitle = styled.h2`
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 900;
  text-align: center;
  margin-bottom: 60px;
  background: linear-gradient(135deg, ${props => props.theme.text}, ${props => props.theme.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.theme.accent}, ${props => props.theme.accentAlt});
    border-radius: 2px;
  }
`;

const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const AboutText = styled.div`
  h3 {
    font-family: 'Orbitron', sans-serif;
    font-size: 28px;
    color: ${props => props.theme.accent};
    margin-bottom: 20px;
  }

  p {
    font-size: 16px;
    line-height: 1.8;
    color: ${props => props.theme.textAlt};
    margin-bottom: 20px;
  }
`;

const AboutStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const StatCard = styled.div`
  background: ${props => props.theme.card};
  border: 2px solid ${props => props.theme.border};
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.accent};
    transform: translateY(-5px);
    box-shadow: 0 10px 40px ${props => props.theme.accent}20;
  }

  h4 {
    font-family: 'Orbitron', sans-serif;
    font-size: 36px;
    color: ${props => props.theme.accent};
    margin-bottom: 10px;
  }

  p {
    color: ${props => props.theme.textAlt};
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
`;

const SkillCategory = styled.div`
  background: ${props => props.theme.card};
  border: 2px solid ${props => props.theme.border};
  border-radius: 20px;
  padding: 30px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.accent};
    transform: translateY(-5px);
    box-shadow: 0 10px 40px ${props => props.theme.accent}20;
  }

  h3 {
    font-family: 'Orbitron', sans-serif;
    font-size: 20px;
    color: ${props => props.theme.accent};
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;

    &::before {
      content: '//';
      color: ${props => props.theme.accentAlt};
    }
  }
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SkillTag = styled.span`
  background: ${props => props.theme.bgAlt};
  color: ${props => props.theme.text};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid ${props => props.theme.border};
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.accent};
    color: ${props => props.theme.bg};
    transform: translateY(-2px);
  }
`;

const Timeline = styled.div`
  position: relative;
  padding-left: 40px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, ${props => props.theme.accent}, ${props => props.theme.accentAlt});
  }
`;

const TimelineItem = styled.div`
  position: relative;
  margin-bottom: 50px;
  padding-left: 40px;

  &::before {
    content: '';
    position: absolute;
    left: -46px;
    top: 0;
    width: 16px;
    height: 16px;
    background: ${props => props.theme.accent};
    border: 4px solid ${props => props.theme.bg};
    border-radius: 50%;
    box-shadow: 0 0 20px ${props => props.theme.accent};
  }

  &:hover::before {
    animation: ${glow} 2s ease-in-out infinite;
  }
`;

const TimelineCard = styled.div`
  background: ${props => props.theme.card};
  border: 2px solid ${props => props.theme.border};
  border-radius: 20px;
  padding: 30px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.accent};
    transform: translateX(10px);
    box-shadow: 0 10px 40px ${props => props.theme.accent}20;
  }

  h3 {
    font-family: 'Orbitron', sans-serif;
    font-size: 22px;
    color: ${props => props.theme.text};
    margin-bottom: 10px;
  }

  h4 {
    color: ${props => props.theme.accent};
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: 700;
  }

  .period {
    color: ${props => props.theme.textAlt};
    font-size: 14px;
    margin-bottom: 15px;
    font-weight: 700;
  }

  ul {
    list-style: none;
    margin-top: 15px;
  }

  li {
    color: ${props => props.theme.textAlt};
    margin-bottom: 10px;
    padding-left: 20px;
    position: relative;

    &::before {
      content: '▹';
      position: absolute;
      left: 0;
      color: ${props => props.theme.accent};
      font-size: 18px;
    }
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled.div`
  background: ${props => props.theme.card};
  border: 2px solid ${props => props.theme.border};
  border-radius: 20px;
  padding: 30px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: ${props => props.theme.accent};
    transform: translateY(-10px);
    box-shadow: 0 20px 60px ${props => props.theme.accent}30;
  }

  h3 {
    font-family: 'Orbitron', sans-serif;
    font-size: 22px;
    color: ${props => props.theme.text};
    margin-bottom: 15px;
  }

  p {
    color: ${props => props.theme.textAlt};
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 20px;
  }
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const TechBadge = styled.span`
  background: ${props => props.theme.bgAlt};
  color: ${props => props.theme.accent};
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid ${props => props.theme.border};
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const ProjectLink = styled.a`
  color: ${props => props.theme.accent};
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.theme.accentAlt};
    transform: translateX(5px);
  }
`;

const ContactSection = styled.section`
  padding: 100px 0;
  text-align: center;
`;

const ContactContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 40px;
`;

const Input = styled.input`
  background: ${props => props.theme.card};
  border: 2px solid ${props => props.theme.border};
  border-radius: 15px;
  padding: 15px 20px;
  color: ${props => props.theme.text};
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.accent};
    box-shadow: 0 0 20px ${props => props.theme.accent}30;
  }

  &::placeholder {
    color: ${props => props.theme.textAlt};
  }
`;

const TextArea = styled.textarea`
  background: ${props => props.theme.card};
  border: 2px solid ${props => props.theme.border};
  border-radius: 15px;
  padding: 15px 20px;
  color: ${props => props.theme.text};
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.accent};
    box-shadow: 0 0 20px ${props => props.theme.accent}30;
  }

  &::placeholder {
    color: ${props => props.theme.textAlt};
  }
`;

const SubmitButton = styled.button`
  padding: 15px 35px;
  background: linear-gradient(135deg, ${props => props.theme.accent}, ${props => props.theme.accentAlt});
  border: none;
  color: ${props => props.theme.bg};
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px ${props => props.theme.accent}60;
  }
`;

const Footer = styled.footer`
  background: ${props => props.theme.card};
  border-top: 2px solid ${props => props.theme.border};
  padding: 40px 0;
  text-align: center;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const SocialLink = styled.a`
  width: 50px;
  height: 50px;
  border: 2px solid ${props => props.theme.border};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.accent};
  text-decoration: none;
  font-size: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.accent};
    background: ${props => props.theme.accent};
    color: ${props => props.theme.bg};
    transform: translateY(-5px) rotate(360deg);
    box-shadow: 0 10px 30px ${props => props.theme.accent}40;
  }
`;

const Copyright = styled.p`
  color: ${props => props.theme.textAlt};
  font-size: 14px;
`;

// ==================== DATA ====================
const portfolioData = {
  name: "Albin Reji",
  role: "Full Stack Developer",
  location: "Udupi, Karnataka, India",
  summary: "Full Stack Developer with expertise in Java, Spring Boot, and React. Proven track record in building secure REST APIs and microservices using Spring Security and JWT. Skilled in PostgreSQL optimization and integrating AI services for scalable web applications.",
  email: "albinrejim30@gmail.com",
  phone: "+91-8123160330",
  github: "https://github.com/Albin-Reji",
  linkedin: "https://linkedin.com/in/albin-reji",
  leetcode: "https://leetcode.com/u/Albin-Reji/",
  
  stats: [
    { value: "8.5", label: "CGPA" },
    { value: "2+", label: "Years Exp" },
    { value: "5+", label: "Projects" },
    { value: "96%", label: "ML Accuracy" }
  ],

  skills: {
    "Programming Languages": ["Java", "Python", "JavaScript (ES6+)", "SQL", "C++"],
    "Frameworks & Libraries": ["Spring Boot", "Spring Security", "Hibernate", "React.js", "JUnit"],
    "Architecture & Protocols": ["Microservices", "RESTful APIs", "WebSocket", "JWT Auth", "MVC"],
    "Databases": ["PostgreSQL", "MySQL", "MongoDB"],
    "DevOps & Tools": ["Docker", "Git/GitHub", "Jenkins", "Linux", "Maven", "Postman"],
    "Core Concepts": ["Data Structures & Algorithms", "OOP", "SDLC", "Machine Learning"]
  },

  experience: [
    {
      title: "Software Developer Intern",
      company: "Udupi Web Solutions",
      location: "Udupi, India",
      period: "Feb 2025 – May 2025",
      achievements: [
        "Engineered a full-stack AI chat platform using Spring Boot and ReactJS, utilizing Maven for build automation within a scalable Microservices architecture",
        "Integrated AI-powered APIs to enhance conversational accuracy and built optimized REST endpoints for seamless real-time messaging",
        "Implemented a hybrid data storage strategy using PostgreSQL for relational user data and MongoDB for unstructured chat logs, managed via Git version control"
      ]
    },
    {
      title: "Data Science Intern",
      company: "Saara IT Solutions Pvt Ltd",
      location: "Heart Attack Disease Prediction Project",
      period: "Oct 2023 – Nov 2023",
      achievements: [
        "Developed a Machine Learning model in Python, achieving 96% accuracy using Scikit-learn and Pandas with advanced data preprocessing",
        "Analyzed and visualized complex healthcare data to communicate insights to clinical stakeholders, enabling data-driven decision-making",
        "Implemented an end-to-end ML pipeline with feature engineering, model validation, and performance optimization"
      ]
    }
  ],

  projects: [
    {
      title: "Real-Time Chat Application",
      description: "Developed a real-time messaging tool utilizing Spring Boot and WebSocket for persistent, stateful client-server connections with optimized bandwidth usage.",
      tech: ["Java", "Spring Boot", "WebSocket", "STOMP"],
      link: "#"
    },
    {
      title: "Virtual Time Capsule",
      description: "Engineered a scheduling system with automated delivery using Spring Boot Task Scheduler and Cron Jobs. Implemented JWT authentication and normalized PostgreSQL schema.",
      tech: ["Spring Boot", "Spring Security", "JWT", "PostgreSQL"],
      link: "#"
    }
  ],

  education: {
    degree: "Bachelor of Engineering in Computer Science & Engineering",
    institution: "Mangalore Institute of Technology & Engineering",
    period: "Nov 2021 – May 2025",
    cgpa: "8.5/10"
  },

  certifications: [
    {
      name: "Java Spring Framework 6 with Spring Boot 3",
      issuer: "Udemy",
      link: "#"
    },
    {
      name: "100 Days of Code: Python Bootcamp",
      issuer: "Udemy",
      link: "#"
    }
  ]
};

// ==================== MAIN COMPONENT ====================
function Portfolio() {
  const [theme, setTheme] = useState('dark');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ThemeProvider theme={themes[theme]}>
      <GlobalStyle />
      
      {/* Navbar */}
      <Navbar style={{ boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.3)' : 'none' }}>
        <Container>
          <Logo onClick={() => scrollToSection('hero')}>AR</Logo>
          <NavLinks>
            <NavLink onClick={() => scrollToSection('about')}>About</NavLink>
            <NavLink onClick={() => scrollToSection('skills')}>Skills</NavLink>
            <NavLink onClick={() => scrollToSection('experience')}>Experience</NavLink>
            <NavLink onClick={() => scrollToSection('projects')}>Projects</NavLink>
            <NavLink onClick={() => scrollToSection('contact')}>Contact</NavLink>
            <ThemeToggle onClick={toggleTheme}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </ThemeToggle>
          </NavLinks>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <Hero id="hero">
        <Container>
          <HeroContent>
            <HeroTitle>{portfolioData.name}</HeroTitle>
            <HeroSubtitle>{portfolioData.role}</HeroSubtitle>
            <HeroDescription>{portfolioData.summary}</HeroDescription>
            <ButtonGroup>
              <Button primary onClick={() => scrollToSection('contact')}>Get In Touch</Button>
              <Button href={portfolioData.github} target="_blank">View GitHub</Button>
            </ButtonGroup>
          </HeroContent>
        </Container>
      </Hero>

      {/* About Section */}
      <Section id="about">
        <Container>
          <SectionTitle>About Me</SectionTitle>
          <AboutGrid>
            <AboutText>
              <h3>Hello! I'm {portfolioData.name.split(' ')[0]}</h3>
              <p>
                A passionate {portfolioData.role} based in {portfolioData.location}. I specialize in building
                high-performance, scalable web applications with a focus on clean architecture and modern technologies.
              </p>
              <p>
                With a strong foundation in both frontend and backend development, I enjoy tackling complex problems
                and creating solutions that make a real impact. My expertise spans from building secure REST APIs
                to crafting responsive user interfaces.
              </p>
            </AboutText>
            <AboutStats>
              {portfolioData.stats.map((stat, index) => (
                <StatCard key={index}>
                  <h4>{stat.value}</h4>
                  <p>{stat.label}</p>
                </StatCard>
              ))}
            </AboutStats>
          </AboutGrid>
        </Container>
      </Section>

      {/* Skills Section */}
      <Section id="skills">
        <Container>
          <SectionTitle>Skills & Technologies</SectionTitle>
          <SkillsGrid>
            {Object.entries(portfolioData.skills).map(([category, skills], index) => (
              <SkillCategory key={index}>
                <h3>{category}</h3>
                <SkillTags>
                  {skills.map((skill, idx) => (
                    <SkillTag key={idx}>{skill}</SkillTag>
                  ))}
                </SkillTags>
              </SkillCategory>
            ))}
          </SkillsGrid>
        </Container>
      </Section>

      {/* Experience Section */}
      <Section id="experience">
        <Container>
          <SectionTitle>Professional Experience</SectionTitle>
          <Timeline>
            {portfolioData.experience.map((exp, index) => (
              <TimelineItem key={index}>
                <TimelineCard>
                  <h3>{exp.title}</h3>
                  <h4>{exp.company}</h4>
                  <div className="period">{exp.period} • {exp.location}</div>
                  <ul>
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx}>{achievement}</li>
                    ))}
                  </ul>
                </TimelineCard>
              </TimelineItem>
            ))}
          </Timeline>
        </Container>
      </Section>

      {/* Projects Section */}
      <Section id="projects">
        <Container>
          <SectionTitle>Featured Projects</SectionTitle>
          <ProjectsGrid>
            {portfolioData.projects.map((project, index) => (
              <ProjectCard key={index}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <TechStack>
                  {project.tech.map((tech, idx) => (
                    <TechBadge key={idx}>{tech}</TechBadge>
                  ))}
                </TechStack>
                <ProjectLinks>
                  <ProjectLink href={project.link} target="_blank">
                    View Project →
                  </ProjectLink>
                </ProjectLinks>
              </ProjectCard>
            ))}
          </ProjectsGrid>
        </Container>
      </Section>

      {/* Education & Certifications */}
      <Section>
        <Container>
          <SectionTitle>Education & Certifications</SectionTitle>
          <Timeline>
            <TimelineItem>
              <TimelineCard>
                <h3>{portfolioData.education.degree}</h3>
                <h4>{portfolioData.education.institution}</h4>
                <div className="period">{portfolioData.education.period}</div>
                <p style={{ marginTop: '10px', color: themes[theme].accent }}>
                  CGPA: {portfolioData.education.cgpa}
                </p>
              </TimelineCard>
            </TimelineItem>
            {portfolioData.certifications.map((cert, index) => (
              <TimelineItem key={index}>
                <TimelineCard>
                  <h3>{cert.name}</h3>
                  <h4>{cert.issuer}</h4>
                  <ProjectLinks>
                    <ProjectLink href={cert.link} target="_blank">
                      View Certificate →
                    </ProjectLink>
                  </ProjectLinks>
                </TimelineCard>
              </TimelineItem>
            ))}
          </Timeline>
        </Container>
      </Section>

      {/* Contact Section */}
      <ContactSection id="contact">
        <Container>
          <ContactContent>
            <SectionTitle>Get In Touch</SectionTitle>
            <p style={{ color: themes[theme].textAlt, marginBottom: '30px' }}>
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
            </p>
            <ContactForm onSubmit={(e) => { e.preventDefault(); alert('Form submitted!'); }}>
              <Input type="text" placeholder="Your Name" required />
              <Input type="email" placeholder="Your Email" required />
              <Input type="text" placeholder="Subject" required />
              <TextArea placeholder="Your Message" required />
              <SubmitButton type="submit">Send Message</SubmitButton>
            </ContactForm>
          </ContactContent>
        </Container>
      </ContactSection>

      {/* Footer */}
      <Footer>
        <Container>
          <SocialLinks>
            <SocialLink href={portfolioData.github} target="_blank" title="GitHub">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </SocialLink>
            <SocialLink href={portfolioData.linkedin} target="_blank" title="LinkedIn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </SocialLink>
            <SocialLink href={portfolioData.leetcode} target="_blank" title="LeetCode">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
              </svg>
            </SocialLink>
            <SocialLink href={`mailto:${portfolioData.email}`} title="Email">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z"/>
              </svg>
            </SocialLink>
          </SocialLinks>
          <Copyright>
            © 2025 {portfolioData.name}. Crafted with passion & code.
          </Copyright>
        </Container>
      </Footer>
    </ThemeProvider>
  );
}

export default Portfolio;
