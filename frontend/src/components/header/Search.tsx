import { useState, useEffect } from "react";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

import { SearchResult } from "../types/SearchResults";

const Search = () => {
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isResultsVisible, setIsResultsVisible] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const showSearchResults = async (searchTerm: string) => {
    if (!searchTerm) return;

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchTerm)}`
      );
      const json = await response.json();
      setSearchResults(json.search_results);
      setIsResultsVisible(true);
    } catch (error) {
      setError("Could not find any results");
      setIsResultsVisible(true);
    }
  };

  // Hide search results popup on Escape key or outside click
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsResultsVisible(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof Node) {
        setIsResultsVisible(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <>
      <SearchInput onSearch={showSearchResults} />
      <SearchResults
        results={searchResults}
        error={error}
        isVisible={isResultsVisible}
      />
    </>
  );
};

export default Search;
