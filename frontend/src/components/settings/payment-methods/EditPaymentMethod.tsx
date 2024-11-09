import { Link, useParams } from "react-router-dom";
import { PaymentMethod } from "../../types/PaymentMethods";
import useFetchData from "../../hooks/useFetchData";
import Loader from "../../Loader";
import Alert from "../../Alert";
import { useEffect, useState } from "react";

const EditPaymentMethod = () => {
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
    data: paymentMethodData,
    loading: paymentMethodLoading,
    error: paymentMethodError,
    fetchItems: paymentMethodFetch,
  } = useFetchData<PaymentMethod>({
    id: "",
    endpoint: `settings/payment-methods/${id}`,
  });

  useEffect(() => {
    paymentMethodFetch();
  }, []);

  const handleEditPaymentMethod = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Convert FormData to a JSON object
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await fetch(`/api/settings/payment-methods/edit/${id}`, {
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
        throw new Error("Failed to edit payment method\n" + errorData.message);
      }

      // Navigate to the customer's page using the _id from the response
    } catch (error) {
      setError({
        message: (error as Error).message || "An unknown error occurred",
        id: Date.now(),
      });
    }
  };

  if (!paymentMethodData || paymentMethodLoading) {
    return <Loader fullPage={true} />;
  }

  if (paymentMethodError) {
    return (
      <Alert
        key={paymentMethodError.id}
        message={paymentMethodError.message}
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
        <Link className="link" to={`/settings/payment-methods/`}>
          Payment Methods
        </Link>

        <form onSubmit={handleEditPaymentMethod}>
          <div className="separate">
            <label htmlFor="payment_method_name">Name:</label>
            <input
              type="text"
              id="payment_method_name"
              name="payment_method_name"
              defaultValue={paymentMethodData.name}
              required
            />

            <label htmlFor="payment_method_description">Description:</label>
            <textarea
              id="payment_method_description"
              name="payment_method_description"
              defaultValue={paymentMethodData.description}
            ></textarea>
          </div>

          <button type="submit">Update</button>
        </form>
      </div>
    </>
  );
};

export default EditPaymentMethod;
