import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../Alert";

const CreatePaymentMethod = () => {
  const [error, setError] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const navigate = useNavigate();

  const handleCreatePaymentMethod = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Convert FormData to a JSON object
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/settings/payment-methods/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          "Failed to create payment pethod\n" + errorData.message
        );
      }

      // Parse the response to get the created payment method data
      const paymentMethodData = await response.json();

      // Navigate to the customer's page using the _id from the response
      navigate(`/settings/payment-methods/${paymentMethodData._id}`);
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
        <Link className="link" to="/settings/payment-methods/">
          Payment Methods
        </Link>

        <form onSubmit={handleCreatePaymentMethod}>
          <div className="separate">
            <h2>Create Payment Method</h2>

            <label htmlFor="payment_method_name">Name:</label>
            <input
              type="text"
              id="payment_method_name"
              name="payment_method_name"
              required
            />

            <label htmlFor="payment_method_description">Description:</label>
            <textarea
              id="payment_method_description"
              name="payment_method_description"
            ></textarea>
          </div>

          <button type="submit">Create</button>
        </form>
      </div>
    </>
  );
};

export default CreatePaymentMethod;
