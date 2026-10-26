import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Award,
  BookOpen,
  Box,
  Check,
  ChevronDown,
  CircleHelp,
  Cloud,
  Code2,
  Download,
  ExternalLink,
  FileText,
  HardDrive,
  Mail,
  Menu,
  Moon,
  Network,
  Plus,
  Radar,
  Router,
  Save,
  Server,
  ShieldCheck,
  Sun,
  Terminal,
  Upload,
  UserRound,
  X,
  Zap,
} from 'lucide-react'
import {
  futureGoals,
  learningPaths,
  navItems,
  projects,
  skillGroups,
  type Certificate,
  type ExperienceItem,
  type Project,
  type ProjectCategory,
  type ProjectStatus,
  type SkillGroup,
} from './data/portfolio'
import { loadPortfolioContent, normalizePortfolioContent, readFileAsDataUrl, resetPortfolioContent, savePortfolioContent, type PortfolioContent } from './data/portfolioStore'
import { PublicPortfolio } from './PublicPortfolio'

type Theme = 'dark' | 'light'
type ProjectFilter = 'All' | ProjectCategory
type StatusFilter = 'All' | ProjectStatus
type CertificateFilter = 'All' | Certificate['category']

const projectCategories: ProjectFilter[] = ['All', 'Networking & Telecommunications', 'Systems & Infrastructure', 'Containerization & DevOps']

const projectStatuses: StatusFilter[] = ['All', 'Completed', 'Technical documentation']
const certificateCategories: CertificateFilter[] = ['All', 'Linux & System Administration', 'Cybersecurity', 'Networking', 'Technical Training', 'Design Tools']
const dashboardNav = [
  { label: 'Overview', href: '#overview', icon: <HardDrive size={16} /> },
  { label: 'Projects', href: '#projects', icon: <Box size={16} /> },
  { label: 'Skills', href: '#skills', icon: <Terminal size={16} /> },
  { label: 'Certificates', href: '#certifications', icon: <Award size={16} /> },
  { label: 'Experience', href: '#experience', icon: <Network size={16} /> },
  { label: 'Organizations', href: '#organizations', icon: <BookOpen size={16} /> },
]

