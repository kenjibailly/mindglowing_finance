import { Link, useNavigate } from "react-router-dom";
import usePreviewImage from "../hooks/usePreviewImage";
import "../../stylesheets/images/preview_image.css";
import { useEffect, useRef, useState } from "react";
import Alert from "../Alert";
import { fetchTax } from "../types/Taxes";
import useFetchData from "../hooks/useFetchData";
import useDatalist from "../hooks/useDatalist";
import Loader from "../Loader";
import useChangeSelectedValue from "../hooks/useChangeSelectedValue";

const CreateProduct = () => {
  const { imageSrc, handleImageChange, handleImageClick, fileInputRef } =
    usePreviewImage();
  const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const [error, setError] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const [chooseTax, setChooseTax] = useState<boolean>(true);

  const {
    data: taxData,
    loading: taxLoading,
    error: taxError,
    fetchItems,
  } = useFetchData<fetchTax>({
    id: "",
    endpoint: "settings/taxes",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const taxInputRef = useRef<HTMLInputElement>(null);
  const taxIdInputRef = useRef<HTMLInputElement>(null);
  const taxDatalistRef = useRef<HTMLDataListElement>(null);
  useDatalist(taxInputRef, taxDatalistRef, taxLoading, {}, chooseTax);

  const compareFields = ["name"];
  const { handleChangeSelectedValue, selectedItemId } = useChangeSelectedValue(
    taxData?.items || []
  );

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
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
      console.log(formData);
    }

    for (const [key, value] of formDataFields.entries()) {
      if (key !== "picture") {
        formData.append(key, value);
      }
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

  const handleChooseTax = () => {
    const toggleTax = chooseTax === true ? false : true;
    setChooseTax(toggleTax);
  };

  if (taxError) {
    return <Alert message={taxError.message} type="error" scroll={true} />;
  }

  if (taxLoading) {
    <Loader fullPage={false} />;
  }

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

            <label htmlFor="tax">Tax:</label>
            {taxData && chooseTax ? (
              <div className="data-list">
                <input
                  list=""
                  name="tax_id_name"
                  id="tax"
                  className="data-list-input"
                  autoComplete="off"
                  ref={taxInputRef}
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
                <input type="number" id="tax" name="tax" step="1" required />
              </div>
            )}
            {taxData && (
              <>
                <label htmlFor="manual_tax">Manual Tax</label>
                <label className="checkbox">
                  <input type="checkbox" onChange={handleChooseTax} />
                </label>
              </>
            )}

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
