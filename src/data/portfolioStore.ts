import {
  certifications as defaultCertifications,
  experience as defaultExperience,
  organizations as defaultOrganizations,
  portfolioConfig as defaultPortfolioConfig,
  type Certificate,
  type ExperienceItem,
} from './portfolio'

export type PortfolioContent = {
  portfolioConfig: typeof defaultPortfolioConfig
  certifications: Certificate[]
  experience: ExperienceItem[]
  organizations: typeof defaultOrganizations
}

export const PORTFOLIO_STORAGE_KEY = 'floreetha-portfolio-content'

function cloneDefaultContent(): PortfolioContent {
  return {
    portfolioConfig: {
      ...defaultPortfolioConfig,
      contact: { ...defaultPortfolioConfig.contact },
    },
    certifications: defaultCertifications.map((certificate) => ({ ...certificate })),
    experience: defaultExperience.map((item) => ({ ...item, bullets: [...item.bullets] })),
    organizations: defaultOrganizations.map((organization) => ({ ...organization, roles: [...organization.roles] })),
  }
}

export function normalizePortfolioContent(value: unknown): PortfolioContent {
  const defaults = cloneDefaultContent()
  const candidate = value && typeof value === 'object' ? value as Partial<PortfolioContent> : {}

  return {
    portfolioConfig: {
      ...defaults.portfolioConfig,
      ...(candidate.portfolioConfig ?? {}),
      contact: {
        ...defaults.portfolioConfig.contact,
        ...(candidate.portfolioConfig?.contact ?? {}),
      },
    },
    certifications: Array.isArray(candidate.certifications) ? candidate.certifications : defaults.certifications,
    experience: Array.isArray(candidate.experience) ? candidate.experience : defaults.experience,
    organizations: Array.isArray(candidate.organizations) ? candidate.organizations : defaults.organizations,
  }
}

export function loadPortfolioContent(): PortfolioContent {
  if (typeof window === 'undefined') return cloneDefaultContent()

  try {
    const saved = window.localStorage.getItem(PORTFOLIO_STORAGE_KEY)
    return saved ? normalizePortfolioContent(JSON.parse(saved)) : cloneDefaultContent()
  } catch {
    return cloneDefaultContent()
  }
}

export function savePortfolioContent(content: PortfolioContent) {
  window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(content))
}

export function resetPortfolioContent() {
  const defaults = cloneDefaultContent()
  window.localStorage.removeItem(PORTFOLIO_STORAGE_KEY)
  return defaults
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('The selected file could not be read.'))
    })
    reader.addEventListener('error', () => reject(new Error('The selected file could not be read.')))
    reader.readAsDataURL(file)
  })
}
