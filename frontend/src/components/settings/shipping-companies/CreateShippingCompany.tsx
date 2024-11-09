import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../Alert";

const CreateShippingCompany = () => {
  const [error, setError] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const navigate = useNavigate();

  const handleCreateShippingCompany = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Convert FormData to a JSON object
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/settings/shipping-companies/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          "Failed to create shipping company\n" + errorData.message
        );
      }

      // Parse the response to get the created shipping company data
      const shippingCompanyData = await response.json();

      // Navigate to the customer's page using the _id from the response
      navigate(`/settings/shipping-companies/${shippingCompanyData._id}`);
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
      <div className="settings-wrapper">
        <Link className="link" to="/settings/shipping-companies/">
          Shipping Companies
        </Link>

        <form onSubmit={handleCreateShippingCompany}>
          <div className="separate">
            <h2>Create Shipping Company</h2>

            <label htmlFor="shipping_company_name">Name:</label>
            <input
              type="text"
              id="shipping_company_name"
              name="shipping_company_name"
              required
            />

            <label htmlFor="shipping_company_description">Description:</label>
            <textarea
              id="shipping_company_description"
              name="shipping_company_description"
            ></textarea>
          </div>

          <button type="submit">Create</button>
        </form>
      </div>
    </>
  );
};

export default CreateShippingCompany;
