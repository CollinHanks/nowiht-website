"use client";

import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle } from "lucide-react";
import { ExcelService, type ParseResult } from "@/lib/services/ExcelService";
import { Button } from "@/components/ui/Button";

interface ExcelUploaderProps {
  onImport: (validProducts: any[]) => void;
  onCancel?: () => void;
}

export default function ExcelUploader({ onImport, onCancel }: ExcelUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (selectedFile: File | null) => {
    if (!selectedFile) return;

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];

    if (!validTypes.includes(selectedFile.type) &&
      !selectedFile.name.endsWith('.xlsx') &&
      !selectedFile.name.endsWith('.xls') &&
      !selectedFile.name.endsWith('.csv')) {
      alert('Please upload a valid Excel file (.xlsx, .xls, or .csv)');
      return;
    }

    setFile(selectedFile);
    setParsing(true);
    setParseResult(null);

    try {
      const result = await ExcelService.parseExcel(selectedFile);
      setParseResult(result);
    } catch (error) {
      console.error('Error parsing Excel:', error);
      alert('Failed to parse Excel file. Please check the format and try again.');
      setFile(null);
    } finally {
      setParsing(false);
    }
  };

  const handleImport = () => {
    if (!parseResult || parseResult.valid.length === 0) return;

    const products = ExcelService.rowsToProducts(parseResult.valid);
    onImport(products);
  };

  const handleDownloadTemplate = () => {
    ExcelService.generateTemplate();
  };

  const handleDownloadErrors = () => {
    if (!parseResult || parseResult.invalid.length === 0) return;
    ExcelService.exportInvalidRows(parseResult.invalid);
  };

  const handleReset = () => {
    setFile(null);
    setParseResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 space-y-2">
            <p className="font-medium">Before uploading:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Download the Excel template below</li>
              <li>Fill in your product data following the template format</li>
              <li>Required fields: Name, Category, Price</li>
              <li>Upload your completed Excel file</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Download Template */}
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Excel Template</p>
            <p className="text-xs text-gray-500">Download the product import template</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadTemplate}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>

      {/* Upload Area */}
      {!file && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
            className="hidden"
          />

          <div className="space-y-3">
            <div className="flex justify-center">
              <div className="p-4 bg-gray-50 rounded-full">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Click to upload Excel file
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports .xlsx, .xls, and .csv files
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Parsing State */}
      {parsing && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-black mb-4" />
          <p className="text-sm text-gray-600">Parsing Excel file...</p>
        </div>
      )}

      {/* Parse Results */}
      {parseResult && !parsing && (
        <div className="space-y-4">
          {/* File Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{file?.name}</p>
                <p className="text-xs text-gray-500">
                  {parseResult.totalRows} rows found
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Change file
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            {/* Valid Products */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm font-semibold text-green-900">Valid Products</p>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {parseResult.valid.length}
              </p>
              <p className="text-xs text-green-700 mt-1">
                Ready to import
              </p>
            </div>

            {/* Invalid Products */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm font-semibold text-red-900">Invalid Products</p>
              </div>
              <p className="text-2xl font-bold text-red-900">
                {parseResult.invalid.length}
              </p>
              {parseResult.invalid.length > 0 && (
                <button
                  onClick={handleDownloadErrors}
                  className="text-xs text-red-700 hover:underline mt-1"
                >
                  Download error report
                </button>
              )}
            </div>
          </div>

          {/* Invalid Rows Details */}
          {parseResult.invalid.length > 0 && (
            <div className="border border-red-200 rounded-lg overflow-hidden">
              <div className="bg-red-50 px-4 py-3 border-b border-red-200">
                <p className="text-sm font-semibold text-red-900">
                  Errors Found ({parseResult.invalid.length})
                </p>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {parseResult.invalid.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 border-b border-red-100 last:border-b-0"
                  >
                    <p className="text-xs font-medium text-red-900">
                      Row {item.row}: {item.data.Name || 'Unnamed product'}
                    </p>
                    <ul className="mt-1 space-y-0.5">
                      {item.errors.map((error, errorIndex) => (
                        <li key={errorIndex} className="text-xs text-red-700">
                          • {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {parseResult.invalid.length > 5 && (
                  <div className="px-4 py-2 bg-red-50 text-center">
                    <p className="text-xs text-red-700">
                      And {parseResult.invalid.length - 5} more errors...
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleImport}
              disabled={parseResult.valid.length === 0}
            >
              Import {parseResult.valid.length} Product{parseResult.valid.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}