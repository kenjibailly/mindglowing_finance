// useSorting.ts
import { useLocation } from "react-router-dom";

const useSorting = (
  fetchItems: (sortBy: string, order: "asc" | "desc") => Promise<void>
) => {
  const location = useLocation();

  const handleSort = (sortBy: string) => {
    const queryParams = new URLSearchParams(window.location.search);
    const currentSort = queryParams.get("sort_by");
    const currentOrder = queryParams.get("sort_order");

    // Determine the new order
    const newOrder =
      currentSort === sortBy
        ? currentOrder === "asc"
          ? "desc"
          : "asc" // Toggle order
        : "asc"; // Default to ascending if a different field is clicked

    // Set the query parameters for sorting
    queryParams.set("sort_by", sortBy);
    queryParams.set("sort_order", newOrder);
    // Update the URL without causing a full page refresh
    const newPath = `${location.pathname}?${queryParams.toString()}`;
    window.history.replaceState({}, "", newPath);

    // Fetch items with the updated sorting parameters
    fetchItems(sortBy, newOrder);
  };

  const getSortClass = (field: string) => {
    const queryParams = new URLSearchParams(window.location.search);
    const currentSort = queryParams.get("sort_by");
    const currentOrder = queryParams.get("sort_order");

    if (field === currentSort) {
      return currentOrder === "asc" ? "sort-asc" : "sort-desc";
    }
    return "";
  };

  // Construct link options for pagination
  const linkOptions = `&${new URLSearchParams(location.search).toString()}`;

  return { handleSort, getSortClass, linkOptions };
};

export default useSorting;
