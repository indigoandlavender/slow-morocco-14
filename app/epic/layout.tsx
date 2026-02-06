import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EPIC Journeys | Sacred & Rare",
  description: "Our most extraordinary Morocco experiences — sacred ceremonies, rare access, and transformative journeys that exist nowhere else. These are not tours. They're initiations.",
  openGraph: {
    title: "EPIC Journeys | Slow Morocco",
    description: "Our most extraordinary Morocco experiences — sacred ceremonies, rare access, and transformative journeys.",
    url: "https://slowmorocco.com/epic",
  },
  alternates: {
    canonical: "https://slowmorocco.com/epic",
  },
};

export default function EpicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
