// usePaginatedTable.ts
import { useEffect, useState } from "react";
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
  linkOptions: string;
  isAllChecked: boolean;
  checkedItems: Set<string>;
  handleCheckAll: () => void;
  handleCheckItem: (id: string) => void;
  handleSort?: (sortBy: string) => void;
  getSortClass: (field: string) => string;
  fetchItems: () => Promise<void>;
}

interface Identifiable {
  _id: string;
}

function usePaginatedTable<T extends Identifiable>({
  baseUrl,
  enableSorting = false,
}: UsePaginatedTableOptions): UsePaginatedTableResult<T> {
  const {
    linkOptions: sortLinkOptions,
    handleSort,
    getSortClass,
  } = enableSorting
    ? useSorting(baseUrl)
    : {
        linkOptions: "",
        handleSort: undefined,
        getSortClass: () => "",
      };

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isAllChecked, setIsAllChecked] = useState<boolean>(false);

  const location = useLocation();

  const fetchItems = async () => {
    setLoading(true); // Start loading
    try {
      const queryParams = new URLSearchParams(location.search);
      const page = queryParams.get("page");
      const pageNumber = page ? parseInt(page, 10) : 1;
      const sortBy = enableSorting ? queryParams.get("sort_by") : null;
      const order = enableSorting
        ? (queryParams.get("sort_order") as "asc" | "desc") || "asc"
        : "asc";

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
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchItems();
  }, [location.search, baseUrl, enableSorting]);

  // Function to toggle all checkboxes
  const handleCheckAll = () => {
    if (isAllChecked) {
      setCheckedItems(new Set());
    } else {
      const allIds = new Set(items.map((item) => item._id as string));
      setCheckedItems(allIds);
    }
    setIsAllChecked(!isAllChecked);
  };

  // Function to handle individual checkbox toggle
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
    linkOptions: enableSorting ? sortLinkOptions : "",
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
