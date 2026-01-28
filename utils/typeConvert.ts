import { ResumeData } from "@/types/resume";
import { Resume, ResumeInsert, ResumeUpdate } from "@/types/db/resume";
import { Template } from "@/types/db/template";
import { ResumeTemplate } from "@/types/template";

/**
 * Chuyển đổi DbResume từ database sang ResumeData của frontend
 */
export function dbResumeToResumeData(dbResume: Resume): ResumeData {
    return {
        id: dbResume.id,
        title: dbResume.title,
        createdAt: dbResume.created_at,
        updatedAt: dbResume.updated_at,
        templateId: dbResume.template_id,
        basic: dbResume.basic_info,
        education: dbResume.education || [],
        experience: dbResume.experience || [],
        projects: dbResume.projects || [],
        skillContent: dbResume.skill_content || "",
        customData: dbResume.custom_data || {},
        menuSections: dbResume.menu_sections || [],
        globalSettings: dbResume.global_settings || {},
        activeSection: "basic",
        draggingProjectId: null,
    };
}

/**
 * Chuyển đổi ResumeData từ frontend sang DbResumeInsert cho database
 */
export function resumeDataToDbInsert(resumeData: Partial<ResumeData>, userId: string): ResumeInsert {
    return {
        user_id: userId,
        template_id: resumeData.templateId ?? null,
        title: resumeData.title ?? "CV mới",
        basic_info: resumeData.basic,
        education: resumeData.education,
        experience: resumeData.experience,
        projects: resumeData.projects,
        skill_content: resumeData.skillContent ?? null,
        custom_data: resumeData.customData,
        menu_sections: resumeData.menuSections,
        global_settings: resumeData.globalSettings,
    };
}

/**
 * Chuyển đổi ResumeData từ frontend sang DbResumeUpdate cho database
 */
export function resumeDataToDbUpdate(resumeData: Partial<ResumeData>): ResumeUpdate {
    const update: ResumeUpdate = {
        last_edited_at: new Date().toISOString(),
    };

    if (resumeData.templateId !== undefined) update.template_id = resumeData.templateId ?? null;
    if (resumeData.title !== undefined) update.title = resumeData.title;
    if (resumeData.basic !== undefined) update.basic_info = resumeData.basic;
    if (resumeData.education !== undefined) update.education = resumeData.education;
    if (resumeData.experience !== undefined) update.experience = resumeData.experience;
    if (resumeData.projects !== undefined) update.projects = resumeData.projects;
    if (resumeData.skillContent !== undefined) update.skill_content = resumeData.skillContent;
    if (resumeData.customData !== undefined) update.custom_data = resumeData.customData;
    if (resumeData.menuSections !== undefined) update.menu_sections = resumeData.menuSections;
    if (resumeData.globalSettings !== undefined) update.global_settings = resumeData.globalSettings;

    return update;
}


/**
 * Chuyển đổi Template từ database sang ResumeTemplate của frontend
 */
export function dbTemplateToResumeTemplate(dbTemplate: Template): ResumeTemplate {
    return {
        id: dbTemplate.id,
        name: dbTemplate.name,
        description: dbTemplate.description || "",
        thumbnail_url: dbTemplate.thumbnail_url || dbTemplate.id,
        layout: dbTemplate.layout,
        colorScheme: dbTemplate.color_scheme,
        spacing: dbTemplate.spacing,
        basic: dbTemplate.basic_config,
    };
}

/**
 * Chuyển đổi ResumeTemplate từ frontend sang Template cho database
 */
export function resumeTemplateToDbInsert(template: ResumeTemplate): Omit<Template, "created_at" | "updated_at" | "is_active" | "is_premium"> {
    return {
        id: template.id,
        name: template.name,
        description: template.description,
        thumbnail_url: template.thumbnail_url,
        layout: template.layout,
        color_scheme: template.colorScheme,
        spacing: template.spacing,
        basic_config: template.basic,
    };
}
