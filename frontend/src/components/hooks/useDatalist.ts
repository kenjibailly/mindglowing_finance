import { useEffect } from "react";

const useDatalist = (
  inputRef: React.RefObject<HTMLInputElement>,
  datalistRef: React.RefObject<HTMLDataListElement>
) => {
  useEffect(() => {
    const input = inputRef.current;
    const datalist = datalistRef.current;

    if (!input || !datalist) return;

    let currentFocus = -1;

    const handleFocus = () => {
      datalist.style.display = "block";
      input.style.borderRadius = "5px 5px 0 0";
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        input &&
        !input.contains(event.target as Node) &&
        !datalist.contains(event.target as Node)
      ) {
        datalist.style.display = "none";
        input.style.borderRadius = "5px";
      }
    };

    const handleInput = () => {
      const filter = input.value.toUpperCase();
      const options = Array.from(datalist.children) as HTMLOptionElement[];

      // Show the datalist when there is a partial match or when the input is empty
      datalist.style.display = "block";
      input.style.borderRadius = "5px 5px 0 0"; // Open state styling

      let hasVisibleOptions = false;

      options.forEach((option) => {
        if (option.value.toUpperCase().includes(filter)) {
          option.style.display = "block";
          hasVisibleOptions = true; // Keep track if there are matching options
        } else {
          option.style.display = "none";
        }
      });

      // If there are no visible options, hide the datalist
      if (!hasVisibleOptions) {
        datalist.style.display = "none";
        input.style.borderRadius = "5px"; // Close state styling
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const options = Array.from(datalist.children).filter(
        (option) => (option as HTMLOptionElement).style.display !== "none"
      ) as HTMLOptionElement[];

      if (event.key === "ArrowDown") {
        currentFocus++;
        addActive(options);
      } else if (event.key === "ArrowUp") {
        currentFocus--;
        addActive(options);
      } else if (event.key === "Enter") {
        event.preventDefault();
        const activeOption = options[currentFocus];
        if (activeOption) {
          input.value = activeOption.value;
          datalist.style.display = "none";
          input.style.borderRadius = "5px";
        }
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
      }
    };

    const handleOptionClick = (event: MouseEvent) => {
      const target = event.target as HTMLOptionElement;
      if (target) {
        input.value = target.value;
        datalist.style.display = "none";
        input.style.borderRadius = "5px";
      }
    };

    const addActive = (options: HTMLOptionElement[]) => {
      removeActive(options);
      if (currentFocus >= options.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = options.length - 1;

      const activeOption = options[currentFocus];
      activeOption.classList.add("active");

      // Ensure the active option is visible
      activeOption.scrollIntoView({ block: "nearest", inline: "nearest" });
    };

    const removeActive = (options: HTMLOptionElement[]) => {
      options.forEach((option) => option.classList.remove("active"));
    };

    input.addEventListener("focus", handleFocus);
    input.addEventListener("input", handleInput);
    input.addEventListener("keydown", handleKeyDown);
    datalist.addEventListener("click", handleOptionClick); // Add click event listener for options
    document.addEventListener("click", handleClickOutside);

    return () => {
      input.removeEventListener("focus", handleFocus);
      input.removeEventListener("input", handleInput);
      input.removeEventListener("keydown", handleKeyDown);
      datalist.removeEventListener("click", handleOptionClick);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [inputRef, datalistRef]);
};

export default useDatalist;
