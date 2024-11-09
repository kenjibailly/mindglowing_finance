import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../Alert";

const CreateDiscount = () => {
  const [error, setError] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const navigate = useNavigate();

  const handleCreateDiscount = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Convert FormData to a JSON object
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/settings/discounts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Failed to create discount\n" + errorData.message);
      }

      // Parse the response to get the created payment method data
      const discountData = await response.json();

      // Navigate to the customer's page using the _id from the response
      navigate(`/settings/discounts/${discountData._id}`);
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
        <Link className="link" to="/settings/discounts/">
          Payment Methods
        </Link>

        <form onSubmit={handleCreateDiscount}>
          <div className="separate">
            <h2>Create Payment Method</h2>

            <label htmlFor="discount_name">Name:</label>
            <input
              type="text"
              id="discount_name"
              name="discount_name"
              required
            />

            <label htmlFor="discount_code">Code:</label>
            <input
              type="text"
              id="discount_code"
              name="discount_code"
              required
            />

            <label htmlFor="discount_amount_total">Total Amount:</label>
            <input
              type="text"
              id="discount_amount_total"
              name="discount_amount_total"
            />

            <label htmlFor="discount_amount_percentage">
              Total Percentage:
            </label>
            <input
              type="text"
              id="discount_amount_percentage"
              name="discount_amount_percentage"
            />

            <label htmlFor="discount_description">Description:</label>
            <textarea
              id="discount_description"
              name="discount_description"
            ></textarea>
          </div>

          <button type="submit">Create</button>
        </form>
      </div>
    </>
  );
};

export default CreateDiscount;
