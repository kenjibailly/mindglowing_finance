import { Link, useParams } from "react-router-dom";
import { Tax } from "../../types/Taxes";
import useFetchData from "../../hooks/useFetchData";
import Loader from "../../Loader";
import Alert from "../../Alert";
import { useEffect, useState } from "react";

const EditTax = () => {
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
    data: taxData,
    loading: taxLoading,
    error: taxError,
    fetchItems: taxFetch,
  } = useFetchData<Tax>({
    id: "",
    endpoint: `settings/taxes/${id}`,
  });

  useEffect(() => {
    taxFetch();
  }, []);

  const handleEditTax = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Convert FormData to a JSON object
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await fetch(`/api/settings/taxes/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess({
          message: "Successfully edited tax",
          id: Date.now(),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Failed to edit tax\n" + errorData.message);
      }

      // Navigate to the customer's page using the _id from the response
    } catch (error) {
      setError({
        message: (error as Error).message || "An unknown error occurred",
        id: Date.now(),
      });
    }
  };

  if (!taxData || taxLoading) {
    return <Loader fullPage={true} />;
  }

  if (taxError) {
    return (
      <Alert
        key={taxError.id}
        message={taxError.message}
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
        <Link className="link" to={`/settings/taxes/`}>
          Taxes
        </Link>

        <form onSubmit={handleEditTax}>
          <div className="separate">
            <label htmlFor="tax_name">Name:</label>
            <input
              type="text"
              id="tax_name"
              name="tax_name"
              defaultValue={taxData.name}
              required
            />

            <label htmlFor="tax_percentage">Percentage:</label>
            <input
              type="number"
              id="tax_percentage"
              name="tax_percentage"
              defaultValue={taxData.percentage}
              required
            />

            <label htmlFor="tax_default">Default:</label>
            <label className="checkbox">
              <input
                type="checkbox"
                id="tax_default"
                name="tax_default"
                defaultChecked={taxData.default}
              />
            </label>

            <label htmlFor="tax_description">Description:</label>
            <textarea
              id="tax_description"
              name="tax_description"
              defaultValue={taxData.description}
            ></textarea>
          </div>

          <button type="submit">Update</button>
        </form>
      </div>
    </>
  );
};

export default EditTax;
