import { useEffect, useState } from "react";
import useFetchData from "../hooks/useFetchData";
import { Product as ProductData } from "../types/Products";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../Alert";
import useDeleteItems from "../hooks/useDeleteItems";
import Loader from "../Loader";
import usePreviewImage from "../hooks/usePreviewImage";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: productData,
    loading,
    error: productError,
    fetchItems,
  } = useFetchData<ProductData>({
    id: id,
    endpoint: "products",
  });
  const [success, setSuccess] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const [error, setError] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const { imageSrc, handleImageChange, handleImageClick, fileInputRef } =
    usePreviewImage();
  const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, [id]);

  const {
    handleDeleteSelected,
    loading: deleting,
    error: deleteError,
  } = useDeleteItems();

  const handleDeleteProduct = async () => {
    if (id) {
      await handleDeleteSelected("/api/products/delete", id);
      if (!deleteError) {
        navigate("/products");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Type-cast event.target to HTMLFormElement
    const form = e.target as HTMLFormElement;

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
      const response = await fetch(`/api/products/edit/${productData?._id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setSuccess({ message: "Product successfully edited", id: Date.now() });
        // Redirect or update UI as needed
      } else {
        const errorData = await response.json();
        throw new Error("Failed to edit product.\n" + errorData.message);
      }
    } catch (error) {
      setError({
        message: (error as Error).message || "An unknown error occurred",
        id: Date.now(),
      });
    }
  };

  if (productError) {
    return <Alert message={productError.message} type="error" scroll={true} />;
  }

  if (loading || deleting) {
    <Loader fullPage={false} />;
  }

  if (!productData) {
    return <Loader fullPage={true} />;
  }

  const alertError = error || deleteError || productError;

  return (
    <>
      {alertError && (
        <Alert
          key={alertError?.id}
          message={alertError?.message}
          type="error"
          scroll={true}
        />
      )}
      {success && (
        <Alert
          key={success.id}
          message={success.message}
          type="success"
          scroll={true}
        />
      )}
      <div className="wrapper">
        <Link to="/products/" className="link">
          Products
        </Link>

        <button onClick={handleDeleteProduct} type="submit">
          Delete
        </button>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="separate">
            <label htmlFor="picture">Product Picture:</label>
            {imageSrc ? (
              <img
                className="preview-image"
                src={imageSrc}
                alt="Preview"
                onClick={handleImageClick}
              />
            ) : (
              productData.picture && (
                <img
                  className="preview-image"
                  src={`/uploads/resized/${productData.picture}`}
                  alt="Preview"
                  onClick={handleImageClick}
                />
              )
            )}
            <input
              type="file"
              id="picture"
              name="picture"
              onChange={handleImageChange}
              ref={fileInputRef}
              className={imageSrc || productData.picture ? "hidden" : ""}
            />

            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={productData.name}
            />

            <label htmlFor="price">Price:</label>
            <div className="full-input">
              <label htmlFor="price">{cachedUser.currency_symbol}</label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                defaultValue={productData.price}
              />
            </div>

            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={productData.description}
            ></textarea>
          </div>

          <button type="submit">Update</button>
        </form>
      </div>
    </>
  );
};

export default EditProduct;
