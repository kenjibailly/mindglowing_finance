import { Link, useParams } from "react-router-dom";
import { Discount } from "../../types/Discounts";
import useFetchData from "../../hooks/useFetchData";
import Loader from "../../Loader";
import Alert from "../../Alert";
import { useEffect, useState } from "react";

const EditDiscount = () => {
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
    data: discountData,
    loading: discountLoading,
    error: discountError,
    fetchItems: discountFetch,
  } = useFetchData<Discount>({
    id: "",
    endpoint: `settings/discounts/${id}`,
  });

  useEffect(() => {
    discountFetch();
  }, []);

  const handleEditDiscount = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Convert FormData to a JSON object
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await fetch(`/api/settings/discounts/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess({
          message: "Successfully edited payment method",
          id: Date.now(),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Failed to edit discount\n" + errorData.message);
      }

      // Navigate to the customer's page using the _id from the response
    } catch (error) {
      setError({
        message: (error as Error).message || "An unknown error occurred",
        id: Date.now(),
      });
    }
  };

  if (!discountData || discountLoading) {
    return <Loader fullPage={true} />;
  }

  if (discountError) {
    return (
      <Alert
        key={discountError.id}
        message={discountError.message}
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
        <Link className="link" to={`/settings/discounts/`}>
          Discounts
        </Link>

        <form onSubmit={handleEditDiscount}>
          <div className="separate">
            <label htmlFor="discount_name">Name:</label>
            <input
              type="text"
              id="discount_name"
              name="discount_name"
              defaultValue={discountData.name}
              required
            />

            <label htmlFor="discount_code">Code:</label>
            <input
              type="text"
              id="discount_code"
              name="discount_code"
              defaultValue={discountData.code}
              required
            />

            <label htmlFor="discount_amount_total">Total Amount:</label>
            <input
              type="text"
              id="discount_amount_total"
              name="discount_amount_total"
              defaultValue={discountData.amount.total}
            />

            <label htmlFor="discount_amount_percentage">
              Percentage Amount:
            </label>
            <input
              type="text"
              id="discount_amount_percentage"
              name="discount_amount_percentage"
              defaultValue={discountData.amount.percentage}
            />

            <label htmlFor="discount_description">Description:</label>
            <textarea
              id="discount_description"
              name="discount_description"
              defaultValue={discountData.description}
            ></textarea>
          </div>

          <button type="submit">Update</button>
        </form>
      </div>
    </>
  );
};

export default EditDiscount;