function App() {
  const [content, setContent] = useState<PortfolioContent>(() => loadPortfolioContent())
  const [theme, setTheme] = useState<Theme>(() => {
    const requested = new URLSearchParams(window.location.search).get('theme')
    if (requested === 'light' || requested === 'dark') return requested
    const saved = window.localStorage.getItem('floreetha-theme') as Theme | null
    return saved === 'light' ? 'light' : 'dark'
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('All')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [certificateFilter, setCertificateFilter] = useState<CertificateFilter>('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const portfolioConfig = content.portfolioConfig
  const certifications = content.certifications
  const experience = content.experience
  const organizations = content.organizations
  const manageMode = new URLSearchParams(window.location.search).get('manage') === '1'
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

  const updateContent = (nextContent: PortfolioContent) => {
    savePortfolioContent(nextContent)
    setContent(nextContent)
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('floreetha-theme', theme)
  }, [theme])

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter((section): section is Element => Boolean(section))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActiveSection(visible.target.id)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const filteredProjects = useMemo(
    () => projects.filter((project) => (projectFilter === 'All' || project.category === projectFilter) && (statusFilter === 'All' || project.status === statusFilter)),
    [projectFilter, statusFilter],
  )

  const filteredCertificates = useMemo(
    () => certifications.filter((certificate) => certificateFilter === 'All' || certificate.category === certificateFilter),
    [certificateFilter, certifications],
  )

  if (manageMode) {
    return <ContentManager content={content} onChange={updateContent} />
  }

  const currentPath = window.location.pathname.replace(/\/$/, '') || '/'
  if (currentPath !== basePath) {
    return <NotFoundPage />
  }

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  return <PublicPortfolio content={content} theme={theme} toggleTheme={toggleTheme} />

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Go to homepage" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">FT</span>
          <span className="brand-copy">
            <strong>floreetha<span>.</span></strong>
            <small>systems / infrastructure</small>
          </span>
        </a>

        <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          <div className="mobile-nav-head">
            <span>Navigation</span>
            <button className="icon-button" type="button" onClick={() => setMenuOpen(false)} aria-label="Close navigation">
              <X size={18} />
            </button>
          </div>
          {navItems.map((item, index) => (
            <a
              className={activeSection === item.href.slice(1) ? 'active' : ''}
              href={item.href}
              key={item.href}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-index">0{index + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            <span className="theme-icon">{theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}</span>
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          <button className="mobile-menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Open navigation">
            <Menu size={20} />
          </button>
        </div>
      </header>

      <main>
        <section className="hero section-pad" id="home">
          <div className="hero-grid content-width">
            <div className="hero-copy">
              <div className="eyebrow"><span className="status-dot" /> 2024—Present · Universitas Sriwijaya</div>
              <p className="hero-kicker">Computer systems / network infrastructure</p>
              <h1>Building a stronger foundation for <em>connected</em> systems.</h1>
              <p className="hero-intro">I&apos;m Floreetha Tiara Cantika, a Computer Systems Engineering student exploring networking, Linux system administration, and the infrastructure behind reliable digital services.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#projects">Explore projects <ArrowDownRight size={16} /></a>
                <a className="button button-secondary" href="#contact">Get in touch <ArrowUpRight size={16} /></a>
                {portfolioConfig.cvPath ? (
                  <a className="text-action" href={portfolioConfig.cvPath} download><Download size={15} /> Download CV</a>
                ) : (
                  <span className="text-action disabled" title="Add a CV file path in src/data/portfolio.ts"><Download size={15} /> CV coming soon</span>
                )}
              </div>
              <div className="hero-meta">
                <span><span className="meta-label">Focus</span> Networking · Linux · Infrastructure</span>
                <span><span className="meta-label">Approach</span> Learn / build / document</span>
              </div>
            </div>
            <NetworkVisual />
          </div>
          <div className="signal-strip content-width" aria-label="Portfolio focus areas">
            <span><strong>01</strong> Networking & telecom</span>
            <span><strong>02</strong> Systems & infrastructure</span>
            <span><strong>03</strong> Containers & cloud</span>
            <span className="signal-line" />
            <span className="signal-status"><span className="status-dot" /> continuously learning</span>
          </div>
        </section>

        <section className="section-pad section-light" id="about">
          <div className="content-width">
            <SectionHeader index="01" label="About the builder" title="Curious about what makes systems hold together." intro="A technical foundation built through academic work, hands-on experiments, relevant training, and a willingness to keep asking better infrastructure questions." />
            <div className="about-grid">
              <div className="about-narrative">
                <p className="large-copy">I&apos;m a Computer Systems Engineering student at Universitas Sriwijaya, interested in computer networking, system administration, and IT infrastructure.</p>
                <p>My interest lies in understanding how networks, operating systems, servers, and applications work together as part of a connected technical environment.</p>
                <p>I&apos;ve explored these areas through academic projects involving Docker and Traefik, Linux system administration training, telecommunications-related internship experience, and practical learning in networking and infrastructure technologies.</p>
                <p>I&apos;m continuing to strengthen my technical foundation while exploring opportunities in networking, IT infrastructure, and system administration.</p>
              </div>
              <div className="principles-grid">
                <PrincipleCard number="01" icon={<Terminal size={19} />} title="Technical exploration" text="Learning technologies through hands-on experimentation and practical projects." />
                <PrincipleCard number="02" icon={<Radar size={19} />} title="Analytical thinking" text="Investigating system behavior and approaching technical problems systematically." />
                <PrincipleCard number="03" icon={<BookOpen size={19} />} title="Continuous learning" text="Building skills through certifications, academic work, and independent learning." />
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad" id="projects">
          <div className="content-width">
            <SectionHeader index="02" label="Selected work" title="Projects that make the infrastructure visible." intro="A curated record of practical exploration. Completed work is separated from planned ideas and documentation so the status stays honest." />
            <div className="filter-area">
              <div className="filter-row" aria-label="Filter projects by category">
                <span className="filter-label">Category</span>
                {projectCategories.map((category) => <FilterButton active={projectFilter === category} key={category} onClick={() => setProjectFilter(category)}>{category}</FilterButton>)}
              </div>
              <div className="filter-row" aria-label="Filter projects by status">
                <span className="filter-label">Status</span>
                {projectStatuses.map((status) => <FilterButton active={statusFilter === status} key={status} onClick={() => setStatusFilter(status)}>{status}</FilterButton>)}
              </div>
            </div>
            <div className="projects-grid">
              {filteredProjects.map((project) => <ProjectCard key={project.id} project={project} onOpen={() => setSelectedProject(project)} />)}
            </div>
            {filteredProjects.length === 0 && <EmptyState text="No projects match these filters yet." />}
          </div>
        </section>

        <section className="section-pad section-blueprint" id="skills">
          <div className="content-width">
            <SectionHeader index="03" label="Technical toolkit" title="Exposure, not exaggeration." intro="Skills are grouped by how they currently show up in my work: used in projects, familiar with, or actively learning." />
            <div className="skill-legend" aria-label="Skill level legend">
              <span><i className="legend-dot used" /> Used in projects</span>
              <span><i className="legend-dot familiar" /> Familiar with</span>
              <span><i className="legend-dot learning" /> Currently learning</span>
            </div>
            <div className="skills-grid">
              {skillGroups.map((group) => <SkillGroupCard group={group} key={group.name} />)}
            </div>
            <div className="tools-line"><span>Tools & working environment</span><strong>Docker Desktop</strong><strong>VS Code</strong><strong>Microsoft Excel</strong><strong>MikroTik WinBox</strong><strong>Git & GitHub — update when confirmed</strong></div>
          </div>
        </section>

        <section className="section-pad" id="certifications">
          <div className="content-width">
            <SectionHeader index="04" label="Training & credentials" title="Evidence of the topics I&apos;m taking seriously." intro="Certificate details and actions are data-driven. Missing files and unverified fields stay hidden until the original source is available." />
            <div className="certificate-topline">
              <div className="filter-row" aria-label="Filter certificates by category">
                <span className="filter-label">View by</span>
                {certificateCategories.map((category) => <FilterButton active={certificateFilter === category} key={category} onClick={() => setCertificateFilter(category)}>{category}</FilterButton>)}
              </div>
              <span className="asset-note"><CircleHelp size={15} /> Source files live in <code>public/certificates/</code></span>
            </div>
            <div className="certificates-grid">
              {filteredCertificates.map((certificate) => <CertificateCard certificate={certificate} key={certificate.id} />)}
            </div>
          </div>
        </section>

        <section className="section-pad section-light" id="experience">
          <div className="content-width">
            <SectionHeader index="05" label="Professional experience" title="Closer to the physical layer." intro="An internship experience that connected data work, documentation, and telecommunications infrastructure learning." />
            <div className="experience-layout">
              <div className="timeline">
                {experience.map((item) => <ExperienceCard item={item} key={item.title} />)}
              </div>
              <FiberPathDiagram />
            </div>
          </div>
        </section>

        <section className="section-pad" id="organizations">
          <div className="content-width">
            <SectionHeader index="06" label="Beyond the lab" title="Learning to coordinate, communicate, and contribute." intro="Organizational experiences sit alongside the technical work: concise, factual, and ready to expand with verified dates or documentation." />
            <div className="org-grid">
              {organizations.map((organization, index) => (
                <article className="org-card" key={organization.name}>
                  <div className="org-card-head"><span className="org-number">0{index + 1}</span><span className="org-period">{organization.period}</span></div>
                  <h3>{organization.name}</h3>
                  <ul>{organization.roles.map((role) => <li key={role}>{role}</li>)}</ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad section-blueprint" id="learning">
          <div className="content-width">
            <SectionHeader index="07" label="Current learning journey" title="Currently exploring." intro="I am continuously strengthening my technical foundation in networking, system administration, and IT infrastructure through hands-on learning, practical projects, and relevant technical training." />
            <div className="learning-grid">
              {learningPaths.map((path) => <LearningCard path={path} key={path.number} />)}
            </div>
            <div className="future-goals">
              <div><span className="eyebrow">Next signals</span><h3>Future learning goals</h3></div>
              <div className="goal-list">{futureGoals.map((goal) => <span key={goal}><ArrowUpRight size={14} />{goal}</span>)}</div>
            </div>
          </div>
        </section>

        <section className="section-pad contact-section" id="contact">
          <div className="content-width contact-inner">
            <div>
              <div className="eyebrow"><span className="status-dot" /> Open to thoughtful connections</div>
              <h2>Let&apos;s connect around the systems behind connected technology.</h2>
              <p>I&apos;m open to connecting with people working in networking, IT infrastructure, system administration, and technology.</p>
            </div>
            <div className="contact-actions">
              {portfolioConfig.contact.email ? <a className="button button-primary" href={`mailto:${portfolioConfig.contact.email}`}>Send an email <Mail size={16} /></a> : <span className="button button-primary disabled" title="Add an email in src/data/portfolio.ts">Email coming soon <Mail size={16} /></span>}
              {portfolioConfig.contact.linkedin ? <a className="button button-secondary" href={portfolioConfig.contact.linkedin} target="_blank" rel="noreferrer">Visit LinkedIn <ExternalLink size={16} /></a> : null}
              {portfolioConfig.contact.github ? <a className="button button-secondary" href={portfolioConfig.contact.github} target="_blank" rel="noreferrer">View GitHub <Code2 size={16} /></a> : null}
              {!portfolioConfig.contact.linkedin && !portfolioConfig.contact.github && <span className="contact-note"><CircleHelp size={15} /> Add social URLs in <code>src/data/portfolio.ts</code> when ready.</span>}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="content-width footer-grid">
          <div><strong>Floreetha Tiara Cantika</strong><span>Computer Systems Engineering Student</span></div>
          <div className="footer-tagline">Learning, building, and exploring the systems behind connected technology.</div>
          <div className="footer-links">{navItems.slice(0, 5).map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}</div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} Floreetha Tiara Cantika</span><span>Built with React + TypeScript</span></div>
        </div>
      </footer>

      {selectedProject && <ProjectModal project={selectedProject!} onClose={() => setSelectedProject(null)} />}
    </div>
  )
}

type PortfolioDashboardProps = {
  content: PortfolioContent
  theme: Theme
  toggleTheme: () => void
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  projectFilter: ProjectFilter
  setProjectFilter: (filter: ProjectFilter) => void
  statusFilter: StatusFilter
  setStatusFilter: (filter: StatusFilter) => void
  certificateFilter: CertificateFilter
  setCertificateFilter: (filter: CertificateFilter) => void
  filteredProjects: Project[]
  filteredCertificates: Certificate[]
  selectedProject: Project | null
  setSelectedProject: (project: Project | null) => void
}

function PortfolioDashboard({
  content,
  theme,
  toggleTheme,
  menuOpen,
  setMenuOpen,
  projectFilter,
  setProjectFilter,
  statusFilter,
  setStatusFilter,
  certificateFilter,
  setCertificateFilter,
  filteredProjects,
  filteredCertificates,
  selectedProject,
  setSelectedProject,
}: PortfolioDashboardProps) {
  const [activeDashboardSection, setActiveDashboardSection] = useState('overview')
  const { portfolioConfig, certifications, experience, organizations } = content
  const manageHref = `${import.meta.env.BASE_URL}?manage=1`

  const navigateTo = (href: string) => {
    setActiveDashboardSection(href.slice(1))
    setMenuOpen(false)
  }

  return <div className="dashboard-app">
    <aside className={`dashboard-sidebar ${menuOpen ? 'is-open' : ''}`}>
      <div className="dashboard-brand">
        <span className="brand-mark">FT</span>
        <div><strong>floreetha<span>.</span></strong><small>portfolio OS</small></div>
      </div>
      <div className="dashboard-profile">
        <div className="dashboard-avatar">FT</div>
        <strong>{portfolioConfig.name}</strong>
        <span>{portfolioConfig.shortHeadline}</span>
        <small><span className="status-dot" /> Available for connections</small>
      </div>
      <nav className="dashboard-nav" aria-label="Portfolio dashboard navigation">
        <span className="dashboard-nav-label">Workspace</span>
        {dashboardNav.map((item) => <a className={activeDashboardSection === item.href.slice(1) ? 'active' : ''} href={item.href} key={item.href} onClick={() => navigateTo(item.href)}>{item.icon}<span>{item.label}</span></a>)}
      </nav>
      <div className="dashboard-sidebar-bottom">
        <a href={manageHref}><Zap size={16} /><span>Manage content</span></a>
        <button type="button" onClick={toggleTheme}><span className="dashboard-theme-icon">{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</span><span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span></button>
      </div>
    </aside>
    {menuOpen && <button className="dashboard-scrim" type="button" aria-label="Close sidebar" onClick={() => setMenuOpen(false)} />}
    <button className="dashboard-mobile-toggle" type="button" onClick={() => setMenuOpen(true)} aria-label="Open dashboard navigation"><Menu size={20} /></button>

    <main className="dashboard-main">
      <header className="dashboard-topbar">
        <div><span className="dashboard-breadcrumb">Workspace / Portfolio dashboard</span><span className="dashboard-topbar-title">Systems & infrastructure profile</span></div>
        <div className="dashboard-topbar-actions">
          {portfolioConfig.cvPath && <a className="dashboard-icon-link" href={portfolioConfig.cvPath} download title="Download CV"><Download size={17} /></a>}
          {portfolioConfig.contact.linkedin && <a className="dashboard-icon-link" href={portfolioConfig.contact.linkedin} target="_blank" rel="noreferrer" title="Open LinkedIn"><ExternalLink size={17} /></a>}
          <a className="dashboard-user-chip" href={`mailto:${portfolioConfig.contact.email ?? ''}`}><span className="status-dot" />{portfolioConfig.contact.email ? 'Open to connect' : 'Contact unavailable'}</a>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="dashboard-welcome" id="overview">
          <div className="dashboard-welcome-copy">
            <span className="eyebrow"><span className="status-dot" /> Live profile · {portfolioConfig.location}</span>
            <h1>Hi, I&apos;m <em>Floreetha.</em></h1>
            <p>{portfolioConfig.headline}. This dashboard collects the projects, training, and experiences shaping my path through networking, Linux, telecommunications, and IT infrastructure.</p>
            <div className="dashboard-actions"><a className="button button-primary" href="#projects">Explore work <ArrowDownRight size={16} /></a>{portfolioConfig.contact.email && <a className="button button-secondary" href={`mailto:${portfolioConfig.contact.email}`}>Get in touch <Mail size={16} /></a>}</div>
          </div>
          <div className="dashboard-welcome-visual"><NetworkVisual /></div>
        </section>

        <section className="dashboard-stat-grid" aria-label="Portfolio summary">
          <article className="dashboard-stat-card"><span className="dashboard-stat-icon blue"><Box size={18} /></span><div><strong>{projects.length}</strong><span>Selected projects</span></div><small>Build / document / learn</small></article>
          <article className="dashboard-stat-card"><span className="dashboard-stat-icon green"><Award size={18} /></span><div><strong>{certifications.length}</strong><span>Training records</span></div><small>Evidence-led profile</small></article>
          <article className="dashboard-stat-card"><span className="dashboard-stat-icon yellow"><Network size={18} /></span><div><strong>{experience.length}</strong><span>Experience entries</span></div><small>Closer to the physical layer</small></article>
          <article className="dashboard-stat-card"><span className="dashboard-stat-icon purple"><Terminal size={18} /></span><div><strong>{organizations.length}</strong><span>Communities</span></div><small>Coordinate / contribute</small></article>
        </section>

        <section className="dashboard-section" id="projects">
          <div className="dashboard-section-heading"><div><span className="dashboard-section-kicker">01 / Delivery log</span><h2>Projects & technical work</h2><p>Practical experiments across applications, containers, monitoring, and telecommunications.</p></div><a className="dashboard-text-link" href="#projects">View workspace <ArrowUpRight size={15} /></a></div>
          <div className="dashboard-filter-stack"><div className="filter-row"><span className="filter-label">Category</span>{projectCategories.map((category) => <FilterButton active={projectFilter === category} key={category} onClick={() => setProjectFilter(category)}>{category}</FilterButton>)}</div><div className="filter-row"><span className="filter-label">Status</span>{projectStatuses.map((status) => <FilterButton active={statusFilter === status} key={status} onClick={() => setStatusFilter(status)}>{status}</FilterButton>)}</div></div>
          <div className="dashboard-projects-grid">{filteredProjects.map((project) => <ProjectCard key={project.id} project={project} onOpen={() => setSelectedProject(project)} />)}</div>
          {filteredProjects.length === 0 && <EmptyState text="No projects match these filters yet." />}
        </section>

        <section className="dashboard-section dashboard-section-tinted" id="skills">
          <div className="dashboard-section-heading"><div><span className="dashboard-section-kicker">02 / Capability map</span><h2>Technical toolkit</h2><p>Exposure is grouped by how each skill currently appears in the work.</p></div><span className="dashboard-live-label"><span className="status-dot" /> Continuously learning</span></div>
          <div className="dashboard-skills-grid">{skillGroups.map((group) => <SkillGroupCard group={group} key={group.name} />)}</div>
          <div className="dashboard-tool-strip"><span>Working environment</span><strong>Docker Desktop</strong><strong>VS Code</strong><strong>Microsoft Excel</strong><strong>MikroTik WinBox</strong></div>
        </section>

        <section className="dashboard-section" id="certifications">
          <div className="dashboard-section-heading"><div><span className="dashboard-section-kicker">03 / Evidence</span><h2>Certificates & training</h2><p>Verified files and credential actions stay connected to the original source.</p></div><span className="dashboard-count-label">{filteredCertificates.length} shown</span></div>
          <div className="filter-row dashboard-certificate-filters"><span className="filter-label">Filter</span>{certificateCategories.map((category) => <FilterButton active={certificateFilter === category} key={category} onClick={() => setCertificateFilter(category)}>{category}</FilterButton>)}</div>
          <div className="dashboard-certificates-grid">{filteredCertificates.map((certificate) => <CertificateCard certificate={certificate} key={certificate.id} />)}</div>
        </section>

        <section className="dashboard-split-grid">
          <div className="dashboard-section dashboard-section-card" id="experience"><div className="dashboard-section-heading compact"><div><span className="dashboard-section-kicker">04 / Timeline</span><h2>Experience</h2></div></div><div className="dashboard-timeline">{experience.map((item) => <ExperienceCard item={item} key={item.title} />)}</div></div>
          <div className="dashboard-section dashboard-section-card" id="organizations"><div className="dashboard-section-heading compact"><div><span className="dashboard-section-kicker">05 / Communities</span><h2>Organizations</h2></div></div><div className="dashboard-org-list">{organizations.map((organization, index) => <article className="dashboard-org-row" key={organization.name}><span className="dashboard-org-number">0{index + 1}</span><div><strong>{organization.name}</strong><span>{organization.period}</span><p>{organization.roles.join(' · ')}</p></div></article>)}</div></div>
        </section>

        <section className="dashboard-section dashboard-section-tinted" id="contact">
          <div className="dashboard-contact-grid"><div><span className="dashboard-section-kicker">06 / Contact channel</span><h2>Let&apos;s connect around the systems behind connected technology.</h2><p>Open to thoughtful conversations about networking, IT infrastructure, system administration, and technology.</p></div><div className="dashboard-contact-actions">{portfolioConfig.contact.email && <a className="button button-primary" href={`mailto:${portfolioConfig.contact.email}`}>Send an email <Mail size={16} /></a>}{portfolioConfig.contact.linkedin && <a className="button button-secondary" href={portfolioConfig.contact.linkedin} target="_blank" rel="noreferrer">Visit LinkedIn <ExternalLink size={16} /></a>}<a className="dashboard-manage-link" href={manageHref}><Zap size={15} /> Update portfolio content</a></div></div>
        </section>
      </div>
      <footer className="dashboard-footer"><span>© {new Date().getFullYear()} Floreetha Tiara Cantika</span><span>React + TypeScript · GitHub Pages</span></footer>
    </main>
    {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
  </div>
}

function ContentManager({ content, onChange }: { content: PortfolioContent; onChange: (content: PortfolioContent) => void }) {
  const [draft, setDraft] = useState(content)
  const [certificateName, setCertificateName] = useState('')
  const [certificateIssuer, setCertificateIssuer] = useState('')
  const [certificateDate, setCertificateDate] = useState('')
  const [certificateCategory, setCertificateCategory] = useState<Certificate['category']>('Technical Training')
  const [certificateFile, setCertificateFile] = useState('')
  const [certificateFileName, setCertificateFileName] = useState('')
  const [experienceTitle, setExperienceTitle] = useState('')
  const [experienceOrganization, setExperienceOrganization] = useState('')
  const [experiencePeriod, setExperiencePeriod] = useState('')
  const [experienceLocation, setExperienceLocation] = useState('')
  const [experienceDescription, setExperienceDescription] = useState('')
  const [experienceBullets, setExperienceBullets] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [organizationPeriod, setOrganizationPeriod] = useState('')
  const [organizationRoles, setOrganizationRoles] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const updateContact = (field: 'email' | 'linkedin', value: string) => {
    setDraft((current) => ({
      ...current,
      portfolioConfig: {
        ...current.portfolioConfig,
        contact: { ...current.portfolioConfig.contact, [field]: value || undefined },
      },
    }))
  }

  const readUpload = async (event: ChangeEvent<HTMLInputElement>, onRead: (dataUrl: string, fileName: string) => void) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const dataUrl = await readFileAsDataUrl(file)
      onRead(dataUrl, file.name)
      setError('')
      setStatus(`${file.name} is ready to save locally.`)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'The selected file could not be read.')
    }
  }

  const saveDraft = () => {
    try {
      onChange(draft)
      setError('')
      setStatus('Portfolio content saved in this browser.')
    } catch {
      setError('Could not save. The browser storage quota may be full; try a smaller file.')
    }
  }

  const addCertificate = () => {
    if (!certificateName.trim()) {
      setError('Certificate name is required.')
      return
    }

    const nextCertificate: Certificate = {
      id: `custom-certificate-${Date.now()}`,
      name: certificateName.trim(),
      issuer: certificateIssuer.trim() || undefined,
      date: certificateDate.trim() || undefined,
      category: certificateCategory,
      file: certificateFile || undefined,
      description: 'Added through the local content manager.',
    }

    setDraft((current) => ({ ...current, certifications: [...current.certifications, nextCertificate] }))
    setCertificateName('')
    setCertificateIssuer('')
    setCertificateDate('')
    setCertificateFile('')
    setCertificateFileName('')
    setError('')
    setStatus('Certificate added to the draft. Save to publish it locally.')
  }

  const addExperience = () => {
    if (!experienceTitle.trim() || !experienceOrganization.trim()) {
      setError('Experience title and organization are required.')
      return
    }

    const nextExperience: PortfolioContent['experience'][number] = {
      title: experienceTitle.trim(),
      organization: experienceOrganization.trim(),
      period: experiencePeriod.trim() || 'Dates to confirm',
      location: experienceLocation.trim() || 'Location to confirm',
      description: experienceDescription.trim() || 'Description to be added.',
      bullets: experienceBullets.split('\n').map((bullet) => bullet.trim()).filter(Boolean),
    }

    setDraft((current) => ({ ...current, experience: [...current.experience, nextExperience] }))
    setExperienceTitle('')
    setExperienceOrganization('')
    setExperiencePeriod('')
    setExperienceLocation('')
    setExperienceDescription('')
    setExperienceBullets('')
    setError('')
    setStatus('Experience added to the draft. Save to publish it locally.')
  }

  const addOrganization = () => {
    if (!organizationName.trim()) {
      setError('Organization name is required.')
      return
    }

    const nextOrganization: PortfolioContent['organizations'][number] = {
      name: organizationName.trim(),
      period: organizationPeriod.trim() || 'Dates to confirm',
      roles: organizationRoles.split('\n').map((role) => role.trim()).filter(Boolean),
    }

    setDraft((current) => ({ ...current, organizations: [...current.organizations, nextOrganization] }))
    setOrganizationName('')
    setOrganizationPeriod('')
    setOrganizationRoles('')
    setError('')
    setStatus('Organization added to the draft. Save to publish it locally.')
  }

  const exportContent = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'floreetha-portfolio-content.json'
    link.click()
    URL.revokeObjectURL(url)
    setStatus('Portfolio content exported as JSON.')
  }

  const importContent = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const parsed = normalizePortfolioContent(JSON.parse(await file.text()))
      setDraft(parsed)
      onChange(parsed)
      setError('')
      setStatus('Portfolio content imported and saved locally.')
    } catch {
      setError('The selected file is not valid portfolio JSON.')
    }
  }

  const resetContent = () => {
    try {
      const defaults = resetPortfolioContent()
      setDraft(defaults)
      onChange(defaults)
      setError('')
      setStatus('Local content reset to the source data.')
    } catch {
      setError('Could not reset local content.')
    }
  }

  return <main className="manager-dashboard">
    <aside className="manager-sidebar">
      <div className="dashboard-brand"><span className="brand-mark">FT</span><div><strong>floreetha<span>.</span></strong><small>content studio</small></div></div>
      <div className="manager-sidebar-label">Admin workspace</div>
      <nav className="manager-nav" aria-label="Content manager navigation">
        <a className="active" href="#manager-overview"><HardDrive size={16} /> Overview</a>
        <a href="#manager-profile"><UserRound size={16} /> Profile & CV</a>
        <a href="#manager-certificates"><Award size={16} /> Certificates</a>
        <a href="#manager-experience"><Network size={16} /> Experience</a>
        <a href="#manager-organizations"><BookOpen size={16} /> Organizations</a>
        <a href="#manager-storage"><Upload size={16} /> Storage</a>
      </nav>
      <div className="manager-sidebar-bottom"><a href={import.meta.env.BASE_URL}><ArrowLeft size={16} /> Public portfolio</a><span><span className="status-dot" /> Saved locally</span></div>
    </aside>
    <div className="manager-main">
      <header className="manager-topbar" id="manager-overview"><div><span className="dashboard-breadcrumb">Admin / Content studio</span><h1>Portfolio control center</h1></div><a className="button button-secondary" href={import.meta.env.BASE_URL}>View public site <ExternalLink size={16} /></a></header>
      <div className="manager-dashboard-content">
        <div className="manager-dashboard-stats"><article><span><HardDrive size={17} /></span><strong>{draft.portfolioConfig.contact.email ? 'Ready' : 'Missing'}</strong><small>Contact profile</small></article><article><span><Award size={17} /></span><strong>{draft.certifications.length}</strong><small>Certificates</small></article><article><span><Network size={17} /></span><strong>{draft.experience.length}</strong><small>Experience entries</small></article><article><span><BookOpen size={17} /></span><strong>{draft.organizations.length}</strong><small>Organizations</small></article></div>
        <div className="content-width manager-shell">
      <div className="manager-header">
        <div>
          <span className="eyebrow"><span className="status-dot" /> Local content manager</span>
          <h1>Update the portfolio without a backend.</h1>
          <p>Changes are stored in this browser. Export the JSON file when you want to move the content to another browser or commit it to the project.</p>
        </div>
        <a className="button button-secondary" href={import.meta.env.BASE_URL}>Back to portfolio <ArrowLeft size={16} /></a>
      </div>

      <div className="manager-status" aria-live="polite">
        {status && <span className="manager-success"><Check size={15} /> {status}</span>}
        {error && <span className="manager-error"><CircleHelp size={15} /> {error}</span>}
      </div>

      <section className="manager-panel" id="manager-profile">
        <div className="manager-panel-head"><div><span className="eyebrow">01 / Profile links</span><h2>Contact and CV</h2></div><Save size={19} /></div>
        <div className="manager-form-grid">
          <label className="manager-field"><span>Email</span><input type="email" value={draft.portfolioConfig.contact.email ?? ''} onChange={(event) => updateContact('email', event.target.value)} /></label>
          <label className="manager-field"><span>LinkedIn</span><input type="url" value={draft.portfolioConfig.contact.linkedin ?? ''} onChange={(event) => updateContact('linkedin', event.target.value)} /></label>
        </div>
        <div className="manager-upload-row">
          <label className="manager-upload"><Upload size={16} /><span>Upload CV<input type="file" accept=".pdf,.doc,.docx" onChange={(event) => readUpload(event, (dataUrl) => setDraft((current) => ({ ...current, portfolioConfig: { ...current.portfolioConfig, cvPath: dataUrl } })))} /></span></label>
          <span className="manager-file-note">{draft.portfolioConfig.cvPath?.startsWith('data:') ? 'Uploaded CV is stored locally.' : draft.portfolioConfig.cvPath ?? 'No CV configured.'}</span>
        </div>
      </section>

      <section className="manager-panel" id="manager-certificates">
        <div className="manager-panel-head"><div><span className="eyebrow">02 / Certificates</span><h2>Add a certificate</h2></div><Plus size={19} /></div>
        <div className="manager-form-grid">
          <label className="manager-field"><span>Name *</span><input value={certificateName} onChange={(event) => setCertificateName(event.target.value)} placeholder="Official certificate name" /></label>
          <label className="manager-field"><span>Issuer</span><input value={certificateIssuer} onChange={(event) => setCertificateIssuer(event.target.value)} placeholder="Issuing organization" /></label>
          <label className="manager-field"><span>Date</span><input value={certificateDate} onChange={(event) => setCertificateDate(event.target.value)} placeholder="Month YYYY" /></label>
          <label className="manager-field"><span>Category</span><select value={certificateCategory} onChange={(event) => setCertificateCategory(event.target.value as Certificate['category'])}>{certificateCategories.slice(1).map((category) => <option value={category} key={category}>{category}</option>)}</select></label>
        </div>
        <div className="manager-upload-row">
          <label className="manager-upload"><Upload size={16} /><span>Upload certificate<input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(event) => readUpload(event, (dataUrl, fileName) => { setCertificateFile(dataUrl); setCertificateFileName(fileName) })} /></span></label>
          <span className="manager-file-note">{certificateFileName || 'No certificate file selected.'}</span>
        </div>
        <button className="button button-secondary" type="button" onClick={addCertificate}>Add certificate <Plus size={16} /></button>
      </section>

      <section className="manager-panel" id="manager-experience">
        <div className="manager-panel-head"><div><span className="eyebrow">03 / Experience</span><h2>Add experience</h2></div><Plus size={19} /></div>
        <div className="manager-form-grid">
          <label className="manager-field"><span>Title *</span><input value={experienceTitle} onChange={(event) => setExperienceTitle(event.target.value)} placeholder="Role or activity" /></label>
          <label className="manager-field"><span>Organization *</span><input value={experienceOrganization} onChange={(event) => setExperienceOrganization(event.target.value)} placeholder="Organization name" /></label>
          <label className="manager-field"><span>Period</span><input value={experiencePeriod} onChange={(event) => setExperiencePeriod(event.target.value)} placeholder="Month YYYY — Month YYYY" /></label>
          <label className="manager-field"><span>Location</span><input value={experienceLocation} onChange={(event) => setExperienceLocation(event.target.value)} placeholder="City, country" /></label>
        </div>
        <label className="manager-field"><span>Description</span><textarea value={experienceDescription} onChange={(event) => setExperienceDescription(event.target.value)} rows={3} /></label>
        <label className="manager-field"><span>Bullet points, one per line</span><textarea value={experienceBullets} onChange={(event) => setExperienceBullets(event.target.value)} rows={4} /></label>
        <button className="button button-secondary" type="button" onClick={addExperience}>Add experience <Plus size={16} /></button>
      </section>

      <section className="manager-panel" id="manager-organizations">
        <div className="manager-panel-head"><div><span className="eyebrow">04 / Organizations</span><h2>Add organization</h2></div><Plus size={19} /></div>
        <div className="manager-form-grid">
          <label className="manager-field"><span>Name *</span><input value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} placeholder="Organization name" /></label>
          <label className="manager-field"><span>Period</span><input value={organizationPeriod} onChange={(event) => setOrganizationPeriod(event.target.value)} placeholder="Year or date range" /></label>
        </div>
        <label className="manager-field"><span>Roles, one per line</span><textarea value={organizationRoles} onChange={(event) => setOrganizationRoles(event.target.value)} rows={3} /></label>
        <button className="button button-secondary" type="button" onClick={addOrganization}>Add organization <Plus size={16} /></button>
      </section>

      <section className="manager-panel manager-tools-panel" id="manager-storage">
        <div className="manager-panel-head"><div><span className="eyebrow">05 / Storage</span><h2>Save or move your content</h2></div><Upload size={19} /></div>
        <div className="manager-stats"><span>{draft.certifications.length} certificates</span><span>{draft.experience.length} experience entries</span><span>{draft.organizations.length} organizations</span></div>
        <div className="manager-actions">
          <button className="button button-primary" type="button" onClick={saveDraft}>Save changes <Save size={16} /></button>
          <button className="button button-secondary" type="button" onClick={exportContent}>Export JSON <Download size={16} /></button>
          <label className="button button-secondary manager-import"><Upload size={16} /> Import JSON<input type="file" accept="application/json,.json" onChange={importContent} /></label>
          <button className="button button-secondary" type="button" onClick={resetContent}>Reset local content</button>
        </div>
      </section>
        </div>
      </div>
    </div>
  </main>
}

