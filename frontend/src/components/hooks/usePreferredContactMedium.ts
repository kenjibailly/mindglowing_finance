import { useCallback } from "react";

const useChangeRadio = (
  setRadio: React.Dispatch<React.SetStateAction<string>>
) => {
  const changePreferredContactMedium = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRadio(event.target.value); // Set the selected value
    },
    [setRadio] // Dependency array
  );

  return changePreferredContactMedium; // Return only the change handler function
};

export default useChangeRadio;
