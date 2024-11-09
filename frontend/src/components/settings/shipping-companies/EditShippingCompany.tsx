import { Link, useParams } from "react-router-dom";
import { ShippingCompany } from "../../types/ShippingCompanies";
import useFetchData from "../../hooks/useFetchData";
import Loader from "../../Loader";
import Alert from "../../Alert";
import { useEffect, useState } from "react";

const EditShippingCompany = () => {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const [success, setSuccess] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const {
    data: shippingCompanyData,
    loading: shippingCompanyLoading,
    error: shippingCompanyError,
    fetchItems: shippingCompanyFetch,
  } = useFetchData<ShippingCompany>({
    id: "",
    endpoint: `settings/shipping-companies/${id}`,
  });

  useEffect(() => {
    shippingCompanyFetch();
  }, []);

  const handleEditShippingCompany = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Convert FormData to a JSON object
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await fetch(
        `/api/settings/shipping-companies/edit/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setSuccess({
          message: "Successfully edited shipping company",
          id: Date.now(),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          "Failed to create shipping company\n" + errorData.message
        );
      }

      // Navigate to the customer's page using the _id from the response
    } catch (error) {
      setError({
        message: (error as Error).message || "An unknown error occurred",
        id: Date.now(),
      });
    }
  };

  if (!shippingCompanyData || shippingCompanyLoading) {
    return <Loader fullPage={true} />;
  }

  if (shippingCompanyError) {
    return (
      <Alert
        key={shippingCompanyError.id}
        message={shippingCompanyError.message}
        type="error"
        scroll={true}
      />
    );
  }

  return (
    <>
      {success && (
        <Alert
          key={success.id}
          message={success.message}
          type="success"
          scroll={true}
        />
      )}
      {error && (
        <Alert
          key={error.id}
          message={error.message}
          type="error"
          scroll={true}
        />
      )}
      <div className="settings-wrapper">
        <Link className="link" to={`/settings/shipping-companies/`}>
          Shipping Companies
        </Link>

        <button className="button" type="submit">
          Delete
        </button>

        <form onSubmit={handleEditShippingCompany}>
          <div className="separate">
            <label htmlFor="shipping_company_name">Name:</label>
            <input
              type="text"
              id="shipping_company_name"
              name="shipping_company_name"
              defaultValue={shippingCompanyData.name}
              required
            />

            <label htmlFor="shipping_company_description">Description:</label>
            <textarea
              id="shipping_company_description"
              name="shipping_company_description"
              defaultValue={shippingCompanyData.description}
            ></textarea>
          </div>

          <button type="submit">Update</button>
        </form>
      </div>
    </>
  );
};

export default EditShippingCompany;
