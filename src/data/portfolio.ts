export type ProjectStatus = 'Completed' | 'In progress' | 'Planned' | 'Technical documentation'

export type ProjectCategory =
  | 'Networking & Telecommunications'
  | 'Systems & Infrastructure'
  | 'Containerization & DevOps'

export type CertificateCategory =
  | 'Linux & System Administration'
  | 'Cybersecurity'
  | 'Networking'
  | 'Technical Training'
  | 'Design Tools'

export type SkillLevel = 'Used in Projects' | 'Familiar With' | 'Currently Learning'

export interface Project {
  id: string
  eyebrow: string
  title: string
  category: ProjectCategory
  status: ProjectStatus
  summary: string
  description: string
  stack: string[]
  contributions: string[]
  learnings: string[]
  featured?: boolean
  github?: string
  documentation?: string
  liveDemo?: string
  socialPost?: string
  screenshot?: string
  progressNote?: string
}

export interface Certificate {
  id: string
  name: string
  issuer?: string
  date?: string
  category: CertificateCategory
  credentialId?: string
  file?: string
  verificationUrl?: string
  description?: string
  isDraft?: boolean
}

export interface SkillGroup {
  name: string
  icon: 'network' | 'server' | 'code' | 'shield'
  skills: Array<{ name: string; level: SkillLevel }>
}

export interface ExperienceItem {
  period: string
  title: string
  organization: string
  location: string
  description: string
  bullets: string[]
  note?: string
}

export const portfolioConfig = {
  name: 'Floreetha Tiara Cantika',
  initials: 'FT',
  headline: 'Computer Systems Engineering Student | Networking & IT Infrastructure Enthusiast',
  shortHeadline: 'Computer Systems Engineering Student',
  location: 'Palembang, Indonesia',
  education: 'Computer Systems Engineering · Universitas Sriwijaya',
  academicPeriod: '2024—Present',
  cvPath: './documents/CV_2026.pdf',
  contact: {
    email: 'floreethatiarac@gmail.com',
    linkedin: 'https://www.linkedin.com/in/floreetha-tiara-cantika',
    github: undefined as string | undefined,
  },
}

export const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Experience', href: '#experience' },
  { label: 'Organizations', href: '#organizations' },
  { label: 'Learning Journey', href: '#learning' },
  { label: 'Contact', href: '#contact' },
]

export const projects: Project[] = [
  {
    id: 'flask-traefik',
    eyebrow: '01 / Containerization & infrastructure',
    title: 'Implementasi Web Minigame Berbasis Flask dengan Traefik Load Balancing',
    category: 'Containerization & DevOps',
    status: 'Completed',
    summary: 'A containerized Flask minigame portal routed through Traefik as reverse proxy and load balancer.',
    description:
      'This academic project explores containerized application deployment using Flask, Docker Compose, and Traefik. A browser request enters through Traefik, which routes traffic to one of three parallel Flask application containers.',
    stack: ['Python', 'Flask', 'Docker', 'Docker Compose', 'Traefik', 'Traefik Dashboard'],
    contributions: [
      'Built and organized the Flask application flow for a small minigame portal.',
      'Configured a multi-container development environment with Docker Compose.',
      'Explored Traefik routing, reverse proxy concepts, and load balancing fundamentals.',
    ],
    learnings: [
      'Docker-based application deployment',
      'Multi-container application architecture',
      'Reverse proxy configuration and service routing',
      'Basic infrastructure visibility through the Traefik Dashboard',
    ],
    featured: true,
  },
  {
    id: 'otdr-ftth-gpon',
    eyebrow: '02 / Telecommunications',
    title: 'ANALISIS HASIL PENGUKURAN KABEL ACCESS FIBER OPTIK MENGGUNAKAN OPTICAL TIME DOMAIN REFLECTOMETER (OTDR) PADA JARINGAN FIBER TO THE HOME (FTTH) DENGAN TEKNOLOGI GPON DI STO PALEMBANG CENTRUM (PGC)',
    category: 'Networking & Telecommunications',
    status: 'Technical documentation',
    summary: 'Laporan kerja praktik tentang analisis hasil pengukuran kabel access fiber optik menggunakan OTDR pada jaringan FTTH dengan teknologi GPON di STO Palembang Centrum (PGC).',
    description:
      'Laporan kerja praktik ini membahas analisis hasil pengukuran kabel access fiber optik menggunakan Optical Time Domain Reflectometer (OTDR) pada jaringan Fiber to the Home (FTTH) dengan teknologi GPON di STO Palembang Centrum (PGC). Ilustrasi pada portofolio bersifat konseptual dan tidak dipresentasikan sebagai hasil pengukuran lapangan.',
    stack: ['OTDR', 'Fiber optic', 'FTTH', 'GPON', 'Technical documentation'],
    contributions: [
      'Menyusun laporan kerja praktik dengan fokus pada pengukuran kabel access fiber optik menggunakan OTDR.',
      'Menganalisis hasil pengukuran dalam konteks jaringan FTTH dengan teknologi GPON di STO Palembang Centrum (PGC).',
      'Mendokumentasikan pembahasan teknis access fiber optic secara terstruktur.',
    ],
    learnings: [
      'Interpretasi dasar hasil pengukuran OTDR',
      'Hubungan access fiber optic dengan jaringan FTTH dan GPON',
      'Penyusunan dokumentasi teknis untuk kebutuhan kerja praktik',
    ],
  },
]

