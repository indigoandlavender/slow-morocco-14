import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Anti-Tourism Manifesto",
  description:
    "Slow Morocco exists because we got tired of watching it. Twenty years of networks. The people who don't advertise. We introduce you. That's it.",
  openGraph: {
    title: "The Anti-Tourism Manifesto | Slow Morocco",
    description:
      "Slow Morocco exists because we got tired of watching it. Twenty years of networks. We introduce you. That's it.",
    url: "https://slowmorocco.com/manifesto",
  },
  alternates: {
    canonical: "https://slowmorocco.com/manifesto",
  },
};

export default function ManifestoPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[url('/images/texture-grain.png')] opacity-[0.03] pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl relative z-10">
          <p className="text-xs tracking-[0.4em] uppercase text-foreground/40 mb-8 text-center">
            Slow Morocco
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-center leading-tight mb-6">
            The Anti-Tourism Manifesto
          </h1>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/0 via-white/20 to-white/0" />
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 md:py-32 border-t border-foreground/10">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-foreground/70 font-serif">
            The carpet merchant will tell you it's antique. It isn't. The guide
            will take you to his cousin's shop. The hotel will call the rooftop
            'authentic Marrakech' while serving the same tagine as every other
            rooftop.
          </p>
        </div>
      </section>

      {/* The Statement */}
      <section className="py-24 md:py-32 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl text-center">
          <p className="text-3xl md:text-4xl lg:text-5xl font-serif italic text-white/90 leading-tight">
            Slow Morocco exists because we got tired of watching it.
          </p>
        </div>
      </section>

      {/* The Network */}
      <section className="py-24 md:py-32 border-t border-foreground/10">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <div className="space-y-12">
            <p className="text-xl md:text-2xl leading-relaxed text-foreground/70">
              Twenty years of networks.
            </p>
            <div className="space-y-8 text-lg md:text-xl text-foreground/50 leading-relaxed">
              <p>The zellige cutter who learned from his father.</p>
              <p>The Gnawa maalem who doesn't play for tour groups.</p>
              <p>
                The hammam keeper who remembers when there were no tourists at
                all.
              </p>
            </div>
            <p className="text-xl md:text-2xl leading-relaxed text-foreground/70">
              These people don't advertise. They don't need to.
            </p>
          </div>
        </div>
      </section>

      {/* The Promise */}
      <section className="py-32 md:py-40 bg-[#f5f0e8]">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl text-center">
          <p className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1a1a1a]/90 leading-tight">
            We introduce you.
          </p>
          <p className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1a1a1a]/50 mt-4">
            That's it.
          </p>
        </div>
      </section>
    </div>
  );
}
