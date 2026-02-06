import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Places",
  description: "Discover Morocco's diverse regions — from the imperial cities of Fes and Marrakech to the Sahara Desert, Atlas Mountains, and Atlantic coast. Explore the places that make our journeys unforgettable.",
  openGraph: {
    title: "Places | Slow Morocco",
    description: "Discover Morocco's diverse regions — imperial cities, Sahara Desert, Atlas Mountains, and more.",
    url: "https://slowmorocco.com/places",
  },
  alternates: {
    canonical: "https://slowmorocco.com/places",
  },
};

export default function PlacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
