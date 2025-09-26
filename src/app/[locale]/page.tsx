import { getTranslations } from "next-intl/server";
import { renderContent } from "@/app/resources";

import { Hero } from "@/amal-ui/components";

export default async function HomePage() {
  const t = await getTranslations();
  const { home } = renderContent(t);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        variant="level1"
        title={home.hero.title}
        tagline={home.hero.tagline}
        cta={{
          text: home.hero.cta.text,
          href: home.hero.cta.href,
          variant: home.hero.cta.variant as "primary" | "secondary" | "outline",
        }}
        background={{
          type: "image" as const,
          src: "/images/circuit-board.webp",
          alt: "Circuit Board Technology",
          overlay: true,
          overlayColor: "bg-amaltech-blue/30",
        }}
        animation="fadeIn"
        animationDelay={0.2}
      />
    </div>
  );
}
