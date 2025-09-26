import { MetadataRoute } from "next";
import {
  getSolutionSlugs,
  getSolutionCategories,
} from "@/lib/services/api";
import {
  getProductSlugs,
  getProductCategories,
} from "@/lib/services/api";
import { getJobSlugs } from "@/lib/services/api";
import {
  getNewsroomSlugs,
  getNewsroomCategories,
} from "@/lib/services/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://amaltech.com.ng";

  // Get current date for lastModified
  const currentDate = new Date();

  // Base routes for both locales
  const baseRoutes = [
    "",
    "/about",
    "/products",
    "/services",
    "/solutions",
    "/expertise",
    "/capabilities",
    "/newsroom",
    "/careers",
    "/contact",
    "/partners",
  ];

  // Generate routes for both locales
  const routes: MetadataRoute.Sitemap = [];

  ["en", "id"].forEach((locale) => {
    baseRoutes.forEach((route) => {
      routes.push({
        url: `${baseURL}/${locale}${route}`,
        lastModified: currentDate,
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1 : 0.8,
      });
    });
  });

  // Fetch dynamic slugs from server-side functions
  const [solutionSlugs, productSlugs, jobSlugs, newsroomSlugs] =
    await Promise.all([
      getSolutionSlugs(),
      getProductSlugs(),
      getJobSlugs(),
      getNewsroomSlugs(),
    ]);

  // Add solution category pages
  const solutionCategories = await getSolutionCategories();
  ["en", "id"].forEach((locale) => {
    solutionCategories.forEach((category) => {
      routes.push({
        url: `${baseURL}/${locale}/solutions/${category.slug}`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      });
    });
  });

  // Add solution detail pages
  ["en", "id"].forEach((locale) => {
    solutionSlugs.forEach((slug) => {
      routes.push({
        url: `${baseURL}/${locale}/solutions/${slug}`,
        lastModified: currentDate,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      });
    });
  });

  // Add product category pages
  const productCategories = await getProductCategories();
  ["en", "id"].forEach((locale) => {
    productCategories.forEach((category) => {
      routes.push({
        url: `${baseURL}/${locale}/products/${category.slug}`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      });
    });
  });

  // Add product detail pages
  ["en", "id"].forEach((locale) => {
    productSlugs.forEach((slug) => {
      routes.push({
        url: `${baseURL}/${locale}/products/${slug}`,
        lastModified: currentDate,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      });
    });
  });

  // Add job detail pages
  ["en", "id"].forEach((locale) => {
    jobSlugs.forEach((slug) => {
      routes.push({
        url: `${baseURL}/${locale}/careers/${slug}`,
        lastModified: currentDate,
        changeFrequency: "daily" as const,
        priority: 0.6,
      });
    });
  });

  // Add newsroom category pages
  const newsroomCategories = await getNewsroomCategories();
  ["en", "id"].forEach((locale) => {
    newsroomCategories.forEach((category) => {
      routes.push({
        url: `${baseURL}/${locale}/newsroom/${category.slug}`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      });
    });
  });

  // Add newsroom posts
  ["en", "id"].forEach((locale) => {
    newsroomSlugs.forEach((slug) => {
      routes.push({
        url: `${baseURL}/${locale}/newsroom/${slug}`,
        lastModified: currentDate,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    });
  });

  return routes;
}
