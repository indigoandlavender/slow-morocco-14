import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories | Slow Morocco",
  description: "Essays exploring the history, craft, and cultural traditions of Morocco — from Amazigh weavers to Gnawa healers, khettaras to kasbahs.",
  openGraph: {
    title: "Stories | Slow Morocco",
    description: "Essays exploring the history, craft, and cultural traditions of Morocco.",
    type: "website",
  },
};

export default function StoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
