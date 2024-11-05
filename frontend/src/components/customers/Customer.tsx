import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../Alert";
import Loader from "../Loader";
import "../../stylesheets/overview/overview.css";
import useDeleteItems from "../hooks/useDeleteItems";
import { Customer as CustomerData } from "../types/Customers";
import useFetchData from "../hooks/useFetchData";

const Customer = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: customerData,
    loading,
    error,
    fetchItems,
  } = useFetchData<CustomerData>({
    id: id,
    endpoint: "customers",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, [id]);

  const {
    handleDeleteSelected,
    loading: deleting,
    error: deleteError,
  } = useDeleteItems();

  const handleDeleteCustomer = async () => {
    if (id) {
      await handleDeleteSelected("/api/customers/delete", id);
      if (!deleteError) {
        navigate("/customers");
      }
    }
  };

  if (error) {
    return <Alert message={error} type="error" scroll={true} />;
  }

  if (loading || deleting) {
    <Loader fullPage={false} />;
  }

  if (!customerData) {
    return <Loader fullPage={true} />;
  }

  return (
    <>
      {deleteError && (
        <Alert
          key={deleteError.id}
          message={deleteError.message}
          type="error"
          scroll={true}
        />
      )}
      <div className="wrapper customer-overview">
        <a className="link" href="/customers/">
          Customers
        </a>
        <a className="button" href={`/customers/edit/${customerData._id}`}>
          Edit Customer
        </a>

        <div className="alert alert-success hidden" role="alert">
          Customer edited!
        </div>

        <button onClick={handleDeleteCustomer}>Delete</button>

        <div className="overview">
          <div className="separate">
            <h2>Personal Information</h2>
            <div className="inline">
              <p>First Name:</p>
              <p>{customerData.personal_information.first_name}</p>
            </div>
            <div className="inline">
              <p>Last Name:</p>
              <p>{customerData.personal_information.last_name}</p>
            </div>
            <div className="inline">
              <p>Email:</p>
              <p>{customerData.personal_information.email}</p>
            </div>
            <div className="inline">
              <p>Company:</p>
              <p>{customerData.personal_information.company}</p>
            </div>
            <div className="inline">
              <p>Currency:</p>
              <p>
                {customerData.personal_information.currency_name} (
                {customerData.personal_information.currency_symbol})
              </p>
            </div>
          </div>

          <div className="inline">
            <div className="separate half">
              <h2>Billing Details:</h2>
              <div className="inline">
                <p>Street:</p>
                <p>{customerData.billing_details.street}</p>
              </div>
              <div className="inline">
                <p>Street 2:</p>
                <p>{customerData.billing_details.street2}</p>
              </div>
              <div className="inline">
                <p>City:</p>
                <p>{customerData.billing_details.city}</p>
              </div>
              <div className="inline">
                <p>State:</p>
                <p>{customerData.billing_details.state}</p>
              </div>
              <div className="inline">
                <p>ZIP:</p>
                <p>{customerData.billing_details.zip}</p>
              </div>
              <div className="inline">
                <p>Country:</p>
                <p>{customerData.billing_details.country}</p>
              </div>
            </div>

            <div className="separate half">
              <h2>Shipping Details:</h2>
              <div className="inline">
                <p>Street:</p>
                <p>{customerData.shipping_details.street}</p>
              </div>
              <div className="inline">
                <p>Street 2:</p>
                <p>{customerData.shipping_details.street2}</p>
              </div>
              <div className="inline">
                <p>City:</p>
                <p>{customerData.shipping_details.city}</p>
              </div>
              <div className="inline">
                <p>State:</p>
                <p>{customerData.shipping_details.state}</p>
              </div>
              <div className="inline">
                <p>ZIP:</p>
                <p>{customerData.shipping_details.zip}</p>
              </div>
              <div className="inline">
                <p>Country:</p>
                <p>{customerData.shipping_details.country}</p>
              </div>
            </div>
          </div>

          <div className="separate">
            <h2>Contact Information</h2>
            <div className="inline">
              <p>Preferred Contact Medium:</p>
              <p>
                {customerData.contact_information.preferred_contact_medium !==
                "Other"
                  ? customerData.contact_information.preferred_contact_medium
                  : customerData.contact_information.other_option_response}
              </p>
            </div>
            {customerData.contact_information.contact_medium_username && (
              <div className="inline">
                <p>Contact Medium Username:</p>
                <p>
                  {customerData.contact_information.contact_medium_username}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Customer;
