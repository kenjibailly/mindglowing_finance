import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface UseSortingResult {
  sortOrder: "asc" | "desc";
  sortedField: string | null;
  linkOptions: string;
  handleSort: (sortBy: string) => void;
  getSortClass: (field: string) => string; // Add to the interface
}

function useSorting(baseUrl: string): UseSortingResult {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortedField, setSortedField] = useState<string | null>(null);
  const [linkOptions, setLinkOptions] = useState<string>("");
  const navigate = useNavigate();

  const handleSort = (sortBy: string) => {
    const newOrder =
      sortedField === sortBy && sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    setSortedField(sortBy);
    setLinkOptions(`&sort_by=${sortBy}&sort_order=${newOrder}`);
    navigate(`${baseUrl}?page=1&sort_by=${sortBy}&sort_order=${newOrder}`);
  };

  // Utility to determine sorting class
  const getSortClass = (field: string) => {
    if (sortedField === field) {
      return sortOrder === "asc" ? "sort-asc" : "sort-desc";
    }
    return "";
  };

  return { sortOrder, sortedField, linkOptions, handleSort, getSortClass }; // Include getSortClass in the return
}

export default useSorting;
