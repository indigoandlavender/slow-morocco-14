import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation Policy | Slow Morocco",
  description: "Cancellation and refund policy for Slow Morocco journeys.",
};

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
        <p className="text-xs tracking-[0.4em] uppercase text-foreground/40 mb-6">
          Policies
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-white/90 mb-8">Cancellation Policy</h1>
        <p className="text-foreground/50 mb-12 text-lg leading-relaxed">
          We understand that plans can change. Our cancellation policy is designed to be 
          fair while reflecting the commitments we make with our partners on your behalf.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="font-serif text-2xl text-white/90 mb-6">Cancellation by Traveler</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-4 border-b border-foreground/10">
                <span className="text-foreground/50">More than 60 days before departure</span>
                <span className="font-medium text-foreground/80">Full refund minus deposit</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-foreground/10">
                <span className="text-foreground/50">45-60 days before departure</span>
                <span className="font-medium text-foreground/80">50% refund</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-foreground/10">
                <span className="text-foreground/50">30-44 days before departure</span>
                <span className="font-medium text-foreground/80">25% refund</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-foreground/10">
                <span className="text-foreground/50">Less than 30 days before departure</span>
                <span className="font-medium text-foreground/80">No refund</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white/90 mb-4">Deposits</h2>
            <p className="text-foreground/50 leading-relaxed">
              A 30% deposit is required to confirm your booking. This deposit is non-refundable 
              but may be applied to a future journey within 18 months if you cancel more than 
              60 days before departure.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white/90 mb-4">Changes to Your Journey</h2>
            <p className="text-foreground/50 leading-relaxed">
              We'll do our best to accommodate changes to your itinerary, subject to 
              availability. Changes made within 30 days of departure may incur additional 
              fees from our service providers. Significant changes may be treated as a 
              cancellation and rebooking.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white/90 mb-4">Cancellation by Slow Morocco</h2>
            <p className="text-foreground/50 leading-relaxed">
              In the rare event that we must cancel your journey due to circumstances beyond 
              our control (force majeure, safety concerns, etc.), you will receive a full 
              refund or the option to reschedule at no additional cost.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white/90 mb-4">Travel Insurance</h2>
            <p className="text-foreground/50 leading-relaxed">
              We strongly recommend purchasing comprehensive travel insurance that includes 
              trip cancellation coverage. This can protect you from unforeseen circumstances 
              that may require you to cancel or cut short your journey. Please ensure your 
              policy covers the full cost of your trip.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white/90 mb-4">How to Cancel</h2>
            <p className="text-foreground/50 leading-relaxed">
              To cancel your booking, please contact us in writing at hello@slowmorocco.com. 
              Cancellations are effective from the date we receive your written notice. 
              Refunds will be processed within 14 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
