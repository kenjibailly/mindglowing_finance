// usePreviewImage.ts
import { useRef, useState } from "react";

const usePreviewImage = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Access the first file if available
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string); // Set the image URL to state
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  // Function to trigger file input click
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return { imageSrc, handleImageChange, fileInputRef, handleImageClick };
};

export default usePreviewImage;
