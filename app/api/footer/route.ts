import { NextResponse } from "next/server";
import { getWebsiteSettings, getFooterLinks } from "@/lib/supabase";
import { getNexusData } from "@/lib/sheets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_ID = process.env.SITE_ID || "slow-morocco";

function convertGoogleDriveUrl(url: string): string {
  if (!url) return "";
  if (!url.includes("drive.google.com")) return url;

  let fileId = "";
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) fileId = fileMatch[1];

  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) fileId = openMatch[1];

  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920`;
  }
  return url;
}

export async function GET() {
  try {
    let newsletterConfig = {
      show: true,
      backgroundImage: "",
      title: "Notes from Morocco",
      description: "Quiet. Irregular. Real.",
      brandName: "Slow Morocco",
    };

    let contactLinks: { platform: string; url: string; label: string }[] = [];

    try {
      const settingsData = await getWebsiteSettings();
      const settingsMap: { [key: string]: string } = {};
      settingsData.forEach((row) => {
        if (row.key) settingsMap[row.key] = row.value || "";
      });

      newsletterConfig = {
        show: settingsMap.newsletter_show !== "false",
        backgroundImage:
          convertGoogleDriveUrl(settingsMap.newsletter_background_image) ||
          newsletterConfig.backgroundImage,
        title: settingsMap.newsletter_title || newsletterConfig.title,
        description:
          settingsMap.newsletter_description || newsletterConfig.description,
        brandName: settingsMap.brand_name || newsletterConfig.brandName,
      };

      if (settingsMap.contact_email) {
        contactLinks.push({
          platform: "email",
          url: `mailto:${settingsMap.contact_email}`,
          label: settingsMap.contact_email,
        });
      }
      if (settingsMap.contact_whatsapp) {
        contactLinks.push({
          platform: "whatsapp",
          url: `https://wa.me/${settingsMap.contact_whatsapp.replace(/[^0-9]/g, "")}`,
          label: settingsMap.contact_whatsapp,
        });
      }
      if (settingsMap.contact_instagram) {
        contactLinks.push({
          platform: "instagram",
          url: settingsMap.contact_instagram.startsWith("http")
            ? settingsMap.contact_instagram
            : `https://instagram.com/${settingsMap.contact_instagram.replace("@", "")}`,
          label: settingsMap.contact_instagram,
        });
      }
    } catch (e) {
      console.error("Error fetching settings:", e);
    }

    let footerLinks: { column_number: number; column_title: string; link_order: number; link_label: string; link_href: string; link_type: string }[] = [];
    try {
      footerLinks = await getFooterLinks();
    } catch (e) {
      console.error("Error fetching footer links:", e);
    }

    let legalLinks: { label: string; href: string }[] = [];
    let copyrightText = `© ${new Date().getFullYear()} Slow Morocco`;

    try {
      const nexusData = await getNexusData("Footer_Legal");
      const siteRow = nexusData.find(
        (row: { site_id: string }) => row.site_id === SITE_ID
      );
      if (siteRow) {
        if (siteRow.legal_links) {
          try {
            legalLinks = JSON.parse(siteRow.legal_links);
          } catch {
            legalLinks = [];
          }
        }
        if (siteRow.copyright_text) {
          copyrightText = siteRow.copyright_text.replace(
            "{year}",
            new Date().getFullYear().toString()
          );
        }
      }
    } catch (e) {
      console.error("Error fetching Nexus legal data:", e);
    }

    const columnsMap = new Map<
      number,
      { title: string; links: { label: string; href: string; type: string }[] }
    >();

    footerLinks.forEach((row) => {
      const colNum = row.column_number || 1;
      if (!columnsMap.has(colNum)) {
        columnsMap.set(colNum, {
          title: row.column_title || "",
          links: [],
        });
      }
      columnsMap.get(colNum)!.links.push({
        label: row.link_label || "",
        href: row.link_href || "",
        type: row.link_type || "link",
      });
    });

    const columns = Array.from(columnsMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([, col]) => col);

    return NextResponse.json({
      newsletter: newsletterConfig,
      columns,
      contact: contactLinks,
      legal: legalLinks,
      copyright: copyrightText,
    });
  } catch (error) {
    console.error("Error in footer API:", error);
    return NextResponse.json({ error: "Failed to fetch footer" }, { status: 500 });
  }
}
