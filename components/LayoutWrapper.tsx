"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import Chatbot from "./Chatbot";

// Routes that should NOT have the main header/footer
const LANDING_PAGE_ROUTES = ["/go"];

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if current path starts with any landing page route
  const isLandingPage = LANDING_PAGE_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isLandingPage) {
    // Landing pages handle their own header/footer
    return <>{children}</>;
  }

  // Regular pages get the main header/footer
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <Chatbot />
    </>
  );
}
