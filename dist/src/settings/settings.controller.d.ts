import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<{
        id: number;
        phone: string | null;
        created_at: Date;
        updated_at: Date;
        support_email: string | null;
        address: string | null;
        site_name: string | null;
        site_slogan: string | null;
        logo_url: string | null;
        favicon_url: string | null;
        contact_email: string | null;
        facebook_url: string | null;
        linkedin_url: string | null;
        twitter_url: string | null;
        youtube_url: string | null;
        footer_text: string | null;
        hero_title: string | null;
        hero_subtitle: string | null;
        hero_button_text: string | null;
        about_title: string | null;
        about_description: string | null;
    }>;
    updateSettings(data: any): Promise<{
        id: number;
        phone: string | null;
        created_at: Date;
        updated_at: Date;
        support_email: string | null;
        address: string | null;
        site_name: string | null;
        site_slogan: string | null;
        logo_url: string | null;
        favicon_url: string | null;
        contact_email: string | null;
        facebook_url: string | null;
        linkedin_url: string | null;
        twitter_url: string | null;
        youtube_url: string | null;
        footer_text: string | null;
        hero_title: string | null;
        hero_subtitle: string | null;
        hero_button_text: string | null;
        about_title: string | null;
        about_description: string | null;
    }>;
    uploadLogo(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    uploadFavicon(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    removeLogo(): Promise<{
        success: boolean;
    }>;
    removeFavicon(): Promise<{
        success: boolean;
    }>;
}
