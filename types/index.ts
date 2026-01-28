// =====================================================
// Type Definitions cho TSC Application
// =====================================================

// Vị trí ứng tuyển (major)
export type ApplicationMajor = 'dev' | 'design' | 'content' | 'other';

// Trạng thái đơn ứng tuyển (theo Supabase ENUM)
export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';

// Đơn ứng tuyển từ form Talent Pool
export interface Application {
    id: string;
    full_name: string;
    phone: string;
    email: string;
    university?: string;          // Optional theo schema
    major: ApplicationMajor;      // Đổi từ position thành major
    portfolio_link?: string;      // Đổi từ portfolio_url
    status: ApplicationStatus;
    created_at: string;
}

// Form data khi submit
export interface ApplicationFormData {
    full_name: string;
    phone: string;
    email: string;
    university?: string;
    major: ApplicationMajor;
    portfolio_link?: string;
}

// Props cho Section components
export interface SectionProps {
    className?: string;
    id?: string;
}

// Timeline step cho IPIAL
export interface TimelineStep {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
}

// Service item cho Bento Grid
export interface ServiceItem {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    size: 'large' | 'medium' | 'small';
}

// Core value card
export interface CoreValue {
    letter: string;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ReactNode;
}

// SDG Card
export interface SDGCard {
    sdgNumber: number;
    title: string;
    description: string;
    icon: React.ReactNode;
}

// Mentor info
export interface Mentor {
    id: string;
    name: string;
    role: string;
    avatar?: string;
}

// Navigation link
export interface NavLink {
    href: string;
    label: string;
}

interface Job {
    title: string;
    description: string;
    location: string;
    requiredSkills: string[];
}

export interface Feedback {
    overallScore: number;
    ATS: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
        }[];
    };
    toneAndStyle: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    content: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    structure: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    skills: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    lineImprovements: LineImprovement[];
    coldOutreachMessage?: string;
}

export interface LineImprovement {
    section: "summary" | "experience" | "education" | "skills" | "other";
    sectionTitle: string;
    original: string;
    suggested: string;
    reason: string;
    priority: "high" | "medium" | "low";
    category: "quantify" | "action-verb" | "keyword" | "clarity" | "ats";
}

export interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    jobDescription?: string;
    resumeMarkdown?: string;
    feedback: Feedback | null;
    cvUrl?: string;
}

