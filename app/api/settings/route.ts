import { NextResponse } from "next/server";
import { getWebsiteSettings } from "@/lib/supabase";

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settingsData = await getWebsiteSettings();
    
    // Convert array of {key, value} to object
    const settings: { [key: string]: string } = {};
    settingsData.forEach((row) => {
      if (row.key) {
        settings[row.key] = row.value || "";
      }
    });

    const response = NextResponse.json({
      success: true,
      settings,
    });
    
    // Prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error("Settings fetch error:", error);
    return NextResponse.json(
      { success: false, settings: {}, error: error.message },
      { status: 500 }
    );
  }
}