function SectionHeader({ index, label, title, intro }: { index: string; label: string; title: string; intro: string }) {
  return <div className="section-header"><div className="section-heading"><span className="section-index">{index}</span><span className="eyebrow">{label}</span><h2>{title}</h2></div><p>{intro}</p></div>
}

function PrincipleCard({ number, icon, title, text }: { number: string; icon: ReactNode; title: string; text: string }) {
  return <article className="principle-card"><div className="card-topline"><span>{number}</span><span className="icon-wrap">{icon}</span></div><h3>{title}</h3><p>{text}</p></article>
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" className={`filter-button ${active ? 'active' : ''}`} onClick={onClick}>{children}</button>
}

function EmptyState({ text }: { text: string }) {
  return <div className="empty-state"><CircleHelp size={19} /><span>{text}</span></div>
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  return <span className={`status-badge status-${status.toLowerCase().replaceAll(' ', '-')}`}><span />{status}</span>
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return <article className={`project-card ${project.featured ? 'featured' : ''}`}>
    <div className="project-visual">
      {project.screenshot ? <img className="project-screenshot" src={project.screenshot} alt={`${project.title} screenshot`} /> : project.id === 'flask-traefik' ? <ArchitectureMini /> : <OtdrMini />}
      <span className="project-id">{project.eyebrow.split(' / ')[0]}</span>
    </div>
    <div className="project-card-body">
      <div className="project-card-topline"><span className="project-category">{project.category}</span><StatusBadge status={project.status} /></div>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <div className="tag-list">{project.stack.slice(0, 4).map((item) => <span key={item}>{item}</span>)}</div>
      <button className="card-link" type="button" onClick={onOpen}>View details <ArrowUpRight size={15} /></button>
    </div>
  </article>
}

