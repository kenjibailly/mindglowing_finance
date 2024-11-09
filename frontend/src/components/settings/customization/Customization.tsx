import { useEffect, useState } from "react";
import useFetchData from "../../hooks/useFetchData";
import { CustomizationSettings } from "../../types/CustomizationSettings";
import Alert from "../../Alert";
import Loader from "../../Loader";

const Customization = () => {
  const [error, setError] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const [success, setSuccess] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const {
    data: customizationData,
    loading: customizationLoading,
    error: customizationError,
    fetchItems: customizationFetch,
  } = useFetchData<CustomizationSettings>({
    id: "",
    endpoint: "settings/customization",
  });

  useEffect(() => {
    customizationFetch();
  }, []);

  const handleEditCustomizationSettings = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // Type-cast event.target to HTMLFormElement
    const form = event.target as HTMLFormElement;

    // Create a new FormData instance
    const formData = new FormData(form);

    // Convert FormData to a JSON object
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`/api/settings/customization/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess({
          message: "Customization settings successfully edited!",

          id: Date.now(),
        });
      } else {
        const errorData = await response.json();
        throw new Error(
          "Failed to edit customization settings.\n" + errorData.message
        );
      }
    } catch (error) {
      console.log(error);
      setError({
        message: (error as Error).message || "An unknown error occurred",
        id: Date.now(),
      });
    }
  };

  if (customizationError) {
    return (
      <Alert
        key={customizationError.id}
        message={customizationError.message}
        type="error"
        scroll={true}
      />
    );
  }

  if (!customizationData || customizationLoading) {
    return <Loader fullPage={true} />;
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
      {success && (
        <Alert
          key={success.id}
          message={success.message}
          type="success"
          scroll={true}
        />
      )}
      <div className="settings-wrapper">
        <form onSubmit={handleEditCustomizationSettings}>
          <div className="separate">
            <label htmlFor="invoice_prefix">Invoice Prefix:</label>
            <input
              type="text"
              id="invoice_prefix"
              name="invoice_prefix"
              defaultValue={customizationData.invoice_prefix}
              required
            />

            <label htmlFor="invoice_separator">Invoice Separator:</label>
            <input
              type="text"
              id="invoice_separator"
              name="invoice_separator"
              defaultValue={customizationData.invoice_separator}
              required
            />

            <label htmlFor="estimate_prefix">Estimate Prefix:</label>
            <input
              type="text"
              id="estimate_prefix"
              name="estimate_prefix"
              defaultValue={customizationData.estimate_prefix}
              required
            />

            <label htmlFor="estimate_separator">Estimate Separator:</label>
            <input
              type="text"
              id="estimate_separator"
              name="estimate_separator"
              defaultValue={customizationData.estimate_separator}
              required
            />

            <label htmlFor="items_per_page">Items Per Page:</label>
            <input
              type="number"
              id="items_per_page"
              name="items_per_page"
              defaultValue={customizationData.items_per_page}
              required
            />
          </div>

          <button type="submit">Update</button>
        </form>
      </div>
    </>
  );
};

export default Customization;