export const skillGroups: SkillGroup[] = [
  {
    name: 'Networking',
    icon: 'network',
    skills: [
      { name: 'Network Fundamentals', level: 'Used in Projects' },
      { name: 'IP Addressing & Subnetting', level: 'Familiar With' },
      { name: 'Network Topology', level: 'Familiar With' },
      { name: 'Routing & Switching Fundamentals', level: 'Currently Learning' },
      { name: 'FTTH / GPON Fundamentals', level: 'Used in Projects' },
      { name: 'Fiber Optic Measurement Fundamentals', level: 'Used in Projects' },
    ],
  },
  {
    name: 'Systems & infrastructure',
    icon: 'server',
    skills: [
      { name: 'Linux System Administration Fundamentals', level: 'Used in Projects' },
      { name: 'Docker', level: 'Used in Projects' },
      { name: 'Docker Compose', level: 'Used in Projects' },
      { name: 'Traefik Reverse Proxy', level: 'Used in Projects' },
      { name: 'Load Balancing Fundamentals', level: 'Used in Projects' },
      { name: 'Virtualization Fundamentals', level: 'Currently Learning' },
      { name: 'Server Administration Fundamentals', level: 'Currently Learning' },
    ],
  },
  {
    name: 'Programming & application development',
    icon: 'code',
    skills: [
      { name: 'Python', level: 'Used in Projects' },
      { name: 'Flask', level: 'Used in Projects' },
      { name: 'Laravel', level: 'Currently Learning' },
      { name: 'HTML, CSS & JavaScript', level: 'Familiar With' },
      { name: 'SQL & Database Fundamentals', level: 'Currently Learning' },
    ],
  },
  {
    name: 'Cybersecurity foundations',
    icon: 'shield',
    skills: [
      { name: 'Cybersecurity Fundamentals', level: 'Familiar With' },
      { name: 'Blue Team Fundamentals', level: 'Familiar With' },
      { name: 'Security Analysis Fundamentals', level: 'Familiar With' },
      { name: 'Network Security Fundamentals', level: 'Currently Learning' },
    ],
  },
]