function CertificateCard({ certificate }: { certificate: Certificate }) {
  const hasFile = Boolean(certificate.file)
  return <article className={`certificate-card ${certificate.isDraft ? 'draft' : ''}`}>
    <div className="certificate-mark">{certificate.isDraft ? <CircleHelp size={20} /> : <Award size={20} />}</div>
    <div className="certificate-content">
      <div className="certificate-topline"><span>{certificate.category}</span>{certificate.isDraft && <span className="draft-label">Source needed</span>}</div>
      <h3>{certificate.name}</h3>
      {certificate.issuer && <p className="certificate-issuer">{certificate.issuer}</p>}
      <div className="certificate-meta">{certificate.date && <span><span>Issued</span>{certificate.date}</span>}{certificate.credentialId && <span><span>Credential</span>{certificate.credentialId}</span>}</div>
      {certificate.description && <p className="certificate-description">{certificate.description}</p>}
      <div className="certificate-actions">
        {hasFile ? <a className="small-button" href={certificate.file} target="_blank" rel="noreferrer"><FileText size={14} /> View certificate</a> : null}
        {certificate.verificationUrl ? <a className="small-button quiet" href={certificate.verificationUrl} target="_blank" rel="noreferrer"><ShieldCheck size={14} /> Verify credential</a> : null}
        {!hasFile && !certificate.verificationUrl && !certificate.isDraft && <span className="missing-action">Original file to be added</span>}
        {certificate.isDraft && <span className="missing-action">Not published as verified</span>}
      </div>
    </div>
  </article>
}

