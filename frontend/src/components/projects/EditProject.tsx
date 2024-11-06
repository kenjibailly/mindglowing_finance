import { useEffect, useRef, useState } from "react";
import Alert from "../Alert";
import useDatalist from "../hooks/useDatalist";
import useFetchData from "../hooks/useFetchData";
import { CustomersFetch as CustomerData } from "../types/Customers";
import { ProjectFetch } from "../types/Projects";
import { Link, useParams } from "react-router-dom";
import Loader from "../Loader";

const EditProject = () => {
  const { id } = useParams<{ id: string }>();
  const customerInputRef = useRef<HTMLInputElement>(null);
  const customerDataListRef = useRef<HTMLDataListElement>(null);
  useDatalist(customerInputRef, customerDataListRef);
  const {
    data: customersData,
    loading: customersLoading,
    error: fetchCustomersError,
    fetchItems: fetchCustomersItems,
  } = useFetchData<CustomerData>({
    id: "",
    endpoint: "customers",
  });

  const {
    data: projectData,
    loading: projectLoading,
    error: fetchProjectError,
    fetchItems: fetchProjectItems,
  } = useFetchData<ProjectFetch>({
    id: id,
    endpoint: "projects",
  });

  const [error, setError] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const [success, setSuccess] = useState<{
    message: string;
    id: number;
  } | null>(null);

  useEffect(() => {
    fetchCustomersItems();
    fetchProjectItems();
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
      const response = await fetch(`/api/projects/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess({ message: "Project successfully edited!", id: Date.now() });
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

  if (customersLoading || projectLoading) {
    <Loader fullPage={true} />;
  }

  const errorData = error || fetchCustomersError || fetchProjectError;

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
      {success && (
        <Alert
          key={success.id}
          message={success.message}
          type="success"
          scroll={true}
        />
      )}
      <div className="wrapper edit-project">
        <Link className="link" to={`/projects/${id}`}>
          {projectData?.project.name}
        </Link>

        <form onSubmit={handleEditProject} className="edit-projec-form">
          <div className="separate">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="project_name"
              required
              defaultValue={projectData?.project.name}
            />

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
                defaultValue={projectData?.customer_name}
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
                    defaultValue={
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
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={projectData?.project.description}
            ></textarea>
          </div>
          <button type="submit">Edit</button>
        </form>
      </div>
    </>
  );
};

export default EditProject;
