import { useNavigate, useParams } from "react-router-dom";
import Alert from "../Alert";
import { useEffect, useRef, useState } from "react";
import { CustomersFetch as CustomerData } from "../types/Customers";
import useFetchData from "../hooks/useFetchData";
import Loader from "../Loader";
import useDatalist from "../hooks/useDatalist";

const CreateProject = () => {
  const customerInputRef = useRef<HTMLInputElement>(null);
  const customerDataListRef = useRef<HTMLDataListElement>(null);
  useDatalist(customerInputRef, customerDataListRef);
  const {
    data: customersData,
    loading: customersLoading,
    error: fetchCustomersError,
    fetchItems,
  } = useFetchData<CustomerData>({
    id: "",
    endpoint: "customers",
  });

  const [error, setError] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEditProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    // Retrieve the selected customer name from the `customer_name` input
    const selectedCustomerName = form.customer_name.value;

    // Find the customer that matches the selected name
    const selectedCustomer = customersData?.items.find(
      (customer) =>
        customer.personal_information.company === selectedCustomerName ||
        customer.personal_information.first_name === selectedCustomerName
    );

    // Set the `customer_id` hidden input to the selected customer's ID
    if (selectedCustomer) {
      form["selected-customer-id"].value = selectedCustomer._id;
    }

    const formData = new FormData(form);

    // Convert FormData to a JSON object
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        navigate(`/projects/${result._id}`);
      } else {
        const errorData = await response.json();
        throw new Error("Failed to create product.\n" + errorData.message);
      }
    } catch (error) {
      console.log(error);
      setError({
        message: (error as Error).message || "An unknown error occurred",
        id: Date.now(),
      });
    }
  };

  if (customersLoading) {
    <Loader fullPage={true} />;
  }

  const errorData = error || fetchCustomersError;

  return (
    <>
      {errorData && (
        <Alert
          key={errorData.id}
          message={errorData.message}
          type="error"
          scroll={true}
        />
      )}
      <div className="wrapper create-project">
        <a className="link" href="/projects/">
          Projects
        </a>

        <form onSubmit={handleEditProject}>
          <div className="separate">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="project_name" required />

            <label htmlFor="customer_id">Customer:</label>
            <div className="data-list">
              <input
                list=""
                name="customer_name"
                id="customer"
                className="data-list-input"
                autoComplete="off"
                role="combobox"
                required
                ref={customerInputRef}
              />
              <datalist
                role="listbox"
                className="data-list-datalist"
                id="customer-options"
                ref={customerDataListRef}
              >
                {customersData?.items.map((customer) => (
                  <option
                    key={customer._id}
                    value={
                      customer.personal_information.company
                        ? customer.personal_information.company
                        : customer.personal_information.first_name
                    }
                    data-id={customer._id}
                  >
                    {customer.personal_information.company
                      ? customer.personal_information.company
                      : customer.personal_information.first_name}
                  </option>
                ))}
              </datalist>
            </div>
            <input type="hidden" name="customer_id" id="selected-customer-id" />
            <label htmlFor="description">Description:</label>
            <textarea id="description" name="description" rows={4}></textarea>
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
    </>
  );
};

export default CreateProject;
