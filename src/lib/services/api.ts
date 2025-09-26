// API Service Layer - Uses route handlers instead of direct functions

// Base API configuration
const API_BASE = "/api";

// Generic fetch function with error handling
async function fetchAPI<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`${API_BASE}${endpoint}`, "http://localhost:3000");

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
  }

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "API request failed");
    }

    return data;
  } catch (error) {
    // During build time, return fallback data
    console.warn(
      `API request failed for ${endpoint}, using fallback data:`,
      error
    );
    return getFallbackData(endpoint) as T;
  }
}

// Fallback data for build time
function getFallbackData(endpoint: string) {
  switch (endpoint) {
    case "/solutions":
      return {
        success: true,
        data: [
          {
            id: "healthcare",
            slug: "healthcare",
            title: "Healthcare Solutions",
            category: "healthcare",
            industry: "Healthcare",
          },
          {
            id: "industrial",
            slug: "industrial",
            title: "Industrial Automation Solutions",
            category: "industrial",
            industry: "Manufacturing",
          },
          {
            id: "communications",
            slug: "communications",
            title: "Communications Solutions",
            category: "communications",
            industry: "Telecommunications",
          },
        ],
        total: 3,
        filters: {},
      };
    case "/products":
      return {
        success: true,
        data: [
          {
            id: "amal-aerio",
            slug: "amal-aerio",
            name: "Amal Aerio",
            category: "iot-gateway",
          },
          {
            id: "smart-energy-meter",
            slug: "smart-energy-meter",
            name: "Smart Energy Meter",
            category: "smart-metering",
          },
          {
            id: "pos-terminal",
            slug: "pos-terminal",
            name: "POS Terminal",
            category: "payment-systems",
          },
        ],
        total: 3,
        filters: {},
      };
    case "/newsroom":
      return {
        success: true,
        data: [
          {
            id: "company-launch",
            slug: "company-launch",
            title: "AmalTech Launches New IoT Platform",
            category: "company-news",
          },
          {
            id: "product-release",
            slug: "product-release",
            title: "New Smart Energy Meter Released",
            category: "product-updates",
          },
          {
            id: "partnership-announcement",
            slug: "partnership-announcement",
            title: "Strategic Partnership Announced",
            category: "partnerships",
          },
        ],
        total: 3,
        filters: {},
      };
    case "/careers":
      return {
        success: true,
        data: [
          {
            id: "senior-engineer",
            slug: "senior-engineer",
            title: "Senior IoT Engineer",
            department: "engineering",
          },
          {
            id: "product-manager",
            slug: "product-manager",
            title: "Product Manager",
            department: "product",
          },
          {
            id: "sales-representative",
            slug: "sales-representative",
            title: "Sales Representative",
            department: "sales",
          },
        ],
        total: 3,
        filters: {},
      };
    default:
      return {
        success: true,
        data: [],
        total: 0,
        filters: {},
      };
  }
}

// Solutions API
export interface Solution {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  industry: string;
  features: string[];
  benefits: string[];
  applications: string[];
  caseStudies: {
    title: string;
    description: string;
    results: string[];
  }[];
  images: string[];
  featuredImage: string;
  isFeatured?: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface SolutionsResponse {
  success: boolean;
  data: Solution[];
  total: number;
  filters: Record<string, string | null>;
}

export async function getSolutions(filters?: {
  category?: string;
  industry?: string;
  isFeatured?: boolean;
  limit?: number;
}): Promise<SolutionsResponse> {
  const params: Record<string, string> = {};

  if (filters?.category) params.category = filters.category;
  if (filters?.industry) params.industry = filters.industry;
  if (filters?.isFeatured !== undefined)
    params.isFeatured = filters.isFeatured.toString();
  if (filters?.limit) params.limit = filters.limit.toString();

  return fetchAPI<SolutionsResponse>("/solutions", params);
}

export async function getSolution(slug: string): Promise<Solution | null> {
  const response = await getSolutions();
  return response.data.find((solution) => solution.slug === slug) || null;
}

// Products API
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  content: string;
  category: string;
  features: string[];
  specifications: Record<string, string>;
  applications: string[];
  benefits: string[];
  images: string[];
  featuredImage: string;
  inStock: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  total: number;
  filters: Record<string, string | null>;
}

export async function getProducts(filters?: {
  category?: string;
  inStock?: boolean;
  limit?: number;
}): Promise<ProductsResponse> {
  const params: Record<string, string> = {};

  if (filters?.category) params.category = filters.category;
  if (filters?.inStock !== undefined)
    params.inStock = filters.inStock.toString();
  if (filters?.limit) params.limit = filters.limit.toString();

  return fetchAPI<ProductsResponse>("/products", params);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const response = await getProducts();
  return response.data.find((product) => product.slug === slug) || null;
}

// Newsroom API
export interface NewsroomPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  category: string;
  tags: string[];
  featuredImage: string;
  images: string[];
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  isPublished: boolean;
  isFeatured: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface NewsroomResponse {
  success: boolean;
  data: NewsroomPost[];
  total: number;
  filters: Record<string, string | null>;
}

