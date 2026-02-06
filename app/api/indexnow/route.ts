import { NextRequest, NextResponse } from "next/server";

const INDEXNOW_KEY = "444430c5e133f87effb18d8fbc14bebd";
const SITE_HOST = "slowmorocco.com";
const BASE_URL = `https://${SITE_HOST}`;

// Static pages that should always be submitted
const STATIC_PAGES = [
  "",
  "/journeys",
  "/stories",
  "/places",
  "/about",
  "/plan-your-trip",
  "/contact",
  "/faq",
  "/manifesto",
  "/whats-included",
  "/visa-info",
  "/day-trips",
  "/guides",
  "/epic",
];

interface Journey {
  slug: string;
}

interface Story {
  slug: string;
}

interface Place {
  slug: string;
}

async function getAllUrls(): Promise<string[]> {
  const urls: string[] = [];

  // Add static pages
  STATIC_PAGES.forEach((page) => {
    urls.push(`${BASE_URL}${page}`);
  });

  // Fetch dynamic journeys
  try {
    const journeysRes = await fetch(`${BASE_URL}/api/journeys`, {
      cache: "no-store",
    });
    if (journeysRes.ok) {
      const data = await journeysRes.json();
      const journeys: Journey[] = data.journeys || [];
      journeys.forEach((j) => {
        if (j.slug) {
          urls.push(`${BASE_URL}/journeys/${j.slug}`);
        }
      });
    }
  } catch (e) {
    console.error("Failed to fetch journeys:", e);
  }

  // Fetch dynamic stories
  try {
    const storiesRes = await fetch(`${BASE_URL}/api/stories`, {
      cache: "no-store",
    });
    if (storiesRes.ok) {
      const data = await storiesRes.json();
      const stories: Story[] = data.stories || [];
      stories.forEach((s) => {
        if (s.slug) {
          urls.push(`${BASE_URL}/story/${s.slug}`);
        }
      });
    }
  } catch (e) {
    console.error("Failed to fetch stories:", e);
  }

  // Fetch dynamic places
  try {
    const placesRes = await fetch(`${BASE_URL}/api/places`, {
      cache: "no-store",
    });
    if (placesRes.ok) {
      const data = await placesRes.json();
      const places: Place[] = data.places || [];
      places.forEach((p) => {
        if (p.slug) {
          urls.push(`${BASE_URL}/places/${p.slug}`);
        }
      });
    }
  } catch (e) {
    console.error("Failed to fetch places:", e);
  }

  return urls;
}

async function submitToIndexNow(urls: string[]): Promise<{
  success: boolean;
  submitted: number;
  error?: string;
}> {
  // IndexNow accepts up to 10,000 URLs per request
  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    // IndexNow returns 200, 202 for success
    if (response.ok || response.status === 202) {
      return { success: true, submitted: urls.length };
    }

    const errorText = await response.text();
    return {
      success: false,
      submitted: 0,
      error: `IndexNow returned ${response.status}: ${errorText}`,
    };
  } catch (e) {
    return {
      success: false,
      submitted: 0,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

// GET: Check status and list URLs that would be submitted
export async function GET(request: NextRequest) {
  const urls = await getAllUrls();

  return NextResponse.json({
    status: "ready",
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlCount: urls.length,
    urls: urls,
  });
}

// POST: Submit URLs to IndexNow
export async function POST(request: NextRequest) {
  // Optional: Add authorization for production
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.INDEXNOW_SECRET;

  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if specific URLs were provided in the body
  let urlsToSubmit: string[];

  try {
    const body = await request.json().catch(() => ({}));
    if (body.urls && Array.isArray(body.urls) && body.urls.length > 0) {
      // Submit only the provided URLs
      urlsToSubmit = body.urls;
    } else {
      // Submit all URLs
      urlsToSubmit = await getAllUrls();
    }
  } catch {
    urlsToSubmit = await getAllUrls();
  }

  const result = await submitToIndexNow(urlsToSubmit);

  if (result.success) {
    return NextResponse.json({
      success: true,
      message: `Successfully submitted ${result.submitted} URLs to IndexNow`,
      submitted: result.submitted,
      urls: urlsToSubmit,
    });
  } else {
    return NextResponse.json(
      {
        success: false,
        error: result.error,
      },
      { status: 500 }
    );
  }
}
