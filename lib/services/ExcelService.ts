/**
 * ExcelService - Excel Import/Export for Bulk Product Management
 * Uses SheetJS (xlsx) library
 * 
 * NO CHANGES NEEDED: This service only parses Excel.
 * Products are saved via ProductService.bulkCreate() in the component.
 */

import * as XLSX from 'xlsx';
import type { Product } from '@/types';

export interface ExcelProductRow {
  SKU: string;
  Name: string;
  Description: string;
  Category: string;
  Price: number;
  ComparePrice?: number;
  Stock: number;
  Colors: string;
  Sizes: string;
  Material: string;
  CareInstructions: string;
  Features: string;
  ImageURLs: string;
  SEOTitle?: string;
  SEODescription?: string;
  Tags?: string;
  Collection?: string;
  Status: 'draft' | 'published';
  IsNew?: 'YES' | 'NO';
  IsOnSale?: 'YES' | 'NO';
}

export interface ParseResult {
  valid: ExcelProductRow[];
  invalid: Array<{ row: number; data: any; errors: string[] }>;
  totalRows: number;
}

export const ExcelService = {
  /**
   * Parse Excel file
   */
  parseExcel: async (file: File): Promise<ParseResult> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });

          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          const rows: any[] = XLSX.utils.sheet_to_json(sheet);

          const valid: ExcelProductRow[] = [];
          const invalid: Array<{ row: number; data: any; errors: string[] }> = [];

          rows.forEach((row, index) => {
            const { isValid, errors, product } = ExcelService.validateRow(
              row,
              index + 2
            );

            if (isValid && product) {
              valid.push(product);
            } else {
              invalid.push({ row: index + 2, data: row, errors });
            }
          });

          resolve({
            valid,
            invalid,
            totalRows: rows.length,
          });
        } catch (error) {
          reject(new Error(`Failed to parse Excel file: ${error}`));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsBinaryString(file);
    });
  },

  /**
   * Validate Excel row
   */
  validateRow: (
    row: any,
    rowNumber: number
  ): {
    isValid: boolean;
    errors: string[];
    product: ExcelProductRow | null;
  } => {
    const errors: string[] = [];

    if (!row.Name || row.Name.trim() === '') {
      errors.push('Name is required');
    }
    if (!row.Category || row.Category.trim() === '') {
      errors.push('Category is required');
    }
    if (!row.Price || isNaN(parseFloat(row.Price))) {
      errors.push('Valid Price is required');
    }

    if (row.ComparePrice && parseFloat(row.ComparePrice) <= parseFloat(row.Price)) {
      errors.push('ComparePrice must be greater than Price');
    }

    if (
      row.Stock !== undefined &&
      (isNaN(parseInt(row.Stock)) || parseInt(row.Stock) < 0)
    ) {
      errors.push('Stock must be a positive number');
    }

    if (
      row.Status &&
      !['draft', 'published'].includes(row.Status.toLowerCase())
    ) {
      errors.push('Status must be "draft" or "published"');
    }

    if (errors.length > 0) {
      return { isValid: false, errors, product: null };
    }

    const product: ExcelProductRow = {
      SKU: row.SKU || '',
      Name: row.Name,
      Description: row.Description || '',
      Category: row.Category.toLowerCase().replace(/\s+/g, '-'),
      Price: parseFloat(row.Price),
      ComparePrice: row.ComparePrice ? parseFloat(row.ComparePrice) : undefined,
      Stock: row.Stock ? parseInt(row.Stock) : 0,
      Colors: row.Colors || '',
      Sizes: row.Sizes || '',
      Material: row.Material || '',
      CareInstructions: row.CareInstructions || '',
      Features: row.Features || '',
      ImageURLs: row.ImageURLs || '',
      SEOTitle: row.SEOTitle,
      SEODescription: row.SEODescription,
      Tags: row.Tags,
      Collection: row.Collection,
      Status: (row.Status?.toLowerCase() || 'draft') as 'draft' | 'published',
      IsNew: row.IsNew?.toUpperCase() === 'YES' ? 'YES' : 'NO',
      IsOnSale: row.IsOnSale?.toUpperCase() === 'YES' ? 'YES' : 'NO',
    };

    return { isValid: true, errors: [], product };
  },

  /**
   * Convert Excel rows to Product objects
   */
  rowsToProducts: (rows: ExcelProductRow[]): Partial<Product>[] => {
    return rows.map((row) => ({
      sku: row.SKU,
      name: row.Name,
      description: row.Description,
      category: row.Category,
      price: row.Price,
      compareAtPrice: row.ComparePrice,
      stock: row.Stock,
      colors: row.Colors
        ? row.Colors.split(',').map((c) => ({
          name: c.trim(),
          hex: ExcelService.colorNameToHex(c.trim()),
        }))
        : [],
      sizes: row.Sizes ? row.Sizes.split(',').map((s) => s.trim()) : [],
      material: row.Material,
      care: row.CareInstructions
        ? row.CareInstructions.split(',').map((c) => c.trim())
        : [],
      features: row.Features
        ? row.Features.split(',').map((f) => f.trim())
        : [],
      images: row.ImageURLs
        ? row.ImageURLs.split(',').map((url) => url.trim())
        : [],
      seoTitle: row.SEOTitle,
      seoDescription: row.SEODescription,
      tags: row.Tags ? row.Tags.split(',').map((t) => t.trim()) : [],
      collection: row.Collection,
      status: row.Status,
      isNew: row.IsNew === 'YES',
      isOnSale: row.IsOnSale === 'YES',
      inStock: row.Stock > 0,
    }));
  },

  /**
   * Color name to hex converter
   */
  colorNameToHex: (colorName: string): string => {
    const colors: Record<string, string> = {
      black: '#000000',
      white: '#FFFFFF',
      gray: '#808080',
      grey: '#808080',
      red: '#DC2626',
      blue: '#3B82F6',
      green: '#10B981',
      yellow: '#F59E0B',
      pink: '#EC4899',
      purple: '#8B5CF6',
      orange: '#F97316',
      brown: '#92400E',
      beige: '#D4A574',
      navy: '#1E3A8A',
      olive: '#6B7280',
    };

    return colors[colorName.toLowerCase()] || '#000000';
  },

  /**
   * Generate Excel template
   */
  generateTemplate: (): void => {
    const template: ExcelProductRow[] = [
      {
        SKU: 'HOD-001',
        Name: 'Essential Hoodie',
        Description: 'Premium organic cotton hoodie',
        Category: 'hoodies',
        Price: 89,
        ComparePrice: 120,
        Stock: 100,
        Colors: 'Black,White,Gray',
        Sizes: 'XS,S,M,L,XL',
        Material: 'Organic Cotton',
        CareInstructions: 'Machine wash cold,Tumble dry low',
        Features: 'Organic cotton,Relaxed fit,Ribbed cuffs',
        ImageURLs:
          'https://example.com/image1.jpg,https://example.com/image2.jpg',
        SEOTitle: 'Essential Hoodie - Premium Organic Cotton',
        SEODescription: 'Shop our essential hoodie',
        Tags: 'hoodie,organic,cotton',
        Collection: 'essentials',
        Status: 'published',
        IsNew: 'YES',
        IsOnSale: 'NO',
      },
      {
        SKU: 'TRA-002',
        Name: 'Sport Tracksuit',
        Description: 'High-performance athletic tracksuit',
        Category: 'tracksuits',
        Price: 149,
        ComparePrice: 189,
        Stock: 150,
        Colors: 'Black,Navy',
        Sizes: 'XS,S,M,L,XL',
        Material: 'Recycled Polyester',
        CareInstructions: 'Machine wash cold,Hang to dry',
        Features: 'Moisture-wicking,4-way stretch',
        ImageURLs: 'https://example.com/tracksuit1.jpg',
        SEOTitle: 'Premium Sport Tracksuit',
        SEODescription: 'Shop high-performance tracksuits',
        Tags: 'tracksuit,sport,athletic',
        Collection: 'active',
        Status: 'published',
        IsNew: 'NO',
        IsOnSale: 'YES',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    const maxWidth = 50;
    const colWidths = Object.keys(template[0]).map((key) => ({
      wch: Math.min(Math.max(key.length, 10), maxWidth),
    }));
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, 'NOWIHT-Product-Import-Template.xlsx');
  },

  /**
   * Export products to Excel
   */
  exportProducts: (products: Product[]): void => {
    const rows: ExcelProductRow[] = products.map((product) => ({
      SKU: product.sku || '',
      Name: product.name,
      Description: product.description || '',
      Category: product.category,
      Price: product.price,
      ComparePrice: product.compareAtPrice,
      Stock: product.stock || 0,
      Colors: product.colors.map((c) => c.name).join(','),
      Sizes: product.sizes.join(','),
      Material: product.material || '',
      CareInstructions: product.care.join(','),
      Features: product.features.join(','),
      ImageURLs: product.images.join(','),
      SEOTitle: product.seoTitle,
      SEODescription: product.seoDescription,
      Tags: product.tags?.join(','),
      Collection: product.collection,
      Status: product.status || 'published',
      IsNew: product.isNew ? 'YES' : 'NO',
      IsOnSale: product.isOnSale ? 'YES' : 'NO',
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    const timestamp = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `NOWIHT-Products-Export-${timestamp}.xlsx`);
  },

  /**
   * Export invalid rows
   */
  exportInvalidRows: (
    invalid: Array<{ row: number; data: any; errors: string[] }>
  ): void => {
    const rows = invalid.map((item) => ({
      RowNumber: item.row,
      Errors: item.errors.join('; '),
      ...item.data,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invalid Rows');

    XLSX.writeFile(workbook, 'NOWIHT-Import-Errors.xlsx');
  },
};