import { BasicInfo, Education, Experience, Project, CustomItem, MenuSection, GlobalSettings } from "../resume";

// =====================================================
// Resume Table Types
// =====================================================

export interface Resume {
    id: string;
    user_id: string;
    template_id: string | null;
    title: string;
    basic_info: BasicInfo;
    education: Education[];
    experience: Experience[];
    projects: Project[];
    skill_content: string | null;
    custom_data: Record<string, CustomItem[]>;
    menu_sections: MenuSection[];
    global_settings: GlobalSettings;
    is_public: boolean;
    is_deleted: boolean;
    last_edited_at: string;
    created_at: string;
    updated_at: string;
}

// Insert type (không có id, created_at, updated_at)
export interface ResumeInsert {
    user_id: string;
    template_id?: string | null;
    title?: string;
    basic_info?: BasicInfo;
    education?: Education[];
    experience?: Experience[];
    projects?: Project[];
    skill_content?: string | null;
    custom_data?: Record<string, CustomItem[]>;
    menu_sections?: MenuSection[];
    global_settings?: GlobalSettings;
    is_public?: boolean;
}

// Update type (tất cả optional trừ id)
export interface ResumeUpdate {
    template_id?: string | null;
    title?: string;
    basic_info?: BasicInfo;
    education?: Education[];
    experience?: Experience[];
    projects?: Project[];
    skill_content?: string | null;
    custom_data?: Record<string, CustomItem[]>;
    menu_sections?: MenuSection[];
    global_settings?: GlobalSettings;
    is_public?: boolean;
    is_deleted?: boolean;
    last_edited_at?: string;
}