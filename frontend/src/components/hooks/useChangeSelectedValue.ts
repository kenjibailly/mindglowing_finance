import { useState, useEffect, useRef } from "react";

interface Item {
  _id: string;
  [key: string]: any; // Allows dynamic properties
}

const useChangeSelectedValue = <T extends Item>(itemData: T[]) => {
  const selectedItemId = useRef<string | null>(null);

  const handleChangeSelectedValue = (
    inputRef: React.RefObject<HTMLInputElement>,
    inputIdRef: React.RefObject<HTMLInputElement>,
    compareFields: string[]
  ) => {
    if (inputRef.current) {
      const selectedValue = inputRef.current.value;

      if (
        selectedValue !== "" &&
        selectedValue !== (inputIdRef.current?.value || "")
      ) {
        // Find the matching item based on dynamic fields
        const selectedItem = itemData.find((item) => {
          const comparisonValue = compareFields
            .map((field) => item[field])
            .join(" "); // Join the field values to match the selected value
          return comparisonValue === selectedValue;
        });

        if (selectedItem) {
          // Update the hidden input with the selected item's _id
          if (inputIdRef.current) {
            inputIdRef.current.value = selectedItem._id;
          }
          selectedItemId.current = selectedItem._id; // Update state with the selected item's _id
        }
      }
    }
  };

  return { handleChangeSelectedValue, selectedItemId };
};

export default useChangeSelectedValue;