export const certifications: Certificate[] = [
  {
    id: 'rh124',
    name: 'Red Hat System Administration I (RH124), Version 9.3',
    issuer: 'Red Hat',
    date: 'October 2025',
    category: 'Linux & System Administration',
    description: 'Training in foundational Linux system administration.',
    // Add the original PDF path here when it is available in public/certificates/.
  },
  {
    id: 'cnsp',
    name: 'Certified Network Security Practitioner (CNSP)',
    issuer: 'The SecOps Group',
    category: 'Cybersecurity',
    description: 'Credential details are displayed only after the original certificate is added.',
  },
  {
    id: 'btf',
    name: 'Certified Blue Team Fundamentals (BTF)',
    issuer: 'CyberWarFare Labs (CWL)',
    date: 'October 12, 2026',
    category: 'Cybersecurity',
    credentialId: 'BTF-6acc5542a8a9c04f32d64887',
    file: './certificates/BTF_certified_certificate.pdf',
    description: 'Completed certification according to the supplied certificate.',
  },
  {
    id: 'c3sa',
    name: 'Certified Cyber Security Analyst (C3SA)',
    issuer: 'CyberWarFare Labs (CWL)',
    date: 'October 12, 2026',
    category: 'Cybersecurity',
    credentialId: 'C3SA-6acc5d4aa8a9c04f32d65a4b',
    file: './certificates/C3SA_certified_certificate.pdf',
    description: 'Completed certification according to the supplied certificate.',
  },
  {
    id: 'ccep',
    name: 'Certified Cybersecurity Educator Professional (CCEP)',
    issuer: 'Red Team Leaders',
    date: 'October 12, 2026',
    category: 'Cybersecurity',
    file: './certificates/CCEP_certified_certificate.pdf',
    verificationUrl: 'https://courses.redteamleaders.com/exam-completion/e7e633ee7676077d',
    description: 'Completed certification according to the supplied certificate.',
  },
  {
    id: 'cosa',
    name: 'COSA — details pending original certificate',
    category: 'Technical Training',
    isDraft: true,
    file: './certificates/COSA-TCL-CERT-05-698BC2F081.pdf',
    description: 'Add the official name, issuer, date, credential ID, and source file once the original certificate is available.',
  },
  {
    id: 'karirnex',
    name: 'KarirNex Excel — official title pending source document',
    issuer: 'KarirNex · Batch 8',
    category: 'Technical Training',
    isDraft: true,
    description: 'The exact course title and issue date will be displayed from the original certificate.',
  },
  {
    id: 'illustrator',
    name: 'Adobe Illustrator training — official title pending source document',
    category: 'Design Tools',
    isDraft: true,
    description: 'Display as training or participation documentation according to the original document.',
  },
]

export const experience: ExperienceItem[] = [
  {
    period: 'June 2, 2026 — July 14, 2026',
    title: 'Kerja Praktik / Internship',
    organization: 'PT Telkom Infranexia',
    location: 'Palembang, Indonesia',
    description:
      'Participated in internship activities involving data validation, spreadsheet-based data standardization, technical documentation, telecommunications infrastructure learning, and FTTH-related network observation.',
    bullets: [
      'Validated tower coordinate point data and used Microsoft Excel formulas to help clean and standardize data.',
      'Assisted with TIF-related social media content and documentation activities related to internship assignments.',
      'Learned about FTTH network configuration from the STO toward the customer and observed the general structure of the access fiber network.',
      'Studied OTDR measurement fundamentals and prepared technical documentation in an FTTH GPON access fiber context.',
    ],
  },
]

export const organizations = [
  {
    name: 'Himpunan Sistem Komputer (HIMASISKO)',
    roles: ['Staff PSDM', 'Ketupel Demisioner', 'Penanggung Jawab Humas PKKMB Jurusan 2025', 'Divisi Acara — SK Inspiratif', 'Divisi Koordinasi Lapangan & Perlengkapan — Himasisko Foundation X Sekolah Kestari'],
    period: 'Dates to confirm',
  },
  {
    name: 'Network Administrator Club (NAC)',
    roles: ['Staff Medinfo'],
    period: '2025—2026',
  },
  {
    name: 'BEM / Techporia',
    roles: ['Volunteer'],
    period: '2024',
  },
  {
    name: 'PKKMB Universitas Sriwijaya 2026',
    roles: ['Konselor — Divisi Kurikulum'],
    period: '2026',
  },
]

export const learningPaths = [
  {
    number: '01',
    title: 'Networking',
    goal: 'Develop a stronger practical foundation for network engineering and network administration.',
    topics: ['IP addressing & subnetting', 'Routing & switching', 'Network administration', 'Troubleshooting fundamentals', 'MikroTik networking', 'FTTH & GPON infrastructure'],
  },
  {
    number: '02',
    title: 'Linux & system administration',
    goal: 'Build practical knowledge of operating and maintaining Linux-based systems.',
    topics: ['Linux command line', 'Users & permissions', 'Linux services', 'Server administration', 'Virtualization', 'System troubleshooting'],
  },
  {
    number: '03',
    title: 'Containerization & cloud infrastructure',
    goal: 'Understand how applications and services are deployed, connected, and maintained in modern infrastructure environments.',
    topics: ['Docker', 'Docker Compose', 'Reverse proxy', 'Load balancing', 'Application deployment', 'Cloud infrastructure fundamentals', 'Infrastructure monitoring'],
  },
]

export const futureGoals = [
  'Networking certifications',
  'MikroTik training and certifications',
  'Advanced Linux administration',
  'Cloud infrastructure',
  'Network monitoring',
  'Infrastructure automation',
  'Cybersecurity fundamentals',
]
