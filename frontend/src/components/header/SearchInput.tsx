// src/components/Header/SearchInput.tsx
import { useRef } from "react";

interface SearchInputProps {
  onSearch: (searchTerm: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = () => {
    const searchTerm = searchInputRef.current?.value;
    if (searchTerm) {
      onSearch(searchTerm);
    }
  };

  return (
    <form
      id="searchForm"
      onSubmit={(e) => {
        e.preventDefault();
        const searchTerm = searchInputRef.current?.value;
        if (searchTerm) {
          onSearch(searchTerm);
        }
      }}
    >
      <input
        type="text"
        id="search"
        name="q"
        placeholder="Search"
        ref={searchInputRef}
        onInput={handleInputChange}
      />
      <button className="hidden" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchInput;
