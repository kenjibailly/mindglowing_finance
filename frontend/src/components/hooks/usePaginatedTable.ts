// usePaginatedTable.ts
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import useSorting from "./useSorting";

interface UsePaginatedTableOptions {
  baseUrl: string;
  enableSorting?: boolean;
}

interface UsePaginatedTableResult<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  linkOptions: string; // Ensure this is a string
  isAllChecked: boolean;
  checkedItems: Set<string>;
  handleCheckAll: () => void;
  handleCheckItem: (id: string) => void;
  handleSort?: (sortBy: string) => void;
  getSortClass: (field: string) => string;
  fetchItems: (sortBy?: string, order?: "asc" | "desc") => Promise<void>; // Accept parameters
}

interface Identifiable {
  _id: string;
}

function usePaginatedTable<T extends Identifiable>({
  baseUrl,
  enableSorting = false,
}: UsePaginatedTableOptions): UsePaginatedTableResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isAllChecked, setIsAllChecked] = useState<boolean>(false);

  const location = useLocation();

  // Modified fetchItems to accept sort parameters
  const fetchItems = useCallback(
    async (sortBy?: string, order: "asc" | "desc" = "asc") => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(location.search);
        const page = queryParams.get("page");
        const pageNumber = page ? parseInt(page, 10) : 1;

        const response = await fetch(
          `/api${baseUrl}?page=${pageNumber}${
            sortBy ? `&sort_by=${sortBy}` : ""
          }&sort_order=${order}`
        );

        if (!response.ok) throw new Error("Getting items failed");

        const data = await response.json();
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setItems(data.items);
      } catch (err) {
        setError((err as Error).message || "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [location.search, baseUrl] // Keep dependencies
  );

  const { linkOptions, handleSort, getSortClass } = enableSorting
    ? useSorting(fetchItems) // Pass modified fetchItems
    : {
        linkOptions: "",
        handleSort: undefined,
        getSortClass: () => "",
      };

  useEffect(() => {
    fetchItems(); // Call without parameters to fetch based on URL
  }, [fetchItems]); // Use fetchItems as the dependency

  const handleCheckAll = () => {
    if (isAllChecked) {
      setCheckedItems(new Set());
    } else {
      const allIds = new Set(items.map((item) => item._id as string));
      setCheckedItems(allIds);
    }
    setIsAllChecked(!isAllChecked);
  };

  const handleCheckItem = (id: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      setIsAllChecked(newSet.size === items.length);
      return newSet;
    });
  };

  return {
    items,
    loading,
    error,
    currentPage,
    totalPages,
    linkOptions,
    isAllChecked,
    checkedItems,
    handleCheckAll,
    handleCheckItem,
    handleSort: enableSorting ? handleSort : undefined,
    getSortClass,
    fetchItems,
  };
}

export default usePaginatedTable;
