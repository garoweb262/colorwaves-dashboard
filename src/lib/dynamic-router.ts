import {
  getSolutions,
  getSolutionSlugs,
  getProducts,
  getProductSlugs,
  getNewsroomPosts,
  getNewsroomSlugs,
  getJobOpenings,
  getJobSlugs,
} from "@/lib/services/api";

export interface Route {
  locale: string;
  pathname: string;
  params: Record<string, string>;
}

export class DynamicRouter {
  /**
   * Get all possible routes for a specific locale
   */
  async getRoutesByLanguage(locale: string): Promise<string[]> {
    const routes: string[] = [];

    try {
      // Solutions routes
      const solutionsResponse = await getSolutions();
      for (const solution of solutionsResponse.data) {
        routes.push(`/solutions/${solution.category}/${solution.slug}`);
      }

      // Products routes
      const productsResponse = await getProducts();
      for (const product of productsResponse.data) {
        routes.push(`/products/${product.category}/${product.slug}`);
      }

      // Newsroom routes
      const postsResponse = await getNewsroomPosts();
      for (const post of postsResponse.data) {
        routes.push(`/newsroom/${post.category}/${post.slug}`);
      }

      // Careers routes
      const jobsResponse = await getJobOpenings();
      for (const job of jobsResponse.data) {
        routes.push(`/careers/${job.slug}`);
      }
    } catch (error) {
      console.error("Error getting routes for locale:", locale, error);
    }

    return routes;
  }

  /**
   * Map a pathname to a route object
   */
  mapPathToRoute(locale: string, pathname: string): Route {
    const segments = pathname.split("/").filter(Boolean);

    return {
      locale,
      pathname,
      params: {
        locale,
        path: segments.join("/"),
      },
    };
  }

  /**
   * Get all static params for static generation
   */
  async getAllStaticParams(): Promise<
    Array<{ locale: string; path: string[] }>
  > {
    const locales = ["en", "id"]; // Add your locales here
    const allParams: Array<{ locale: string; path: string[] }> = [];

    for (const locale of locales) {
      try {
        // Solutions
        const solutionsResponse = await getSolutions();
        for (const solution of solutionsResponse.data) {
          allParams.push({
            locale,
            path: ["solutions", solution.category, solution.slug],
          });
        }

        // Products
        const productsResponse = await getProducts();
        for (const product of productsResponse.data) {
          allParams.push({
            locale,
            path: ["products", product.category, product.slug],
          });
        }

        // Newsroom
        const postsResponse = await getNewsroomPosts();
        for (const post of postsResponse.data) {
          allParams.push({
            locale,
            path: ["newsroom", post.category, post.slug],
          });
        }

        // Careers
        const jobsResponse = await getJobOpenings();
        for (const job of jobsResponse.data) {
          allParams.push({
            locale,
            path: ["careers", job.slug],
          });
        }
      } catch (error) {
        console.error(
          "Error generating static params for locale:",
          locale,
          error
        );
      }
    }

    return allParams;
  }
}

export const dynamicRouter = new DynamicRouter();
