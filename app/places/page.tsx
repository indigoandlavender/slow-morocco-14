import { Suspense } from "react";
import PlacesContent from "./PlacesContent";

function PlacesLoading() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.4em] uppercase text-foreground/40 mb-6">
              Slow Morocco
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-[0.15em] font-light mb-6">
              P L A C E S
            </h1>
            <p className="text-lg md:text-xl text-foreground/50 max-w-2xl">
              The villages, valleys, and hidden corners that make Morocco worth slowing down for.
            </p>
          </div>
        </div>
      </section>
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    </div>
  );
}

export default function PlacesPage() {
  return (
    <Suspense fallback={<PlacesLoading />}>
      <PlacesContent />
    </Suspense>
  );
}
