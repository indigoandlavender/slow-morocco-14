import { MetadataRoute } from 'next'
import { getJourneys, getStories, getPlaces, getDayTrips } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://slowmorocco.com'
  
  // Static pages
  const staticPages = [
    '',
    '/journeys',
    '/stories',
    '/places',
    '/day-trips',
    '/about',
    '/plan-your-trip',
    '/glossary',
    '/guides',
    '/disclaimer',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic pages
  let dynamicPages: MetadataRoute.Sitemap = []

  try {
    // Journeys
    const journeys = await getJourneys({ published: true })
    const journeyPages = journeys.map(journey => ({
      url: `${baseUrl}/journeys/${journey.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    // Stories
    const stories = await getStories({ published: true })
    const storyPages = stories.map(story => ({
      url: `${baseUrl}/story/${story.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // Places
    const places = await getPlaces({ published: true })
    const placePages = places.map(place => ({
      url: `${baseUrl}/places/${place.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // Day Trips
    const dayTrips = await getDayTrips({ published: true })
    const dayTripPages = dayTrips.map(trip => ({
      url: `${baseUrl}/day-trips/${trip.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    dynamicPages = [...journeyPages, ...storyPages, ...placePages, ...dayTripPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
  }

  return [...staticPages, ...dynamicPages]
}
