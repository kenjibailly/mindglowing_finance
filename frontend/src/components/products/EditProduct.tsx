import { useEffect, useRef, useState } from "react";
import useFetchData from "../hooks/useFetchData";
import { ProductFetch as ProductData } from "../types/Products";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../Alert";
import useDeleteItems from "../hooks/useDeleteItems";
import Loader from "../Loader";
import usePreviewImage from "../hooks/usePreviewImage";
import useDatalist from "../hooks/useDatalist";
import useChangeSelectedValue from "../hooks/useChangeSelectedValue";
import { fetchTax } from "../types/Taxes";

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
  const [chooseTax, setChooseTax] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
    fetchTaxes();
  }, [id]);

  const {
    data: taxData,
    loading: taxLoading,
    error: taxError,
    fetchItems: fetchTaxes,
  } = useFetchData<fetchTax>({
    id: "",
    endpoint: "settings/taxes",
  });

  const {
    handleDeleteSelected,
    loading: deleting,
    error: deleteError,
  } = useDeleteItems();

  const taxInputRef = useRef<HTMLInputElement>(null);
  const taxIdInputRef = useRef<HTMLInputElement>(null);
  const taxDatalistRef = useRef<HTMLDataListElement>(null);
  useDatalist(taxInputRef, taxDatalistRef, taxLoading, {}, chooseTax);

  const compareFields = ["name"];
  const { handleChangeSelectedValue, selectedItemId } = useChangeSelectedValue(
    taxData?.items || []
  );

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

    handleChangeSelectedValue(taxInputRef, taxIdInputRef, compareFields);

    // Type-cast event.target to HTMLFormElement
    const form = e.target as HTMLFormElement;

    // Create a new FormData instance
    const formData = new FormData();
    const formDataFields = new FormData(form);
    if (selectedItemId) {
      formData.append("tax_id", selectedItemId.current || "");
    }

    // Append the image file if it exists and is available
    const file = fileInputRef.current?.files?.[0] || null;
    if (file) {
      formData.append("picture", file);
    }

    for (const [key, value] of formDataFields.entries()) {
      if (key !== "picture") {
        formData.append(key, value);
      }
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

  useEffect(() => {
    if (productData?.tax_details) setChooseTax(false);
  }, [productData]);
  const handleChooseTax = () => {
    const toggleTax = chooseTax === true ? false : true;
    setChooseTax(toggleTax);
  };

  if (productError) {
    return <Alert message={productError.message} type="error" scroll={true} />;
  }

  if (loading || deleting || taxLoading) {
    <Loader fullPage={false} />;
  }

  if (!productData) {
    return <Loader fullPage={true} />;
  }

  if (taxError) {
    return <Alert message={taxError.message} type="error" scroll={true} />;
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
        <Link className="link" to={`/products/${id}`}>
          {productData?.name}
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

            <label htmlFor="tax">Tax:</label>
            {taxData && !chooseTax ? (
              <div className="data-list">
                <input
                  list=""
                  name="tax_id_name"
                  id="tax"
                  className="data-list-input"
                  autoComplete="off"
                  ref={taxInputRef}
                  defaultValue={
                    productData.tax_details && productData.tax_details.name
                  }
                  required
                />
                <datalist ref={taxDatalistRef} className="data-list-datalist">
                  {taxData.items.map((tax) => (
                    <option key={tax._id} value={`${tax.name}`}>
                      {tax.name} ({tax.percentage}%)
                    </option>
                  ))}
                </datalist>
              </div>
            ) : (
              <div className="full-input">
                <label htmlFor="tax">%</label>
                <input
                  type="number"
                  id="tax"
                  name="tax"
                  step="1"
                  required
                  defaultValue={
                    productData.tax.percentage && productData.tax.percentage
                  }
                />
              </div>
            )}
            {taxData && (
              <>
                <label htmlFor="manual_tax">Manual Tax</label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    onChange={handleChooseTax}
                    checked={chooseTax}
                  />
                </label>
              </>
            )}
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
