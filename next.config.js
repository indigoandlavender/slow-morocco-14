/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'eedmcvirivigkuzohafv.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  
  // 301 Redirects for old Squarespace URLs → new Next.js URLs
  // Fixes 179 GSC 404 errors from site migration
  async redirects() {
    return [
      // ============================================
      // PLACE REDIRECTS (old /city → /places/city)
      // ============================================
      { source: '/marrakech', destination: '/places/marrakech', permanent: true },
      { source: '/casablanca', destination: '/places/casablanca', permanent: true },
      { source: '/essaouira', destination: '/places/essaouira', permanent: true },
      { source: '/tangier', destination: '/places/tangier', permanent: true },
      { source: '/tangier-2', destination: '/places/tangier', permanent: true },
      { source: '/rabat', destination: '/places/rabat', permanent: true },
      { source: '/chefchaouen', destination: '/places/chefchaouen', permanent: true },
      { source: '/fes-meknes', destination: '/places/fes', permanent: true },
      { source: '/agadir', destination: '/places/agadir', permanent: true },
      { source: '/dakhla', destination: '/places/dakhla', permanent: true },
      { source: '/oualidia', destination: '/places/oualidia', permanent: true },
      { source: '/el-jadida', destination: '/places/el-jadida', permanent: true },
      { source: '/asilah', destination: '/places/asilah', permanent: true },
      { source: '/tiznit', destination: '/places/tiznit', permanent: true },
      { source: '/taroudant', destination: '/places/taroudant', permanent: true },
      { source: '/tafraoute', destination: '/places/tafraoute', permanent: true },
      { source: '/tata', destination: '/places/tata', permanent: true },
      { source: '/taliouine', destination: '/places/taliouine', permanent: true },
      { source: '/amizmiz', destination: '/places/amizmiz', permanent: true },
      { source: '/ouirgane', destination: '/places/ouirgane', permanent: true },
      { source: '/ourika-valley', destination: '/places/ourika-valley', permanent: true },
      { source: '/agafay', destination: '/places/agafay', permanent: true },
      { source: '/al-hoceima', destination: '/places/al-hoceima', permanent: true },
      { source: '/ergoud-merzouga', destination: '/places/merzouga', permanent: true },
      { source: '/dades-valley-todra-gorge', destination: '/places/dades-valley', permanent: true },
      { source: '/zagora-the-draa-valley', destination: '/places/zagora', permanent: true },
      { source: '/tamegroute-tamnougalt', destination: '/places/tamegroute', permanent: true },
      { source: '/ouarzazate-skoura-details', destination: '/places/ouarzazate', permanent: true },
      { source: '/mhamid-erg-chegaga', destination: '/places/mhamid', permanent: true },
      { source: '/marrakech-beyond', destination: '/places/marrakech', permanent: true },
      { source: '/marrakech-to-erg-chigaga', destination: '/places/marrakech', permanent: true },
      
      // ============================================
      // JOURNEY REDIRECTS (with duration prefix)
      // ============================================
      { source: '/3-day-fes-to-merzouga', destination: '/journeys', permanent: true },
      { source: '/3-day-fes-to-marrakech-via-merzouga', destination: '/journeys', permanent: true },
      { source: '/3-day-marrakech-to-merzouga', destination: '/journeys', permanent: true },
      { source: '/3-day-marrakech-to-the-sahara', destination: '/journeys', permanent: true },
      { source: '/3-day-the-ounila-valley', destination: '/journeys', permanent: true },
      { source: '/3-day-atlas-valleys-escape-three-days-in-the-high-silence', destination: '/journeys', permanent: true },
      { source: '/5-day-agadir-to-erg-chigaga', destination: '/journeys', permanent: true },
      { source: '/5-day-tbourida-by-the-sea-riders-and-the-ocean-wind', destination: '/journeys', permanent: true },
      { source: '/5-day-the-imilchil-weddings-a-festival-of-promise', destination: '/journeys', permanent: true },
      { source: '/6-day-the-romans-in-morocco-stones-of-empire', destination: '/journeys', permanent: true },
      { source: '/7-day-atlas-to-desert-journey-seven-days-between-stone-and-sand', destination: '/journeys', permanent: true },
      { source: '/7-day-northern-morocco-journey-seven-days-of-white-and-blue', destination: '/journeys', permanent: true },
      { source: '/7-day-the-amazigh-weavers-road-the-language-of-wool', destination: '/journeys', permanent: true },
      { source: '/7-day-the-hidden-oases-six-days-of-palm-shade-and-clay', destination: '/journeys', permanent: true },
      { source: '/7-day-the-spice-road-table-of-morocco', destination: '/journeys', permanent: true },
      { source: '/7-day-traditional-medicine-healing-arts', destination: '/journeys', permanent: true },
      { source: '/8-day-mythic-morocco-at-the-edge-of-the-known-world', destination: '/journeys', permanent: true },
      { source: '/8-day-the-coastal-line-sea-and-song', destination: '/journeys', permanent: true },
      { source: '/8-day-the-desert-circle-eight-days-of-earth-and-echo', destination: '/journeys', permanent: true },
      { source: '/8-day-the-northern-line-exile-and-light', destination: '/journeys', permanent: true },
      { source: '/8-day-the-roads-of-transhumance-following-the-shepherds-path', destination: '/journeys', permanent: true },
      { source: '/8-day-the-writers-morocco-voices-in-the-light', destination: '/journeys', permanent: true },
      { source: '/9-day-the-atlas-sanctuaries', destination: '/journeys', permanent: true },
      { source: '/9-day-the-southern-remnants', destination: '/journeys', permanent: true },
      { source: '/10-day-andalusian-crossroads-ten-days-between-cities-and-silence', destination: '/journeys', permanent: true },
      { source: '/10-day-the-rock-art-roads', destination: '/journeys', permanent: true },
      { source: '/10-day-the-southern-oases-caravan-route-ten-days-of-earth-and-memory', destination: '/journeys', permanent: true },
      { source: '/10-day-the-sufi-roads', destination: '/journeys', permanent: true },
      { source: '/12-day-eastern-morocco', destination: '/journeys', permanent: true },
      { source: '/12-day-the-sacred-architecture-of-light', destination: '/journeys', permanent: true },
      { source: '/12-day-the-southern-loop-from-dunes-to-the-sea', destination: '/journeys', permanent: true },
      { source: '/13-day-the-saharan-frontier-twelve-days-of-wind-and-distance', destination: '/journeys', permanent: true },
      { source: '/15-day-the-atlantic-descent-casablanca-to-dakhla', destination: '/journeys', permanent: true },
      { source: '/15-day-the-compass-of-morocco', destination: '/journeys', permanent: true },
      { source: '/15-day-the-slow-journey-across-morocco', destination: '/journeys', permanent: true },
      
      // ============================================
      // JOURNEY REDIRECTS (without duration prefix)
      // ============================================
      { source: '/the-amazigh-weavers-road-the-language-of-wool', destination: '/journeys', permanent: true },
      { source: '/the-anti-atlas-journey-seven-days-of-stone-and-silence', destination: '/journeys', permanent: true },
      { source: '/the-atlantic-descent-casablanca-to-dakhla', destination: '/journeys', permanent: true },
      { source: '/the-atlas-sanctuaries', destination: '/journeys', permanent: true },
      { source: '/the-birds-and-the-wind-moroccos-migration-path', destination: '/journeys', permanent: true },
      { source: '/the-birds-and-the-wind-moroccos-migration-path-1', destination: '/journeys', permanent: true },
      { source: '/the-birds-and-the-wind-moroccos-migration-path-2', destination: '/journeys', permanent: true },
      { source: '/the-birds-and-the-wind-moroccos-migration-path-3', destination: '/journeys', permanent: true },
      { source: '/the-birds-and-the-wind-moroccos-migration-path-4', destination: '/journeys', permanent: true },
      { source: '/the-hidden-oases-six-days-of-palm-shade-and-clay', destination: '/journeys', permanent: true },
      { source: '/the-painters-morocco-light-color-and-solitude', destination: '/journeys', permanent: true },
      { source: '/the-roads-of-transhumance-following-the-shepherds-path', destination: '/journeys', permanent: true },
      { source: '/the-rock-art-roads', destination: '/journeys', permanent: true },
      { source: '/the-romans-in-morocco-stones-of-empire', destination: '/journeys', permanent: true },
      { source: '/the-saharan-frontier-twelve-days-of-wind-and-distance', destination: '/journeys', permanent: true },
      { source: '/the-slow-journey-across-morocco', destination: '/journeys', permanent: true },
      { source: '/the-southern-loop-from-dunes-to-the-sea-1', destination: '/journeys', permanent: true },
      { source: '/the-southern-oases-caravan-route-ten-days-of-earth-and-memory', destination: '/journeys', permanent: true },
      { source: '/the-southern-remnants', destination: '/journeys', permanent: true },
      { source: '/the-spice-road-table-of-morocco', destination: '/journeys', permanent: true },
      { source: '/the-sufi-roads', destination: '/journeys', permanent: true },
      { source: '/the-writers-morocco-voices-in-the-light', destination: '/journeys', permanent: true },
      { source: '/tbourida-by-the-sea-riders-and-the-ocean-wind', destination: '/journeys', permanent: true },
      { source: '/atlantic-road-journey-seven-days-by-the-ocean', destination: '/journeys', permanent: true },
      { source: '/atlas-to-desert-journey-seven-days-between-stone-and-sand', destination: '/journeys', permanent: true },
      { source: '/andalusian-crossroads-ten-days-between-cities-and-silence', destination: '/journeys', permanent: true },
      { source: '/northern-morocco-journey-seven-days-of-white-and-blue', destination: '/journeys', permanent: true },
      { source: '/northern-highlands-journey-seven-days-of-green-silence', destination: '/journeys', permanent: true },
      { source: '/day-trip-from-marrakech-at-benhaddou-and-the-road-of-kasbahs', destination: '/journeys', permanent: true },
      
      // ============================================
      // SAHARA TREK REDIRECTS
      // ============================================
      { source: '/sahara-trek-1-marrakech-to-merzouga-3-days-/-return-to-marrakech', destination: '/journeys', permanent: true },
      { source: '/sahara-trek-2-marrakech-to-erg-chigaga-and-back', destination: '/journeys', permanent: true },
      { source: '/sahara-trek-3-marrakech-to-fs-via-merzouga', destination: '/journeys', permanent: true },
      { source: '/sahara-trek-5-fs-to-marrakech-via-merzouga', destination: '/journeys', permanent: true },
      { source: '/sahara-trek-6-agadir-to-erg-chigaga-and-back', destination: '/journeys', permanent: true },
      { source: '/sahara-trek-7-agadir-to-erg-chigaga-and-back', destination: '/journeys', permanent: true },
      { source: '/sahara-trek-7-agadir-to-erg-chigaga-and-back-1', destination: '/journeys', permanent: true },
      
      // ============================================
      // REGION/CATEGORY PAGES → JOURNEYS
      // ============================================
      { source: '/anti-atlas', destination: '/journeys', permanent: true },
      { source: '/high-atlas', destination: '/journeys', permanent: true },
      { source: '/middle-atlas', destination: '/journeys', permanent: true },
      { source: '/atlas-sahara', destination: '/journeys', permanent: true },
      { source: '/the-sahara-desert', destination: '/journeys', permanent: true },
      { source: '/the-atlas-mountains', destination: '/journeys', permanent: true },
      { source: '/the-atlas-the-mountains-of-morocco', destination: '/journeys', permanent: true },
      { source: '/north-coast', destination: '/journeys', permanent: true },
      { source: '/imperial-cities-middle-atlas', destination: '/journeys', permanent: true },
      { source: '/regions', destination: '/journeys', permanent: true },
      { source: '/special-interests', destination: '/journeys', permanent: true },
      { source: '/epic-journeys', destination: '/journeys', permanent: true },
      { source: '/across-morocco-journeys', destination: '/journeys', permanent: true },
      { source: '/across-morocco-2', destination: '/journeys', permanent: true },
      { source: '/journeys-1', destination: '/journeys', permanent: true },
      { source: '/the-classic-routes-description', destination: '/journeys', permanent: true },
      { source: '/the-elemental-circuits-description', destination: '/journeys', permanent: true },
      { source: '/the-hidden-morocco-description', destination: '/journeys', permanent: true },
      { source: '/the-sacred-roads-description', destination: '/journeys', permanent: true },
      
      // ============================================
      // STATIC PAGE REDIRECTS
      // ============================================
      { source: '/home', destination: '/', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/about-us-main', destination: '/about', permanent: true },
      { source: '/about-2', destination: '/about', permanent: true },
      { source: '/our-approach', destination: '/about', permanent: true },
      { source: '/our-approach-main', destination: '/about', permanent: true },
      { source: '/our-approach-footer', destination: '/about', permanent: true },
      { source: '/our-ethos', destination: '/about', permanent: true },
      { source: '/our-philosophy', destination: '/about', permanent: true },
      { source: '/our-mission', destination: '/about', permanent: true },
      { source: '/our-mission-main', destination: '/about', permanent: true },
      { source: '/founders-note', destination: '/about', permanent: true },
      { source: '/founders-note-main', destination: '/about', permanent: true },
      { source: '/sustainability-and-community', destination: '/about', permanent: true },
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/privacy-policy-1', destination: '/privacy', permanent: true },
      { source: '/terms-of-service', destination: '/terms', permanent: true },
      { source: '/booking-conditions', destination: '/terms', permanent: true },
      { source: '/refund-policy', destination: '/terms', permanent: true },
      { source: '/code-of-conduct', destination: '/terms', permanent: true },
      { source: '/faqs-2', destination: '/faq', permanent: true },
      { source: '/payment', destination: '/plan-your-trip', permanent: true },
      { source: '/appointments', destination: '/plan-your-trip', permanent: true },
      { source: '/travel-gently', destination: '/go/gentle', permanent: true },
      { source: '/places-1', destination: '/places', permanent: true },
      { source: '/es/', destination: '/', permanent: true },
      
      // ============================================
      // JOURNAL → STORIES
      // ============================================
      { source: '/journal', destination: '/stories', permanent: true },
      { source: '/journal/', destination: '/stories', permanent: true },
      { source: '/media', destination: '/stories', permanent: true },
      
      // ============================================
      // SQUARESPACE JUNK → HOMEPAGE
      // ============================================
      { source: '/journal/blog-post-title-one-ej23z', destination: '/', permanent: true },
      { source: '/journal/blog-post-title-two-5makw', destination: '/', permanent: true },
      { source: '/journal/blog-post-title-two-lkww3', destination: '/', permanent: true },
      { source: '/journal/blog-post-title-three-rnsp4', destination: '/', permanent: true },
      { source: '/journal/blog-post-title-three-agzsl', destination: '/', permanent: true },
      { source: '/journal/blog-post-title-four-tm7fb', destination: '/', permanent: true },
      { source: '/journal/blog-post-title-four-a4aaz', destination: '/', permanent: true },
      { source: '/journal/Blog%20Post%20Title%20One-xfxd6', destination: '/', permanent: true },
      
      // ============================================
      // MISC ORPHAN PAGES
      // ============================================
      { source: '/ait-bahamou', destination: '/', permanent: true },
      { source: '/agadirs-of-the-anti-atlas-the-berber-banks', destination: '/stories', permanent: true },
      { source: '/atlantic-coast-escape-5-days-of-sea-and-silence', destination: '/journeys', permanent: true },
      { source: '/atlantic-south-anti-atlas', destination: '/journeys', permanent: true },
      { source: '/atlas-valleys-escape-three-days-in-the-high-silence', destination: '/journeys', permanent: true },
      { source: '/mythic-morocco-at-the-edge-of-the-known-world', destination: '/journeys', permanent: true },
      { source: '/rif-mountains', destination: '/journeys', permanent: true },
      { source: '/sahara-southern-morocco', destination: '/journeys', permanent: true },
      { source: '/the-anti-atlas-arc', destination: '/journeys', permanent: true },
      { source: '/the-atlantic-coastal-morocco', destination: '/journeys', permanent: true },
      { source: '/the-atlantic-coastal-morocco-1', destination: '/journeys', permanent: true },
      { source: '/the-cities-of-morocco', destination: '/places', permanent: true },
      { source: '/the-coastal-line-sea-and-song', destination: '/journeys', permanent: true },
      { source: '/the-desert-circle-eight-days-of-earth-and-echo', destination: '/journeys', permanent: true },
      { source: '/the-northern-line-exile-and-light', destination: '/journeys', permanent: true },
      { source: '/the-sacred-architecture-of-light', destination: '/journeys', permanent: true },
      { source: '/the-sky-and-the-sand-in-the-footsteps-of-saint-exupry', destination: '/journeys', permanent: true },
      { source: '/the-table-the-vine-i-from-the-mountains-to-the-sea', destination: '/journeys', permanent: true },
      { source: '/the-table-the-vine-ii-the-northern-cellars', destination: '/journeys', permanent: true },
      { source: '/traditional-medicine-healing-arts', destination: '/journeys', permanent: true },
      { source: '/wild-morocco-from-forests-to-the-atlantic', destination: '/journeys', permanent: true },
    ];
  },
};

module.exports = nextConfig;
