import { Link, useNavigate } from "react-router-dom";
import usePreviewImage from "../hooks/usePreviewImage";
import "../../stylesheets/images/preview_image.css";
import { useState } from "react";
import Alert from "../Alert";

const CreateProduct = () => {
  const { imageSrc, handleImageChange, handleImageClick, fileInputRef } =
    usePreviewImage();
  const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const [error, setError] = useState<{
    message: string;
    id: number;
  } | null>(null);

  const handleCreateProduct = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // Type-cast event.target to HTMLFormElement
    const form = event.target as HTMLFormElement;

    // Create a new FormData instance
    const formData = new FormData();
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const priceInput = form.elements.namedItem("price") as HTMLInputElement;
    const descriptionInput = form.elements.namedItem(
      "description"
    ) as HTMLTextAreaElement;

    formData.append("name", nameInput.value);
    formData.append("price", priceInput.value);
    formData.append("description", descriptionInput.value);

    // Append the image file if it exists and is available
    const file = fileInputRef.current?.files?.[0] || null;
    if (file) {
      formData.append("picture", file);
    }

    try {
      const response = await fetch("/api/products/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        navigate(`/products/${result._id}`);
        // Redirect or update UI as needed
      } else {
        const errorData = await response.json();
        throw new Error("Failed to create product.\n" + errorData.message);
      }
    } catch (error) {
      setError({
        message: (error as Error).message || "An unknown error occurred",
        id: Date.now(),
      });
    }
  };

  return (
    <>
      {error && (
        <Alert
          key={error.id}
          message={error.message}
          type="error"
          scroll={true}
        />
      )}
      <div className="wrapper">
        <Link className="link" to="/products/">
          Products
        </Link>

        <form onSubmit={handleCreateProduct} encType="multipart/form-data">
          <div className="separate">
            <label htmlFor="picture">Picture:</label>
            {imageSrc && (
              <img
                className="preview-image"
                src={imageSrc}
                alt="Preview"
                onClick={handleImageClick}
              />
            )}
            <input
              type="file"
              id="picture"
              name="picture"
              onChange={handleImageChange}
              ref={fileInputRef}
              className={imageSrc ? "hidden" : ""}
            />
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />
            <label htmlFor="price">Price:</label>
            <div className="full-input">
              <label htmlFor="price">
                {cachedUser.currency_symbol && cachedUser.currency_symbol}
              </label>
              <input type="number" id="price" name="price" step="0.01" />
            </div>
            <label htmlFor="description">Description:</label>
            <textarea id="description" name="description" rows={4}></textarea>
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
    </>
  );
};

export default CreateProduct;
