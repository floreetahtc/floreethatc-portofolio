import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Box,
  Check,
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
  Radar,
  Router,
  Server,
  ShieldCheck,
  Sun,
  Terminal,
  X,
} from 'lucide-react'
import {
  certifications,
  experience,
  futureGoals,
  learningPaths,
  navItems,
  organizations,
  projects,
  skillGroups,
  type Certificate,
  type Project,
  type ProjectCategory,
  type ProjectStatus,
  type SkillGroup,
  type SkillLevel,
} from './data/portfolio'
import type { PortfolioContent } from './data/portfolioStore'

type Theme = 'dark' | 'light'
type ProjectFilter = 'All' | ProjectCategory
type StatusFilter = 'All' | ProjectStatus
type CertificateFilter = 'All' | Certificate['category']

const projectCategories: ProjectFilter[] = ['All', 'Networking & Telecommunications', 'Systems & Infrastructure', 'Containerization & DevOps', 'Monitoring Systems']
const projectStatuses: StatusFilter[] = ['All', 'Completed', 'In progress', 'Planned', 'Technical documentation']
const certificateCategories: CertificateFilter[] = ['All', 'Linux & System Administration', 'Cybersecurity', 'Networking', 'Technical Training', 'Design Tools']
const skillLevels: SkillLevel[] = ['Used in Projects', 'Familiar With', 'Currently Learning']

type PublicPortfolioProps = {
  content: PortfolioContent
  theme: Theme
  toggleTheme: () => void
}

