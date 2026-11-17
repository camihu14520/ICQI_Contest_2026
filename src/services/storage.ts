import { CompetitionRegistration, ReviewStatus } from '../types/competition';

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
  spreadsheetId: '18APyNoO07AO4ZxM1QIrwCi0EzSHntOvBVc1C7sMFWdM',
  spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/18APyNoO07AO4ZxM1QIrwCi0EzSHntOvBVc1C7sMFWdM/edit',
  coordinatorEmail: 'icqi@cycu.edu.tw',
  autoSyncToSheet: true,
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