function SkillGroupCard({ group }: { group: SkillGroup }) {
  const icons = { network: <Network size={18} />, server: <Server size={18} />, code: <Code2 size={18} />, shield: <ShieldCheck size={18} /> }
  return <article className="skill-card"><div className="skill-card-head"><span className="icon-wrap">{icons[group.icon]}</span><h3>{group.name}</h3></div><ul>{group.skills.map((skill) => <li key={skill.name}><span>{skill.name}</span><span className={`skill-level ${skill.level.toLowerCase().replaceAll(' ', '-')}`}>{skill.level}</span></li>)}</ul></article>
}

function ExperienceCard({ item }: { item: ExperienceItem }) {
  return <article className="experience-card"><div className="timeline-marker" /><div className="experience-heading"><span className="eyebrow">{item.period}</span><h3>{item.title}</h3><p>{item.organization} · {item.location}</p></div><div className="experience-body"><p>{item.description}</p><ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>{item.note && <div className="editor-note"><CircleHelp size={14} /> {item.note}</div>}</div></article>
}

function LearningCard({ path }: { path: (typeof learningPaths)[number] }) {
  return <article className="learning-card"><div className="learning-card-head"><span>{path.number}</span><ArrowUpRight size={18} /></div><h3>{path.title}</h3><p>{path.goal}</p><div className="topic-list">{path.topics.map((topic) => <span key={topic}>{topic}</span>)}</div></article>
}

