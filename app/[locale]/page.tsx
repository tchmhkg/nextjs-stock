import { getTranslations } from "next-intl/server";
import { HomeHero } from "@/components/home-hero";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function HomePage() {
  return <HomeHero />;
}