export function PublicPortfolio({ content, theme, toggleTheme }: PublicPortfolioProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('All')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [certificateFilter, setCertificateFilter] = useState<CertificateFilter>('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const config = content.portfolioConfig
  const visibleProjects = useMemo(() => projects.filter((project) => (projectFilter === 'All' || project.category === projectFilter) && (statusFilter === 'All' || project.status === statusFilter)), [projectFilter, statusFilter])
  const visibleCertificates = useMemo(() => content.certifications.filter((certificate) => certificateFilter === 'All' || certificate.category === certificateFilter), [certificateFilter, content.certifications])

  useEffect(() => {
    const sections = navItems.map((item) => document.querySelector(item.href)).filter((section): section is Element => Boolean(section))
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible?.target.id) setActiveSection(visible.target.id)
    }, { rootMargin: '-24% 0px -62% 0px', threshold: [0.08, 0.25, 0.55] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const basePath = import.meta.env.BASE_URL
  const manageHref = `${basePath}?manage=1`

  return <div className="portfolio-site">
    <header className="portfolio-header">
      <div className="content-width portfolio-header-inner">
        <a className="portfolio-brand" href="#home" aria-label="Back to home" onClick={() => setMenuOpen(false)}><span className="brand-mark">FT</span><span><strong>Floreetha Tiara Cantika<span>.</span></strong><small>systems / infrastructure</small></span></a>
        <button className="mobile-menu-button" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((current) => !current)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        <nav className={`portfolio-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          <div className="mobile-nav-head"><span>Navigate</span><button className="icon-button" type="button" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X size={18} /></button></div>
          {navItems.map((item) => <a className={activeSection === item.href.slice(1) ? 'active' : ''} href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
        </nav>
        <div className="portfolio-header-actions"><button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}><span className="theme-icon">{theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}</span><span>{theme === 'dark' ? 'Light' : 'Dark'}</span></button></div>
      </div>
    </header>

    <main>
      <section className="portfolio-hero" id="home">
        <div className="content-width hero-layout">
          <div className="hero-copy"><span className="eyebrow"><span className="status-dot" /> Computer systems / infrastructure</span><h1>Floreetha Tiara Cantika</h1><p className="hero-subtitle">Computer Systems Engineering Student <span>·</span> Networking &amp; IT Infrastructure Enthusiast</p><p className="hero-description">I explore how networks, operating systems, servers, and applications work together to make connected technology reliable and useful.</p><div className="hero-actions"><a className="button button-primary" href="#projects">Explore My Projects <ArrowDownRight size={16} /></a><a className="button button-secondary" href="#contact">Get in Touch <ArrowUpRight size={16} /></a>{config.cvPath && <a className="text-action" href={config.cvPath} download><Download size={15} /> Download CV</a>}</div><p className="hero-status"><span className="status-dot" /> Based in {config.location} · {config.academicPeriod} at Universitas Sriwijaya</p></div>
          <HeroDiagram />
        </div>
      </section>

      <section className="section-pad" id="about"><div className="content-width"><SectionHeading index="01" label="About me" title="Curious about what makes systems hold together." intro="A technical foundation built through academic work, hands-on experiments, relevant training, and a willingness to keep asking better infrastructure questions." /><div className="about-layout"><div className="prose"><p className="lead-copy">I&apos;m a Computer Systems Engineering student at Universitas Sriwijaya, interested in computer networking, system administration, and IT infrastructure.</p><p>My interest lies in understanding how networks, operating systems, servers, and applications work together as part of a connected technical environment.</p><p>I&apos;ve explored these areas through academic projects involving Docker and Traefik, Linux system administration training, telecommunications-related internship experience, and practical learning in networking and infrastructure technologies.</p></div><div className="principles-grid"><PrincipleCard number="01" icon={<Terminal size={19} />} title="Technical exploration" text="Learning technologies through hands-on experimentation and practical projects." /><PrincipleCard number="02" icon={<Radar size={19} />} title="Analytical thinking" text="Investigating system behavior and approaching technical problems systematically." /><PrincipleCard number="03" icon={<BookOpen size={19} />} title="Continuous learning" text="Building skills through certifications, academic work, and independent learning." /></div></div></div></section>

      <section className="section-pad section-muted" id="projects"><div className="content-width"><SectionHeading index="02" label="Selected work" title="Projects that make the infrastructure visible." intro="Completed work is separated from planned ideas and documentation so the status stays honest." /><div className="filter-area"><FilterRow label="Category" values={projectCategories} active={projectFilter} onChange={setProjectFilter} /><FilterRow label="Status" values={projectStatuses} active={statusFilter} onChange={setStatusFilter} /></div><div className="projects-grid">{visibleProjects.map((project) => <PortfolioProjectCard project={project} key={project.id} onOpen={() => setSelectedProject(project)} />)}</div>{visibleProjects.length === 0 && <EmptyState text="No projects match these filters yet." />}</div></section>

      <section className="section-pad" id="skills"><div className="content-width"><SectionHeading index="03" label="Technical toolkit" title="Exposure, not exaggeration." intro="Skills are grouped by how they currently show up in my work: used in projects, familiar with, or actively learning." /><div className="skill-legend" aria-label="Skill level legend">{skillLevels.map((level) => <span key={level}><i className={`legend-dot ${levelClass(level)}`} /> {level}</span>)}</div><div className="skills-grid">{skillGroups.map((group) => <GroupedSkillCard group={group} key={group.name} />)}<article className="tools-card"><div className="skill-card-head"><span className="icon-wrap"><Server size={18} /></span><h3>Tools &amp; working environment</h3></div><div className="tool-chips">{['Docker Desktop', 'VS Code', 'Microsoft Excel', 'MikroTik WinBox', 'Git & GitHub'].map((tool) => <span key={tool}>{tool}</span>)}</div></article></div></div></section>

      <section className="section-pad section-muted" id="certifications"><div className="content-width"><SectionHeading index="04" label="Training & credentials" title="Evidence of the topics I&apos;m taking seriously." intro="Verified files and credential actions stay connected to the original source." /><div className="filter-row certificate-filters"><span className="filter-label">View by</span>{certificateCategories.map((category) => <FilterButton active={certificateFilter === category} key={category} onClick={() => setCertificateFilter(category)}>{category}</FilterButton>)}</div><div className="certificates-grid">{visibleCertificates.map((certificate) => <PortfolioCertificateCard certificate={certificate} key={certificate.id} />)}</div></div></section>

      <section className="section-pad" id="experience"><div className="content-width"><SectionHeading index="05" label="Professional experience" title="Closer to the physical layer." intro="An internship experience connecting data work, documentation, and telecommunications infrastructure learning." /><div className="experience-layout"><div className="timeline">{content.experience.map((item) => <ExperienceCard item={item} key={item.title} />)}</div><FiberPathDiagram /></div></div></section>

      <section className="section-pad section-muted" id="organizations"><div className="content-width"><SectionHeading index="06" label="Beyond the lab" title="Learning to coordinate, communicate, and contribute." intro="Organizational experiences sit alongside the technical work: concise, factual, and ready to expand with verified dates or documentation." /><div className="org-grid">{content.organizations.map((organization, index) => <article className="org-card" key={organization.name}><div className="org-card-head"><span className="org-number">0{index + 1}</span><span className="org-period">{organization.period}</span></div><h3>{organization.name}</h3><ul>{organization.roles.map((role) => <li key={role}>{role}</li>)}</ul></article>)}</div></div></section>

      <section className="section-pad" id="learning"><div className="content-width"><SectionHeading index="07" label="Learning journey" title="Currently exploring." intro="I am continuously strengthening my foundation in networking, system administration, and IT infrastructure through hands-on learning and relevant technical training." /><div className="learning-grid">{learningPaths.map((path) => <LearningCard path={path} key={path.number} />)}</div><div className="future-goals"><div><span className="eyebrow">Next signals</span><h3>Future learning goals</h3></div><div className="goal-list">{futureGoals.map((goal) => <span key={goal}><ArrowUpRight size={14} />{goal}</span>)}</div></div></div></section>

      <section className="section-pad contact-section" id="contact"><div className="content-width contact-layout"><div><span className="eyebrow"><span className="status-dot" /> Let&apos;s connect</span><h2>Let&apos;s connect around the systems behind connected technology.</h2><p>I&apos;m open to connecting with people working in networking, IT infrastructure, system administration, and technology.</p></div><div className="contact-actions">{config.contact.email && <a className="button button-primary" href={`mailto:${config.contact.email}`}>Send an email <Mail size={16} /></a>}{config.contact.linkedin && <a className="button button-secondary" href={config.contact.linkedin} target="_blank" rel="noreferrer">Visit LinkedIn <ExternalLink size={16} /></a>}{config.contact.github && <a className="button button-secondary" href={config.contact.github} target="_blank" rel="noreferrer">View GitHub <Code2 size={16} /></a>}</div></div></section>
    </main>
    <footer className="site-footer"><div className="content-width footer-line"><span>© {new Date().getFullYear()} Floreetha Tiara Cantika</span><span>Built with React + TypeScript</span></div></footer>
    {selectedProject && <PortfolioProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    <a className="hidden-manage-link" href={manageHref} aria-label="Open content manager">Manage content</a>
  </div>
}

function SectionHeading({ index, label, title, intro }: { index: string; label: string; title: string; intro: string }) {
  return <div className="section-heading"><div><span className="section-index">{index}</span><span className="eyebrow">{label}</span><h2>{title}</h2></div><p>{intro}</p></div>
}

function PrincipleCard({ number, icon, title, text }: { number: string; icon: ReactNode; title: string; text: string }) {
  return <article className="principle-card"><div className="card-topline"><span>{number}</span><span className="icon-wrap">{icon}</span></div><h3>{title}</h3><p>{text}</p></article>
}

function FilterRow<T extends string>({ label, values, active, onChange }: { label: string; values: T[]; active: T; onChange: (value: T) => void }) {
  return <div className="filter-row"><span className="filter-label">{label}</span>{values.map((value) => <FilterButton active={active === value} key={value} onClick={() => onChange(value)}>{value}</FilterButton>)}</div>
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" className={`filter-button ${active ? 'active' : ''}`} onClick={onClick}>{children}</button>
}

function EmptyState({ text }: { text: string }) {
  return <div className="empty-state"><span>{text}</span></div>
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  return <span className={`status-badge status-${status.toLowerCase().replaceAll(' ', '-')}`}><span />{status}</span>
}

function PortfolioProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return <article className={`project-card ${project.featured ? 'featured' : ''}`}><div className="project-visual">{project.id === 'flask-traefik' ? <ArchitectureMini /> : project.id === 'kpi-monitoring' ? <KpiMini /> : <OtdrMini />}<span className="project-id">{project.eyebrow.split(' / ')[0]}</span></div><div className="project-card-body"><div className="project-card-topline"><span className="project-category">{project.category}</span><StatusBadge status={project.status} /></div><h3>{project.title}</h3><p>{project.summary}</p><div className="tag-list">{project.stack.slice(0, 4).map((item) => <span key={item}>{item}</span>)}</div><button className="card-link" type="button" onClick={onOpen}>View details <ArrowUpRight size={15} /></button></div></article>
}

function GroupedSkillCard({ group }: { group: SkillGroup }) {
  const icons = { network: <Network size={18} />, server: <Server size={18} />, code: <Code2 size={18} />, shield: <ShieldCheck size={18} /> }
  return <article className="skill-card"><div className="skill-card-head"><span className="icon-wrap">{icons[group.icon]}</span><h3>{group.name}</h3></div><div className="skill-level-groups">{skillLevels.map((level) => { const skills = group.skills.filter((skill) => skill.level === level); return skills.length ? <div className="skill-level-group" key={level}><h4><i className={`legend-dot ${levelClass(level)}`} />{level}</h4><div className="skill-chip-list">{skills.map((skill) => <span key={skill.name}>{skill.name}</span>)}</div></div> : null })}</div></article>
}

function levelClass(level: SkillLevel) {
  return level === 'Used in Projects' ? 'used' : level === 'Familiar With' ? 'familiar' : 'learning'
}

function PortfolioCertificateCard({ certificate }: { certificate: Certificate }) {
  const pending = Boolean(certificate.isDraft)
  const training = certificate.category === 'Technical Training' || certificate.category === 'Design Tools'
  return <article className={`certificate-card ${pending ? 'draft' : ''}`}><div className="certificate-content"><div className="certificate-topline"><span>{certificate.category}</span><span className={`certificate-kind ${training ? 'training' : 'professional'}`}>{training ? 'Training' : 'Certification'}</span></div><h3 title={certificate.name}>{certificate.name}</h3>{certificate.issuer && <p className="certificate-issuer">{certificate.issuer}</p>}<div className="certificate-meta">{certificate.date && <span><small>Issued</small>{certificate.date}</span>}{certificate.credentialId && <span><small>Credential</small>{certificate.credentialId}</span>}</div>{pending && <span className="document-pending">Document pending</span>}<div className="certificate-actions">{certificate.file && <a className="small-button" href={certificate.file} target="_blank" rel="noreferrer"><FileText size={14} /> View certificate</a>}{certificate.verificationUrl && <a className="small-button quiet" href={certificate.verificationUrl} target="_blank" rel="noreferrer"><ShieldCheck size={14} /> Verify credential</a>}</div></div></article>
}

function ExperienceCard({ item }: { item: (typeof experience)[number] }) {
  return <article className="experience-card"><div className="timeline-marker" /><div className="experience-heading"><span className="eyebrow">{item.period}</span><h3>{item.title}</h3><p>{item.organization} · {item.location}</p></div><div className="experience-body"><p>{item.description}</p><ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div></article>
}

function LearningCard({ path }: { path: (typeof learningPaths)[number] }) {
  return <article className="learning-card"><div className="learning-card-head"><span>{path.number}</span><ArrowUpRight size={18} /></div><h3>{path.title}</h3><p>{path.goal}</p><div className="topic-list">{path.topics.map((topic) => <span key={topic}>{topic}</span>)}</div></article>
}

function HeroDiagram() {
  return <div className="hero-diagram" role="img" aria-label="Users and browser connecting through a network to a Traefik reverse proxy, three parallel Flask containers, and a future cloud direction"><svg viewBox="0 0 900 500" fill="none" aria-hidden="true"><defs><marker id="hero-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="currentColor" /></marker></defs><path className="hero-grid-line" d="M60 86H840M60 170H840M60 254H840M60 338H840M60 422H840M150 45V455M310 45V455M470 45V455M630 45V455M790 45V455" /><path className="hero-connection" markerEnd="url(#hero-arrow)" d="M190 250H280" /><path className="hero-connection" markerEnd="url(#hero-arrow)" d="M385 250H470" /><path className="hero-connection" d="M590 250H650M650 250V151M650 250V349M650 151H700M650 250H700M650 349H700" /><path className="hero-connection future" markerEnd="url(#hero-arrow)" d="M590 250H690V80H760" /><DiagramNode x={70} y={206} width={120} height={88} icon={<HardDrive size={17} />} title="Users / Browser" detail="request entry" /><DiagramNode x={280} y={206} width={105} height={88} icon={<Network size={17} />} title="Network" detail="connect / route" /><DiagramNode x={470} y={206} width={120} height={88} icon={<Router size={17} />} title="Traefik" detail="reverse proxy" accent /><DiagramNode x={700} y={108} width={130} height={70} icon={<Box size={16} />} title="Flask 1" detail="container" /><DiagramNode x={700} y={215} width={130} height={70} icon={<Box size={16} />} title="Flask 2" detail="container" /><DiagramNode x={700} y={322} width={130} height={70} icon={<Box size={16} />} title="Flask 3" detail="container" /><g className="hero-cloud"><rect x={740} y={43} width={120} height={36} rx={8} /><Cloud size={15} x={754} y={53} /><text x={780} y={66}>future direction</text></g></svg><span className="hero-diagram-caption">request path / parallel targets</span></div>
}

function DiagramNode({ x, y, width, height, icon, title, detail, accent }: { x: number; y: number; width: number; height: number; icon: ReactNode; title: string; detail: string; accent?: boolean }) {
  return <foreignObject x={x} y={y} width={width} height={height}><div className={`hero-node ${accent ? 'accent' : ''}`}><span>{icon}</span><strong>{title}</strong><small>{detail}</small></div></foreignObject>
}

function ArchitectureMini() {
  return <div className="mini-diagram architecture-mini"><div className="mini-client">browser</div><div className="mini-arrow">→</div><div className="mini-proxy">traefik</div><div className="mini-arrow">→</div><div className="mini-backends"><span>flask 1</span><span>flask 2</span><span>flask 3</span></div></div>
}

function KpiMini() {
  return <div className="mini-diagram kpi-mini"><div className="kpi-bars"><span style={{ height: '38%' }} /><span style={{ height: '62%' }} /><span style={{ height: '48%' }} /><span style={{ height: '80%' }} /><span style={{ height: '68%' }} /></div><div className="kpi-alert">early warning</div><div className="mini-grid-lines" /></div>
}

function OtdrMini() {
  return <div className="mini-diagram otdr-mini"><svg viewBox="0 0 300 120" fill="none" aria-hidden="true"><path d="M0 83C24 83 32 78 45 76C60 74 59 50 76 52C93 54 85 76 109 76C131 76 133 58 145 61C163 65 156 82 182 81C207 80 214 67 224 68C241 69 238 87 262 84C276 82 288 82 300 82" /><path className="trace-accent" d="M0 104H300" /></svg><span>conceptual OTDR trace</span></div>
}

function FiberPathDiagram() {
  const points = ['Metro-E', 'OLT', 'FTM', 'ODC', 'ODP', 'OTP', 'Roset', 'ONT']
  return <div className="fiber-panel"><div className="fiber-panel-head"><span className="eyebrow">Educational overview</span><span><Network size={15} /> access fiber path</span></div><div className="fiber-path">{points.map((point, index) => <div className="fiber-node" key={point}><span className="fiber-node-icon">{index === 0 ? <Cloud size={14} /> : index === points.length - 1 ? <HardDrive size={14} /> : <Router size={14} />}</span><small>{point}</small>{index < points.length - 1 && <i />}</div>)}</div><p>Metro-E → OLT → FTM → ODC → ODP → OTP → Roset → ONT</p></div>
}

function PortfolioProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const dialog = event.currentTarget as Document
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('[data-modal-focusable="true"]'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => { document.removeEventListener('keydown', handleKeyDown); previous?.focus() }
  }, [onClose])
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title"><button ref={closeButtonRef} data-modal-focusable="true" className="modal-close icon-button" type="button" onClick={onClose} aria-label="Close project details"><X size={18} /></button><div className="modal-intro"><span className="eyebrow">{project.eyebrow}</span><StatusBadge status={project.status} /><h2 id="project-modal-title">{project.title}</h2><p>{project.description}</p><div className="tag-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></div>{project.id === 'flask-traefik' ? <div className="detail-diagram"><div className="diagram-heading"><span>System architecture</span><small>parallel backend targets</small></div><ArchitectureMini /></div> : project.id === 'otdr-ftth-gpon' ? <div className="detail-diagram otdr-detail"><div className="diagram-heading"><span>Conceptual OTDR trace</span><small>illustrative graphic · not measured data</small></div><OtdrMini /></div> : <div className="detail-diagram"><div className="diagram-heading"><span>Planned data flow</span><small>editable as implementation progresses</small></div><div className="kpi-flow">{['Indicator registry', 'Target vs realization', 'Achievement %', 'Early warning'].map((step, index) => <div key={step}><span>0{index + 1}</span><strong>{step}</strong>{index < 3 && <ArrowRight size={14} />}</div>)}</div></div>}<div className="modal-columns"><div><h3>My contribution</h3><ul className="detail-list">{project.contributions.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></div><div><h3>Key learning outcomes</h3><ul className="detail-list">{project.learnings.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></div></div>{project.progressNote && <div className="editor-note modal-note">{project.progressNote}</div>}</div></div>
}