function NetworkVisual() {
  return <div className="network-visual" aria-label="Illustration of clients connecting through a reverse proxy to services and cloud infrastructure" role="img">
    <div className="visual-caption"><span className="live-dot" /> infrastructure map <span>01</span></div>
    <svg className="network-lines" viewBox="0 0 640 490" fill="none" aria-hidden="true">
      <path d="M114 155C201 155 194 194 276 194" />
      <path d="M114 318C201 318 194 266 276 266" />
      <path d="M364 230C423 230 422 151 486 151" />
      <path d="M364 230C423 230 422 309 486 309" />
      <path d="M364 230C436 230 458 230 515 230" />
      <circle cx="276" cy="230" r="5" /><circle cx="486" cy="151" r="4" /><circle cx="486" cy="230" r="4" /><circle cx="486" cy="309" r="4" />
    </svg>
    <div className="visual-node node-client"><span className="node-icon"><HardDrive size={16} /></span><strong>client devices</strong><small>users / browser</small></div>
    <div className="visual-node node-proxy"><span className="node-icon accent"><Router size={17} /></span><strong>reverse proxy</strong><small>route / balance</small></div>
    <div className="visual-node node-services"><span className="node-icon"><Box size={17} /></span><strong>services</strong><small>containerized apps</small></div>
    <div className="visual-node node-cloud"><span className="node-icon cloud"><Cloud size={18} /></span><strong>cloud layer</strong><small>future direction</small></div>
    <div className="visual-code">{`{ status: "learning",`}<br />{` stack: ["net", "sys"] }`}</div>
    <div className="visual-grid-label">network / systems / infrastructure</div>
  </div>
}

