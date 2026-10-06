export type DomainCategory = 'ai' | 'quantum';
export type TrackType = 'implementation' | 'concept'; // 實作組 vs 創意構想組

export type ApplicationField = 
  | '智慧醫療與健康'
  | '量子金融與商務'
  | '工程與科學運算'
  | '智慧社會與公共治理'
  | '前瞻AI創新應用'
  | '國防與永續創新'
  | '其他';

export interface StudentMember {
  name: string;
  school: string;
  department: string;
  grade: string;
  studentId: string;
  phone: string;
  email: string;
}

export interface AdvisorMember {
  name: string;
  institution: string;
  title: string;
  email: string;
  phone: string;
}

export type ReviewStatus = 
  | 'pending'           // 待初審
  | 'reviewing'         // 審核中
  | 'passed_prelim'     // 初審合格
  | 'finalist'          // 決賽入圍
  | 'needs_revision'    // 請補件
  | 'rejected';         // 未通過

export interface CompetitionRegistration {
  id: string; // e.g. CYCU-AI-2026-P001
  category: DomainCategory;
  track: TrackType;
  applicationDomain: ApplicationField;
  projectName: string;
  projectEnName: string;
  abstract: string; // 300-500 words
  teamName: string;
  leader: StudentMember;
  members: StudentMember[]; // 0 to 3
  advisors: AdvisorMember[]; // 1 to 2
  reportDocUrl: string; // 雲端硬碟連結或附件
  consentFormUrl: string; // 著作權授權同意書連結或附件
  demoUrl?: string; // 選填影片或成果連結
  submittedAt: string;
  updatedAt: string;
  status: ReviewStatus;
  adminNotes?: string;
  syncedToGoogleSheet?: boolean;
  emailSent?: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: '資格組隊' | '報告書格式' | '決賽評選' | '表單與通知';
}
