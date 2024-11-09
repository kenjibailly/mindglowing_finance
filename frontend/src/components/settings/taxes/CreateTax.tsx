import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../Alert";

const CreateTax = () => {
  const [error, setError] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const navigate = useNavigate();

  const handleCreateTax = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Convert FormData to a JSON object
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/settings/taxes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Failed to create tax\n" + errorData.message);
      }

      // Parse the response to get the created tax data
      const taxData = await response.json();

      // Navigate to the customer's page using the _id from the response
      navigate(`/settings/taxes/${taxData._id}`);
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
        <Link className="link" to="/settings/taxes/">
          Taxes
        </Link>

        <form onSubmit={handleCreateTax}>
          <div className="separate">
            <h2>Create Tax</h2>

            <label htmlFor="tax_name">Name:</label>
            <input type="text" id="tax_name" name="tax_name" required />

            <label htmlFor="tax_percentage">Percentage:</label>
            <input
              type="number"
              id="tax_percentage"
              name="tax_percentage"
              required
            />

            <label htmlFor="tax_default">Default:</label>
            <label className="checkbox">
              <input type="checkbox" id="tax_default" name="tax_default" />
            </label>

            <label htmlFor="tax_description">Description:</label>
            <textarea id="tax_description" name="tax_description"></textarea>
          </div>

          <button type="submit">Create</button>
        </form>
      </div>
    </>
  );
};

export default CreateTax;