function ArchitectureMini() {
  return <div className="mini-diagram architecture-mini"><div className="mini-client">browser</div><div className="mini-arrow">→</div><div className="mini-proxy">traefik</div><div className="mini-arrow">→</div><div className="mini-backends"><span>flask 1</span><span>flask 2</span><span>flask 3</span></div></div>
}

function OtdrMini() {
  return <div className="mini-diagram otdr-mini"><svg viewBox="0 0 300 120" fill="none" aria-hidden="true"><path d="M0 83C24 83 32 78 45 76C60 74 59 50 76 52C93 54 85 76 109 76C131 76 133 58 145 61C163 65 156 82 182 81C207 80 214 67 224 68C241 69 238 87 262 84C276 82 288 82 300 82" /><path className="trace-accent" d="M0 104H300" /></svg><span>conceptual OTDR trace</span></div>
}

function FiberPathDiagram() {
  const points = ['Metro-E', 'OLT', 'FTM', 'ODC', 'ODP', 'OTP', 'Roset', 'ONT']
  return <div className="fiber-panel"><div className="fiber-panel-head"><span className="eyebrow">Educational overview</span><span><Network size={15} /> access fiber path</span></div><div className="fiber-path">{points.map((point, index) => <div className="fiber-node" key={point}><span className="fiber-node-icon">{index === 0 ? <Cloud size={14} /> : index === points.length - 1 ? <HardDrive size={14} /> : <Router size={14} />}</span><small>{point}</small>{index < points.length - 1 && <i />}</div>)}</div><p>Metro-E → OLT → FTM → ODC → ODP → OTP → Roset → ONT</p><span className="editor-note"><CircleHelp size={14} /> Educational overview; not a claim of configuring every device.</span></div>
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title"><button className="modal-close icon-button" type="button" onClick={onClose} aria-label="Close project details"><X size={18} /></button><div className="modal-intro"><span className="eyebrow">{project.eyebrow}</span><StatusBadge status={project.status} /><h2 id="project-modal-title">{project.title}</h2><p>{project.description}</p><div className="tag-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></div>{project.screenshot && <img className="project-detail-image" src={project.screenshot} alt={`${project.title} supporting visual`} />}{project.id === 'flask-traefik' ? <ArchitectureDiagram /> : <OtdrDetail />}<div className="modal-columns"><div><h3>My contribution</h3><ul className="detail-list">{project.contributions.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></div><div><h3>Key learning outcomes</h3><ul className="detail-list">{project.learnings.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></div></div>{project.progressNote && <div className="editor-note modal-note"><CircleHelp size={15} /> {project.progressNote}</div>}<div className="modal-actions">{project.github ? <a className="small-button" href={project.github} target="_blank" rel="noreferrer"><Code2 size={14} /> GitHub repository</a> : <span className="missing-action"><Code2 size={14} /> Repository link not added</span>}{project.documentation ? <a className="small-button quiet" href={project.documentation} target="_blank" rel="noreferrer"><FileText size={14} /> Documentation</a> : null}{project.liveDemo ? <a className="small-button quiet" href={project.liveDemo} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Live demo</a> : null}{project.socialPost ? <a className="small-button quiet" href={project.socialPost} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Project post</a> : null}</div></div></div>
}

function ArchitectureDiagram() {
  return <div className="detail-diagram"><div className="diagram-heading"><span>System architecture</span><small>parallel backend targets</small></div><div className="architecture-flow"><div className="diagram-box browser-box"><HardDrive size={17} /><span>User / Browser</span></div><div className="diagram-connector vertical" /><div className="diagram-box proxy-box"><Router size={18} /><span>Traefik reverse proxy<br />& load balancer</span></div><div className="diagram-connector split" /><div className="backend-row">{['Flask 1', 'Flask 2', 'Flask 3'].map((item) => <div className="diagram-box backend-box" key={item}><Box size={16} /><span>{item}<small>container</small></span></div>)}</div></div></div>
}

function OtdrDetail() {
  return <div className="detail-diagram otdr-detail"><div className="diagram-heading"><span>Conceptual OTDR trace</span><small>illustrative graphic · not measured data</small></div><svg viewBox="0 0 760 200" fill="none" aria-label="Conceptual OTDR trace"><path className="trace-grid" d="M0 40H760M0 80H760M0 120H760M0 160H760M95 0V200M190 0V200M285 0V200M380 0V200M475 0V200M570 0V200M665 0V200" /><path className="trace-path" d="M0 133C31 133 42 129 65 129C91 129 91 118 111 119C134 120 126 72 151 77C176 82 171 128 207 128C245 128 244 107 269 110C300 114 294 130 330 131C367 132 376 121 398 121C431 121 419 88 443 92C464 96 460 132 493 132C535 132 533 110 555 112C581 115 570 131 609 131C650 131 666 127 700 127C725 127 742 129 760 129" /><path className="trace-axis" d="M0 178H760" /><text x="4" y="194">start</text><text x="700" y="194">distance →</text></svg><span className="conceptual-label"><CircleHelp size={14} /> Conceptual only — no distances, attenuation values, or fault locations are being claimed.</span></div>
}

function NotFoundPage() {
  return <div className="not-found"><div className="not-found-card"><span className="eyebrow">404 / route not found</span><h1>This route is outside the network.</h1><p>The portfolio is a single-page site. Use the navigation to return to the main system map.</p><a className="button button-primary" href="/"><ArrowLeft size={16} /> Back to home</a></div></div>
}

export default App