export async function getNewsroomPosts(filters?: {
  category?: string;
  tag?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  limit?: number;
}): Promise<NewsroomResponse> {
  const params: Record<string, string> = {};

  if (filters?.category) params.category = filters.category;
  if (filters?.tag) params.tag = filters.tag;
  if (filters?.isFeatured !== undefined)
    params.isFeatured = filters.isFeatured.toString();
  if (filters?.isPublished !== undefined)
    params.isPublished = filters.isPublished.toString();
  if (filters?.limit) params.limit = filters.limit.toString();

  return fetchAPI<NewsroomResponse>("/newsroom", params);
}

export async function getNewsroomPost(
  slug: string
): Promise<NewsroomPost | null> {
  const response = await getNewsroomPosts();
  return response.data.find((post) => post.slug === slug) || null;
}

// Careers API
export interface JobOpening {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  experience: string;
  description: string;
  content: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary?: string;
  isRemote: boolean;
  isActive: boolean;
  postedAt: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface CareersResponse {
  success: boolean;
  data: JobOpening[];
  total: number;
  filters: Record<string, string | null>;
}

export async function getJobOpenings(filters?: {
  department?: string;
  location?: string;
  type?: string;
  isActive?: boolean;
  limit?: number;
}): Promise<CareersResponse> {
  const params: Record<string, string> = {};

  if (filters?.department) params.department = filters.department;
  if (filters?.location) params.location = filters.location;
  if (filters?.type) params.type = filters.type;
  if (filters?.isActive !== undefined)
    params.isActive = filters.isActive.toString();
  if (filters?.limit) params.limit = filters.limit.toString();

  return fetchAPI<CareersResponse>("/careers", params);
}

export async function getJobOpening(slug: string): Promise<JobOpening | null> {
  const response = await getJobOpenings();
  return response.data.find((job) => job.slug === slug) || null;
}

// Helper functions for backward compatibility
export async function getSolutionCategories(): Promise<
  Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    solutionCount: number;
  }>
> {
  const response = await getSolutions();
  const categories = new Map<
    string,
    {
      id: string;
      name: string;
      slug: string;
      description: string;
      solutionCount: number;
    }
  >();

  response.data.forEach((solution) => {
    if (!categories.has(solution.category)) {
      categories.set(solution.category, {
        id: solution.category,
        name:
          solution.category.charAt(0).toUpperCase() +
          solution.category.slice(1),
        slug: solution.category,
        description: "",
        solutionCount: 0,
      });
    }
    const category = categories.get(solution.category)!;
    category.solutionCount++;
  });

  return Array.from(categories.values());
}

export async function getProductCategories(): Promise<
  Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    productCount: number;
  }>
> {
  const response = await getProducts();
  const categories = new Map<
    string,
    {
      id: string;
      name: string;
      slug: string;
      description: string;
      productCount: number;
    }
  >();

  response.data.forEach((product) => {
    if (!categories.has(product.category)) {
      categories.set(product.category, {
        id: product.category,
        name:
          product.category.charAt(0).toUpperCase() + product.category.slice(1),
        slug: product.category,
        description: "",
        productCount: 0,
      });
    }
    const category = categories.get(product.category)!;
    category.productCount++;
  });

  return Array.from(categories.values());
}

export async function getNewsroomCategories(): Promise<
  Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    postCount: number;
  }>
> {
  const response = await getNewsroomPosts();
  const categories = new Map<
    string,
    {
      id: string;
      name: string;
      slug: string;
      description: string;
      postCount: number;
    }
  >();

  response.data.forEach((post) => {
    if (!categories.has(post.category)) {
      categories.set(post.category, {
        id: post.category,
        name: post.category.charAt(0).toUpperCase() + post.category.slice(1),
        slug: post.category,
        description: "",
        postCount: 0,
      });
    }
    const category = categories.get(post.category)!;
    category.postCount++;
  });

  return Array.from(categories.values());
}

export async function getDepartments(): Promise<
  Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    jobCount: number;
  }>
> {
  const response = await getJobOpenings();
  const departments = new Map<
    string,
    {
      id: string;
      name: string;
      slug: string;
      description: string;
      jobCount: number;
    }
  >();

  response.data.forEach((job) => {
    if (!departments.has(job.department)) {
      departments.set(job.department, {
        id: job.department,
        name: job.department.charAt(0).toUpperCase() + job.department.slice(1),
        slug: job.department,
        description: "",
        jobCount: 0,
      });
    }
    const department = departments.get(job.department)!;
    department.jobCount++;
  });

  return Array.from(departments.values());
}

// Slug getters for static generation
export async function getSolutionSlugs(): Promise<string[]> {
  const response = await getSolutions();
  return response.data.map((solution) => solution.slug);
}

export async function getProductSlugs(): Promise<string[]> {
  const response = await getProducts();
  return response.data.map((product) => product.slug);
}

export async function getNewsroomSlugs(): Promise<string[]> {
  const response = await getNewsroomPosts();
  return response.data.map((post) => post.slug);
}

export async function getJobSlugs(): Promise<string[]> {
  const response = await getJobOpenings();
  return response.data.map((job) => job.slug);
}
