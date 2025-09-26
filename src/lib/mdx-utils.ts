import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface MDXMetadata {
  title: string;
  description?: string;
  excerpt?: string;
  category?: string;
  industry?: string;
  author?: string | { name: string; title?: string; bio?: string };
  authorAvatar?: string;
  authorBio?: string;
  tags?: string[];
  image?: string;
  featuredImage?: string;
  publishedAt?: string;
  updatedAt?: string;
  readTime?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  features?: string[];
  benefits?: string[];
  applications?: string[];
  caseStudies?: Array<{
    title: string;
    description: string;
    results: string[];
  }>;
  seo?: {
    title: string;
    description: string;
    keywords?: string[];
  };
  [key: string]: any;
}

export interface MDXFile {
  slug: string;
  content: string;
  metadata: MDXMetadata;
}

export function getMDXFiles(
  contentType: string,
  locale: string = "en"
): MDXFile[] {
  const postsDirectory = path.join(
    process.cwd(),
    "src/app/[locale]",
    contentType,
    "posts",
    locale
  );

  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const mdxFiles = fileNames.filter((fileName) => fileName.endsWith(".mdx"));

  return mdxFiles.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      content,
      metadata: data as MDXMetadata,
    };
  });
}

export function getMDXFile(
  contentType: string,
  slug: string,
  locale: string = "en"
): MDXFile | null {
  const postsDirectory = path.join(
    process.cwd(),
    "src/app/[locale]",
    contentType,
    "posts",
    locale
  );
  const filePath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    content,
    metadata: data as MDXMetadata,
  };
}

export function mapMDXToAPIData(mdxFile: MDXFile, contentType: string): any {
  const { slug, content, metadata } = mdxFile;

  // Base structure for all content types
  const baseData = {
    id: slug,
    slug,
    content,
    ...metadata,
  };

  // Map based on content type
  switch (contentType) {
    case "solutions":
      return {
        ...baseData,
        title: metadata.title,
        description: metadata.description,
        category: metadata.category || metadata.industry,
        features: metadata.features || [],
        benefits: metadata.benefits || [],
        applications: metadata.applications || [],
        caseStudies: metadata.caseStudies || [],
        featuredImage: metadata.featuredImage || metadata.image,
      };

    case "products":
      return {
        ...baseData,
        name: metadata.title,
        shortDescription: metadata.description,
        category: metadata.category,
        features: metadata.features || [],
        specifications: metadata.specifications || [],
        images: metadata.images || [metadata.featuredImage || metadata.image],
        price: metadata.price,
        rating: metadata.rating,
        inStock: metadata.inStock !== false,
      };

    case "newsroom":
      return {
        ...baseData,
        title: metadata.title,
        excerpt: metadata.excerpt || metadata.description,
        category: metadata.category,
        author:
          typeof metadata.author === "string"
            ? { name: metadata.author }
            : metadata.author || { name: "AmalTech Team" },
        tags: metadata.tags || [],
        featuredImage: metadata.featuredImage || metadata.image,
        publishedAt: metadata.publishedAt,
        readTime: metadata.readTime || 5,
      };

    case "careers":
      return {
        ...baseData,
        title: metadata.title,
        description: metadata.description,
        department: metadata.department || metadata.category,
        type: metadata.type || "Full-time",
        location: metadata.location || "Lagos",
        experience: metadata.experience || "3+ years",
        salary: metadata.salary || "Competitive",
        isRemote: metadata.isRemote || false,
        requirements: metadata.requirements || metadata.features || [],
        benefits: metadata.benefits || [],
        responsibilities:
          metadata.responsibilities || metadata.applications || [],
      };

    default:
      return baseData;
  }
}

export function getMDXDataForLayout(
  contentType: string,
  slug: string,
  locale: string = "en"
): any | null {
  const mdxFile = getMDXFile(contentType, slug, locale);

  if (!mdxFile) {
    return null;
  }

  return mapMDXToAPIData(mdxFile, contentType);
}

export function getAllMDXDataForLayout(
  contentType: string,
  locale: string = "en"
): any[] {
  const mdxFiles = getMDXFiles(contentType, locale);

  return mdxFiles.map((mdxFile) => mapMDXToAPIData(mdxFile, contentType));
}
