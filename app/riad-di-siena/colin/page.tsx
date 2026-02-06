import { Metadata } from "next";
import Image from "next/image";
import dynamic from "next/dynamic";

const DesertDustRouteMap = dynamic(() => import("@/components/DesertDustRouteMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[450px] bg-[#f5f0e8] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Desert & Dust Loop | A Gift for Colin DeVillers",
  description: "A curated motorcycle adventure through the Atlas foothills and Agafay Desert.",
  robots: "noindex, nofollow",
};

export default function ColinItineraryPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero - Immersive */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-end">
        <Image
          src="https://res.cloudinary.com/drstfu5yr/image/upload/v1769870529/motorbike_nmjsx0.png"
          alt="Motorcycle ride through Morocco"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative z-10 container mx-auto px-8 md:px-16 lg:px-20 pb-16 md:pb-24">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-4">
            A Suggested Motorcycle Ride from Marrakech
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-white leading-[1.1] max-w-3xl mb-4">
            The "Desert & Dust" Loop
          </h1>
          <p className="text-white/50 text-sm tracking-[0.15em] uppercase">
            For Mr. & Mrs. Colin DeVillers
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="max-w-3xl">
            <p className="text-foreground/80 leading-relaxed text-lg">
              This 1-day loop (~160km) takes you from the lush green foothills of the Atlas
              into the Martian landscapes of the Agafay Desert.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-6">
            Your Route
          </p>
          <DesertDustRouteMap />
          <p className="text-center text-sm text-foreground/50 mt-4">
            ~160km loop • Perfect for a Royal Enfield Interceptor 650
          </p>
        </div>
      </section>

      {/* Bike Options */}
      <section className="py-20 md:py-28 bg-[#f5f2ed]">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="max-w-4xl">
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-8">
              The Bikes
            </p>

            <div className="space-y-12">
              <div>
                <h3 className="font-serif text-xl md:text-2xl mb-3">The Stylist's Choice</h3>
                <p className="text-[11px] tracking-[0.15em] uppercase text-foreground/40 mb-4">
                  Royal Enfield Interceptor 650
                </p>
                <p className="text-foreground/60 leading-relaxed">
                  The most common 'Modern Classic' here. It's a 650cc twin-cylinder that sounds
                  great and looks the part for a ride out to the Agafay Desert.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xl md:text-2xl mb-3">The Power Match</h3>
                <p className="text-[11px] tracking-[0.15em] uppercase text-foreground/40 mb-4">
                  BMW F900GS
                </p>
                <p className="text-foreground/60 leading-relaxed">
                  While it's an adventure-style bike rather than a cafe racer, it will match the
                  900cc power you're used to and is arguably the most comfortable way to handle
                  Moroccan road conditions.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xl md:text-2xl mb-3">The "Slow-Burn" Classic</h3>
                <p className="text-[11px] tracking-[0.15em] uppercase text-foreground/40 mb-4">
                  Royal Enfield Classic 350
                </p>
                <p className="text-foreground/60 leading-relaxed">
                  These are everywhere. Low-power (20hp) but very charming if you just want to
                  'thump' along at a relaxed pace through the palm groves.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Morning */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="max-w-3xl">
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-4">
              Morning
            </p>
            <h2 className="font-serif text-2xl md:text-3xl mb-8">
              The Ascent: Marrakech → Asni
            </h2>

            <div className="space-y-8">
              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-foreground/40 mb-2">
                  Start — 9:00 AM
                </p>
                <p className="text-foreground/60 leading-relaxed">
                  Depart Marrakech heading South toward Tahanaout. The road (R203) starts straight
                  but quickly begins to twist as you enter the High Atlas foothills.
                </p>
              </div>

              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-foreground/40 mb-2">
                  The Coffee Stop
                </p>
                <p className="text-foreground/60 leading-relaxed">
                  Stop in Tahanaout for a quick mint tea. The red clay architecture here looks
                  incredible against the backdrop of a classic bike.
                </p>
              </div>

              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-foreground/40 mb-2">
                  The Ride
                </p>
                <p className="text-foreground/60 leading-relaxed">
                  Continue toward Asni. This section features "sweepies"—wide, fast curves that
                  are much more fun on a 650cc+ bike than a small scooter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Midday */}
      <section className="py-20 md:py-28 bg-[#f5f2ed]">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="max-w-3xl">
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-4">
              Midday
            </p>
            <h2 className="font-serif text-2xl md:text-3xl mb-8">
              The Valley & The Dam: Asni → Lalla Takerkoust
            </h2>

            <div className="space-y-8">
              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-foreground/40 mb-2">
                  The Turn
                </p>
                <p className="text-foreground/60 leading-relaxed">
                  At Asni, take the road toward Moulay Brahim. You'll climb a series of switchbacks
                  that offer a literal bird's-eye view of the valleys below.
                </p>
              </div>

              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-foreground/40 mb-2">
                  Lunch at the Lake
                </p>
                <p className="text-foreground/60 leading-relaxed mb-4">
                  Ride down to Lake Lalla Takerkoust.
                </p>
                <div className="p-4 border-l-2 border-foreground/20">
                  <p className="text-sm text-foreground/70 italic">
                    Recommend lunch at Le Relais du Lac. You can park your bike right by the water
                    and enjoy a tagine with a view of the snow-capped Atlas peaks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Afternoon */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="max-w-3xl">
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-4">
              Afternoon
            </p>
            <h2 className="font-serif text-2xl md:text-3xl mb-8">
              The "Mars" Surface: Agafay Desert
            </h2>

            <div className="space-y-8">
              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-foreground/40 mb-2">
                  The Landscape
                </p>
                <p className="text-foreground/60 leading-relaxed mb-4">
                  From the lake, head into the Agafay Desert. This isn't sand dunes (like the Sahara);
                  it's "stony desert" with rolling white hills.
                </p>
                <div className="p-4 border-l-2 border-foreground/20">
                  <p className="text-sm text-foreground/70 italic">
                    Geologically, this is a hammada—a barren, rocky plateau swept clean by wind.
                    The Berbers call it the "stone desert." It feels like riding on the surface of the moon.
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-foreground/40 mb-2">
                  The Photo-Op
                </p>
                <p className="text-foreground/60 leading-relaxed">
                  The "piste" (dirt tracks) here are hard-packed and very manageable for a cafe racer.
                  This is the best place for that "hero shot" of you and your bike in the middle of nowhere.
                </p>
              </div>

              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-foreground/40 mb-2">
                  Golden Hour
                </p>
                <p className="text-foreground/60 leading-relaxed mb-4">
                  Aim to be riding through Agafay as the sun begins to dip. The light turns the hills
                  a deep orange.
                </p>
                <div className="p-4 border-l-2 border-foreground/20">
                  <p className="text-sm text-foreground/70 italic">
                    Since it's winter, sunset comes early—around 6pm. You could easily linger for
                    the full show before cruising back to Marrakech under the first stars.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Evening */}
      <section className="py-20 md:py-28 bg-[#f5f2ed]">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="max-w-3xl">
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-4">
              Evening
            </p>
            <h2 className="font-serif text-2xl md:text-3xl mb-8">
              The City Return
            </h2>

            <p className="text-foreground/60 leading-relaxed">
              A straight, easy 45-minute cruise back into Marrakech via the Avenue Mohammed VI.
              It's a grand, palm-lined entrance back into the city to cap off the day.
            </p>
          </div>
        </div>
      </section>

      {/* Summary Table */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="max-w-4xl">
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-8">
              Route Summary
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="py-4 pr-6 text-[11px] tracking-[0.15em] uppercase text-foreground/40 font-normal">
                      Segment
                    </th>
                    <th className="py-4 pr-6 text-[11px] tracking-[0.15em] uppercase text-foreground/40 font-normal">
                      Highlights
                    </th>
                    <th className="py-4 text-[11px] tracking-[0.15em] uppercase text-foreground/40 font-normal">
                      Road Condition
                    </th>
                  </tr>
                </thead>
                <tbody className="text-foreground/70">
                  <tr className="border-b border-foreground/10">
                    <td className="py-4 pr-6 font-medium">Marrakech to Asni</td>
                    <td className="py-4 pr-6">Foothills & red clay villages</td>
                    <td className="py-4">Smooth, winding tarmac</td>
                  </tr>
                  <tr className="border-b border-foreground/10">
                    <td className="py-4 pr-6 font-medium">Asni to Takerkoust</td>
                    <td className="py-4 pr-6">High Atlas switchbacks</td>
                    <td className="py-4">Narrow, technical curves</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-6 font-medium">Agafay Desert</td>
                    <td className="py-4 pr-6">Lunar landscapes & lake views</td>
                    <td className="py-4">Hard-packed dirt / open road</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-20 md:py-28 bg-[#1a1916] text-white">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl leading-[1.3] text-white/90">
              Enjoy the ride, Colin.
            </p>
          </div>
        </div>
      </section>

      {/* Start the Conversation CTA */}
      <section className="py-24 md:py-32 bg-[#f5f2ed]">
        <div className="container mx-auto px-8 md:px-16 lg:px-20 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
            This journey is a starting point.
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto mb-10 text-sm md:text-base leading-relaxed">
            These itineraries aren't fixed. They're designed to bend. Add a day in the desert.
            Skip the city. Stay longer where something pulls you. This is your journey—we shape it
            around what matters to you.
          </p>
          <a
            href="/plan-your-trip"
            className="inline-block bg-foreground text-background px-10 py-4 text-xs tracking-[0.15em] uppercase hover:bg-foreground/90 transition-colors"
          >
            Start the Conversation
          </a>
        </div>
      </section>
    </div>
  );
}
