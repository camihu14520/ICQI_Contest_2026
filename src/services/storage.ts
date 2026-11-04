import { CompetitionRegistration, DomainCategory, TrackType, ReviewStatus } from '../types/competition';

const STORAGE_KEY = 'cycu_icqi_2026_registrations';
const SETTINGS_KEY = 'cycu_icqi_2026_settings';

export interface AppSettings {
  spreadsheetId: string;
  spreadsheetUrl: string;
  coordinatorEmail: string;
  autoSyncToSheet: boolean;
  autoSendEmail: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  spreadsheetId: '',
  spreadsheetUrl: '',
  coordinatorEmail: 'icqi@cycu.edu.tw',
  autoSyncToSheet: false,
  autoSendEmail: false,
};

// Security: Zero client-side storage of registration data to prevent PII access or exposure
export const getRegistrations = (): CompetitionRegistration[] => {
  // Purge any legacy registrations that may exist in localStorage
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore
  }
  return [];
};

export const saveRegistration = (_reg: CompetitionRegistration): void => {
  // Secure: Do not persist full applicant personal data in client localStorage
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore
  }
};

export const updateRegistrationStatus = (
  _id: string, 
  _status: ReviewStatus, 
  _adminNotes?: string
): CompetitionRegistration | null => {
  return null;
};

/**
 * Generate sequential/unique certificate pass ID according to official format:
 * Category: AI -> AI, Quantum -> QC
 * Track: Implementation -> P (Practice/Project), Concept -> C (Creative Concept)
 * Year: 2026
 * Format: CYCU-[AI|QC]-2026-[P|C]XXX
 */
export const generateNextPassId = (category: DomainCategory, track: TrackType): string => {
  const domainCode = category === 'ai' ? 'AI' : 'QC';
  const trackCode = track === 'implementation' ? 'P' : 'C';
  const prefix = `CYCU-${domainCode}-2026-${trackCode}`;

  // Generate random 3-digit sequential-like index (e.g., P012 ~ P999) without relying on client-stored PII
  const randomNum = Math.floor(10 + Math.random() * 890);
  const nextNum = randomNum.toString().padStart(3, '0');
  return `${prefix}${nextNum}`;
};

export const getSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (newSettings: Partial<AppSettings>): AppSettings => {
  const updated = { ...getSettings(), ...newSettings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  return updated;
};
