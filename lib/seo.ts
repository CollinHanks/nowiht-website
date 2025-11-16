// lib/seo.ts
// ═══════════════════════════════════════════════════════════════
// 🔍 NOWIHT - SEO Utilities
// SEO helper functions for meta tags, structured data, etc.
// ═══════════════════════════════════════════════════════════════

import { Product, Category } from '@/types';

/**
 * Generate product structured data (JSON-LD)
 * For Google rich results
 */
export function generateProductStructuredData(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: 'NOWIHT',
    },
    offers: {
      '@type': 'Offer',
      url: `https://nowiht.com/product/${product.slug}`,
      priceCurrency: 'USD',
      price: product.price.toFixed(2),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: product.rating
      ? {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 0,
      }
      : undefined,
  };
}

/**
 * Generate breadcrumb structured data (JSON-LD)
 */
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{
  name: string;
  url: string;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `https://nowiht.com${crumb.url}`,
    })),
  };
}

/**
 * Generate organization structured data (JSON-LD)
 * For homepage and about page
 */
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NOWIHT',
    url: 'https://nowiht.com',
    logo: 'https://nowiht.com/images/logo-black.png',
    description: 'Luxury women\'s athleisure e-commerce brand',
    sameAs: [
      'https://instagram.com/nowiht',
      'https://facebook.com/nowiht',
      'https://twitter.com/nowiht',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-XXX-XXX-XXXX',
      contactType: 'Customer Service',
      email: 'info@nowiht.com',
      availableLanguage: ['en', 'tr'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Your Street Address',
      addressLocality: 'Istanbul',
      addressCountry: 'TR',
    },
  };
}

/**
 * Generate meta tags for product page
 */
export function generateProductMetaTags(product: Product) {
  const title = product.seoTitle || `${product.name} | NOWIHT`;
  const description =
    product.seoDescription ||
    product.description.substring(0, 160) + '...';
  const imageUrl = product.images[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'product',
      url: `https://nowiht.com/product/${product.slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      siteName: 'NOWIHT',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

/**
 * Generate meta tags for category page
 */
export function generateCategoryMetaTags(category: Category) {
  const title = category.seoTitle || `${category.name} | NOWIHT`;
  const description =
    category.seoDescription ||
    `Shop ${category.name.toLowerCase()} collection at NOWIHT. Luxury women's athleisure.`;
  const imageUrl = category.image;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://nowiht.com/shop/${category.slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
      siteName: 'NOWIHT',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  return `https://nowiht.com${path}`;
}

/**
 * Generate slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Generate SEO-friendly title
 * Limits to 60 characters for optimal display in search results
 */
export function generateSeoTitle(
  title: string,
  suffix: string = 'NOWIHT'
): string {
  const maxLength = 60;
  const titleWithSuffix = `${title} | ${suffix}`;

  if (titleWithSuffix.length <= maxLength) {
    return titleWithSuffix;
  }

  // Truncate title to fit within limit
  const truncatedTitle = title.substring(0, maxLength - suffix.length - 3);
  return `${truncatedTitle}... | ${suffix}`;
}

/**
 * Generate SEO-friendly description
 * Limits to 160 characters for optimal display in search results
 */
export function generateSeoDescription(description: string): string {
  const maxLength = 160;

  if (description.length <= maxLength) {
    return description;
  }

  // Truncate at last complete word before limit
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return truncated.substring(0, lastSpace) + '...';
}

/**
 * Generate keywords from text
 */
export function generateKeywords(text: string, maxKeywords: number = 10): string[] {
  // Remove common words
  const stopWords = [
    'a',
    'an',
    'and',
    'are',
    'as',
    'at',
    'be',
    'by',
    'for',
    'from',
    'has',
    'he',
    'in',
    'is',
    'it',
    'its',
    'of',
    'on',
    'that',
    'the',
    'to',
    'was',
    'will',
    'with',
  ];

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.includes(word));

  // Count word frequency
  const frequency: Record<string, number> = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // Sort by frequency and return top keywords
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Generate robots meta tag
 */
export function generateRobotsMeta(options: {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
}): string {
  const parts: string[] = [];

  if (options.index === false) {
    parts.push('noindex');
  } else {
    parts.push('index');
  }

  if (options.follow === false) {
    parts.push('nofollow');
  } else {
    parts.push('follow');
  }

  if (options.noarchive) {
    parts.push('noarchive');
  }

  if (options.nosnippet) {
    parts.push('nosnippet');
  }

  return parts.join(', ');
}

/**
 * Generate sitemap entry
 */
export function generateSitemapEntry(url: string, options?: {
  lastmod?: Date;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}): {
  url: string;
  lastModified: Date;
  changeFrequency?: string;
  priority?: number;
} {
  return {
    url: `https://nowiht.com${url}`,
    lastModified: options?.lastmod || new Date(),
    changeFrequency: options?.changefreq,
    priority: options?.priority,
  };
}

/**
 * Escape HTML entities for meta tags
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}