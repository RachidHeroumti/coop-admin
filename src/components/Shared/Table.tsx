import React, { useState } from "react";
import { Search, Edit2, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../UI/Button";

interface Column {
  key: string;
  title: string;
  render?: (value: any, record: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onAdd: () => void;
  onEdit: (record: any) => void;
  onDelete: (id: string) => void;
  searchPlaceholder?: string;
  addButtonText?: string;
  loading?: boolean;
  handlePageChange?: (page: number) => void;
  page?: number;
  totalPages?: number;
  limit?: number;
  setLimit?: (limit: number) => void;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  searchPlaceholder = "Search...",
  addButtonText = "Add New",
  loading,
  handlePageChange,
  page = 1,
  totalPages = 1,
  limit = 10,
  setLimit,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((item) =>
    columns.some((column) => {
      const value = item[column.key];
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const formatValue = (value: any): string => {
    if (value instanceof Date) return value.toLocaleDateString("en-US");
    return value?.toString() || "-";
  };

  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(page * limit, filteredData.length);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>
          <Button onClick={onAdd} variant="primary" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {addButtonText}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {column.title}
                </th>
              ))}
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData.map((record, index) => (
              <tr key={record.id || index} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      column.key === "role" && record[column.key] === "admin"
                        ? "text-red-600 font-medium uppercase"
                        : "text-gray-900"
                    }`}
                  >
                    {column.render
                      ? column.render(record[column.key], record)
                      : formatValue(record[column.key])}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEdit(record)}
                      className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(record.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
            <span className="font-semibold">{endIndex}</span> of{" "}
            <span className="font-semibold">{filteredData.length}</span> results
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange?.(page - 1)}
              disabled={page <= 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="flex items-center gap-1">
              <span className="px-3 py-1 text-sm font-medium text-gray-700">
                Page {page} of {totalPages}
              </span>
            </div>
            
            <button
              onClick={() => handlePageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};