import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { getWebsiteSettings, getWebsiteTeam } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "About Us | Slow Morocco",
  description:
    "The most profound journeys happen not when you see more, but when you see clearly. Slow Morocco exists for travelers who recognize that depth requires time.",
  openGraph: {
    title: "About Slow Morocco",
    description:
      "The most profound journeys happen not when you see more, but when you see clearly.",
    url: "https://slowmorocco.com/about",
  },
  alternates: {
    canonical: "https://slowmorocco.com/about",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface TeamMember {
  id: string;
  name: string;
  role: string;
  quote: string;
  bio: string;
  image: string;
}

async function getAboutContent() {
  try {
    const settingsData = await getWebsiteSettings();
    const settings: { [key: string]: string } = {};
    settingsData.forEach((row) => {
      if (row.key) settings[row.key] = row.value || "";
    });

    const teamData = await getWebsiteTeam({ published: true });
    const team = teamData
      .sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99))
      .map((t) => ({
        id: t.team_id || "",
        name: t.name || "",
        role: t.role || "",
        quote: t.quote || "",
        bio: t.bio || "",
        image: t.image_url || "",
      }));

    return {
      settings,
      team: team as TeamMember[],
    };
  } catch (error) {
    console.error("Error fetching about content:", error);
    return { settings: {}, team: [] };
  }
}

export default async function AboutPage() {
  const { settings, team } = await getAboutContent();

  return (
    <div className="bg-background min-h-screen">
      {/* Immersive Hero with Founder Quote */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center">
        {/* Background Image */}
        {settings.about_hero_image ? (
          <Image
            src={settings.about_hero_image}
            alt="Morocco"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[#8B7355]" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40" />

        {/* Content - Centered Quote */}
        <div className="relative z-10 container mx-auto px-8 md:px-16 lg:px-20 text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-8">
            About Us
          </p>
          <blockquote className="font-serif text-2xl md:text-4xl lg:text-5xl text-white leading-[1.2] max-w-4xl mx-auto mb-6">
            "The most profound journeys happen not when you see more, but when you see clearly."
          </blockquote>
          <p className="text-white/60 text-sm tracking-[0.15em] uppercase">
            — Jacqueline Ng, Founder
          </p>
        </div>
      </section>

      {/* Opening */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="max-w-3xl">
            <p className="text-foreground/60 leading-relaxed text-lg mb-8">
              Many come to Morocco seeking depth, not content to post.
            </p>
            <p className="text-foreground/60 leading-relaxed text-lg mb-8">
              What we learned was simple: the most profound journeys happen not 
              when you see more, but when you see clearly. When you stop performing 
              and start noticing. When you remove the rush and discover what remains.
            </p>
            <p className="text-foreground/80 leading-relaxed text-lg font-medium">
              Slow Morocco exists for travelers who recognize that depth requires 
              time, and clarity requires space.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Quote */}
      <section className="py-20 md:py-28 bg-[#f5f2ed]">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl leading-[1.3] text-foreground/80">
              "Morocco has its own wisdom, its own pace, its own way of revealing 
              itself. Our job is to get out of the way while making sure you're 
              comfortable, safe, and free to wander."
            </blockquote>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="max-w-3xl">
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-8">
              How We Work
            </p>
            
            <p className="text-foreground/60 leading-relaxed text-lg mb-8">
              We don't design trips to look impressive on paper. We design them 
              to feel good while you're living them.
            </p>
            
            <p className="text-foreground/60 leading-relaxed text-lg mb-8">
              We start with time, not a checklist. Most tours squeeze places into 
              days. We do the opposite: shape routes around realistic distances, 
              fewer hotel changes, and days that leave room to breathe.
            </p>
            
            <p className="text-foreground/60 leading-relaxed text-lg">
              We don't believe in selling dreams. We believe in creating conditions 
              for discovery.
            </p>
          </div>
        </div>
      </section>

      {/* Image Break */}
      <section className="relative h-[50vh] md:h-[60vh]">
        {settings.about_image_2 ? (
          <Image
            src={settings.about_image_2}
            alt="Morocco"
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#c4bdb4]" />
        )}
      </section>

      {/* The Promise */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="max-w-3xl">
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-8">
              What We Promise
            </p>
            
            <p className="text-foreground/60 leading-relaxed text-lg mb-8">
              Every guide we work with, every riad we recommend, every road we 
              suggest—it's all been walked by us first. We don't recommend what 
              we haven't experienced. We don't promise what we can't deliver.
            </p>
            
            <p className="text-foreground/60 leading-relaxed text-lg">
              Before you commit, you see exactly what each day involves—drive times, 
              where it's heavy and where it's light, what's included and what's not. 
              If something feels too dense, we adjust. You book when the trip makes 
              sense in your body, not when we've worn you down with sales talk.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {team.length > 0 && (
        <section className="py-20 md:py-28 bg-[#f5f2ed]">
          <div className="container mx-auto px-8 md:px-16 lg:px-20">
            <div className="mb-16">
              <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-4">
                The Team
              </p>
              <h2 className="font-serif text-3xl md:text-4xl">
                The people behind the journeys
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {team.map((member) => (
                <div key={member.id}>
                  <div className="aspect-square relative mb-6 bg-[#d4cdc4] overflow-hidden">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#c4bdb4]" />
                    )}
                  </div>
                  <h3 className="font-serif text-xl mb-1">{member.name}</h3>
                  <p className="text-[11px] tracking-[0.15em] uppercase text-foreground/40 mb-4">
                    {member.role}
                  </p>
                  {member.quote && (
                    <p className="text-sm text-foreground/60 italic leading-relaxed">
                      "{member.quote}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final thought */}
      <section className="py-20 md:py-28 bg-[#1a1916] text-white">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl leading-[1.3] text-white/90">
              The longer you stay in one place, the more layers reveal themselves—the 
              hidden courtyards, the conversations, the rhythms that tourists never see.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-8 md:px-16 lg:px-20 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
            Ready to go slowly?
          </h2>
          <p className="text-foreground/60 max-w-lg mx-auto mb-10 text-sm leading-relaxed">
            No forms. No packages. Just a conversation about what you're hoping to find.
          </p>
          <Link
            href="/plan-your-trip"
            className="inline-block border border-foreground px-10 py-4 text-xs tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-colors"
          >
            Plan your trip
          </Link>
        </div>
      </section>
    </div>
  );
}
