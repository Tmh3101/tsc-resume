// =====================================================
// Template Table Types
// =====================================================

export interface Template {
    id: string;
    name: string;
    description: string | null;
    thumbnail_url: string | null;
    layout: "classic" | "modern" | "left-right" | "professional" | "timeline";
    color_scheme: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
    };
    spacing: {
        sectionGap: number;
        itemGap: number;
        contentPadding: number;
    };
    basic_config: {
        layout?: "left" | "center" | "right";
    };
    is_active: boolean;
    is_premium: boolean;
    created_at: string;
    updated_at: string;
}

// Insert type
export interface TemplateInsert {
    id: string;
    name: string;
    description?: string | null;
    thumbnail_url?: string | null;
    layout: "classic" | "modern" | "left-right" | "professional" | "timeline";
    color_scheme: Template["color_scheme"];
    spacing: Template["spacing"];
    basic_config?: Template["basic_config"];
    is_active?: boolean;
    is_premium?: boolean;
}

// Update type
export interface TemplateUpdate {
    name?: string;
    description?: string | null;
    thumbnail_url?: string | null;
    layout?: "classic" | "modern" | "left-right" | "professional" | "timeline";
    color_scheme?: Template["color_scheme"];
    spacing?: Template["spacing"];
    basic_config?: Template["basic_config"];
    is_active?: boolean;
    is_premium?: boolean;
}
