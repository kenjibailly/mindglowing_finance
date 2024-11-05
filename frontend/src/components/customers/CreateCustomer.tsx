import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CountriesOptionList from "../options/CountriesOptionList";
import CurrenciesOptionList from "../options/CurrenciesOptionList";
import { AddressDetails, AddressField } from "../types/Customers";
import useSameAddress from "../hooks/useSameAddress";
import useDatalist from "../hooks/useDatalist";
import useAddressDetails from "../hooks/useAddressDetails";
import Alert from "../Alert";

const CreateCustomer = () => {
  const [isSameAddress, setIsSameAddress] = useState<boolean>(true);
  const [error, setError] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const [addressDetails, setAddressDetails] = useState<AddressDetails>({
    billing_details: {
      street: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    shipping_details: {
      street: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });
  const currencyInputRef = useRef<HTMLInputElement>(null);
  const currencyDatalistRef = useRef<HTMLDataListElement>(null);

  const billingDetailsCountryInputRef = useRef<HTMLInputElement>(null);
  const billingDetailsCountryDatalistRef = useRef<HTMLDataListElement>(null);

  const shippingDetailsCountryInputRef = useRef<HTMLInputElement>(null);
  const shippingDetailsCountryDatalistRef = useRef<HTMLDataListElement>(null);
  const shippingDetailsDivRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useDatalist(currencyInputRef, currencyDatalistRef);
  useDatalist(
    billingDetailsCountryInputRef,
    billingDetailsCountryDatalistRef,
    false,
    {
      onSelect: (e) => handleAddressChange(e, "billing_details"),
    }
  );
  useDatalist(
    shippingDetailsCountryInputRef,
    shippingDetailsCountryDatalistRef,
    false,
    {
      onSelect: (e) => handleAddressChange(e, "shipping_details"),
    }
  );

  const handleAddressChange = useAddressDetails(
    isSameAddress,
    setAddressDetails
  );

  const handleShippingCheckboxChange = useSameAddress(
    setIsSameAddress,
    setAddressDetails,
    shippingDetailsDivRef
  );

  // Sync shipping details with billing only if `isSameAddress` is true
  useEffect(() => {
    if (isSameAddress) {
      setAddressDetails((prev) => ({
        ...prev,
        shipping_details: { ...prev.billing_details },
      }));
    }
  }, [isSameAddress]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData(e.currentTarget);
    const structuredData: Record<string, any> = {};

    formData.forEach((fieldValue, fieldName) => {
      // Split the field name by dots to handle nested keys
      const keySegments = fieldName.split(".");

      // Traverse and build the nested object structure
      keySegments.reduce((nestedObject, currentSegment, index) => {
        // If we are at the last segment, assign the field value
        if (index === keySegments.length - 1) {
          nestedObject[currentSegment] = fieldValue; // Assign the value to the current key
        } else {
          // Create a new nested object if it doesn't exist
          nestedObject[currentSegment] = nestedObject[currentSegment] || {};
        }
        // Return the current nested object for further traversal
        return nestedObject[currentSegment];
      }, structuredData); // Start the traversal with the structuredData object
    });

    try {
      const response = await fetch("/api/customers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(structuredData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Failed to create customer\n" + errorData.message);
      }

      // Parse the response to get the created customer data
      const customerData = await response.json();

      // Navigate to the customer's page using the _id from the response
      navigate(`/customers/${customerData._id}`);
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
      <div className="wrapper">
        <Link className="link" to="/customers/">
          Customers
        </Link>

        <form onSubmit={handleSubmit}>
          <div className="personal_information separate">
            <h2>Personal Information</h2>
            <label htmlFor="first_name">First Name:</label>
            <input
              type="text"
              id="first_name"
              name="personal_information.first_name"
              required
            />

            <label htmlFor="last_name">Last Name:</label>
            <input
              type="text"
              id="last_name"
              name="personal_information.last_name"
              required
            />

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="personal_information.email"
              required
            />

            <label htmlFor="company">Company:</label>
            <input
              type="text"
              id="company"
              name="personal_information.company"
            />

            <label htmlFor="currency">Currency:</label>
            <div className="data-list">
              <input
                list=""
                name="personal_information.currency"
                id="currency"
                className="data-list-input"
                autoComplete="off"
                ref={currencyInputRef}
                required
              />
              <datalist
                ref={currencyDatalistRef}
                className="data-list-datalist"
              >
                <CurrenciesOptionList />
              </datalist>
            </div>
          </div>

          <div>
            <div className="billing_details separate">
              <h2>Billing Details</h2>
              {Object.keys(addressDetails.billing_details).map((field) => {
                const fieldKey = field as AddressField;
                if (field !== "country") {
                  return (
                    <div key={fieldKey}>
                      <label htmlFor={`billing_${fieldKey}`}>
                        {fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)}:
                      </label>
                      <input
                        type="text"
                        id={`billing_${fieldKey}`}
                        name={`billing_details.${fieldKey}`}
                        value={addressDetails.billing_details[fieldKey]} // Use fieldKey here
                        onChange={(e) =>
                          handleAddressChange(e, "billing_details")
                        }
                      />
                    </div>
                  );
                }
              })}
              <label className="data-list-label" htmlFor="billing_country">
                Country:
              </label>
              <div className="data-list">
                <input
                  list="billing_countries"
                  name={"billing_details.country"}
                  className="data-list-input"
                  id="billing_country"
                  autoComplete="off"
                  ref={billingDetailsCountryInputRef}
                  value={addressDetails.billing_details.country}
                  onChange={(e) => handleAddressChange(e, "billing_details")}
                />
                <datalist
                  className="data-list-datalist"
                  ref={billingDetailsCountryDatalistRef}
                >
                  <CountriesOptionList />
                </datalist>
              </div>
              <label className="checkbox">
                <input
                  type="checkbox"
                  onChange={handleShippingCheckboxChange}
                  checked={isSameAddress}
                />
                Shipping same as billing
              </label>
            </div>

            <div
              ref={shippingDetailsDivRef}
              className="shipping_details separate hidden"
            >
              <h2>Shipping Details</h2>
              {Object.keys(addressDetails.shipping_details).map((field) => {
                if (field !== "country") {
                  const fieldKey = field as AddressField;
                  return (
                    <div key={fieldKey}>
                      <label htmlFor={`shipping_${fieldKey}`}>
                        {fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)}:
                      </label>
                      <input
                        type="text"
                        id={`shipping_${fieldKey}`}
                        name={`shipping_details.${fieldKey}`}
                        value={addressDetails.shipping_details[fieldKey]}
                        onChange={(e) =>
                          handleAddressChange(e, "shipping_details")
                        }
                      />
                    </div>
                  );
                }
              })}
              <label className="data-list-label" htmlFor="shipping_country">
                Country:
              </label>
              <div className="data-list">
                <input
                  list="shipping_countries"
                  name="shipping_details.country"
                  className="data-list-input"
                  id="shipping_country"
                  autoComplete="off"
                  value={addressDetails.shipping_details.country}
                  ref={shippingDetailsCountryInputRef}
                  onChange={(e) => handleAddressChange(e, "shipping_details")}
                />
                <datalist
                  ref={shippingDetailsCountryDatalistRef}
                  className="data-list-datalist"
                >
                  <CountriesOptionList />
                </datalist>
              </div>
            </div>
          </div>

          <div className="separate">
            <div className="contact_information">
              <h2>Contact Information</h2>

              <div className="input radio-buttons input-contact-medium">
                <label className="medium" htmlFor="preferred_contact_medium">
                  Preferred medium of contact:
                </label>
                <ul>
                  {[
                    "Email",
                    "Discord",
                    "Telegram",
                    "Instagram",
                    "Twitter",
                    "Other",
                  ].map((medium) => (
                    <li className="radio" key={medium}>
                      <input
                        type="radio"
                        id={medium}
                        name="contact_information.preferred_contact_medium"
                        value={medium}
                      />
                      <label htmlFor={medium}>{medium}</label>
                      <div className="check">
                        <div className="inside"></div>
                      </div>
                      {medium === "Other" && (
                        <input
                          className="other-option"
                          type="text"
                          name="contact_information.other_option_response"
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="contact-medium-username">
                <label htmlFor="contact_medium_username">
                  Contact Medium Username:
                </label>
                <input
                  type="text"
                  id="contact_medium_username"
                  name="contact_information.contact_medium_username"
                />
              </div>
            </div>
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
    </>
  );
};

export default CreateCustomer;
