import { Link, useNavigate, useParams } from "react-router-dom";
import useCustomerData from "../hooks/useCustomerData";
import useDeleteItems from "../hooks/useDeleteItems";
import { useEffect, useRef, useState } from "react";
import Alert from "../Alert";
import Loader from "../Loader";
import useDatalist from "../hooks/useDatalist";
import CountriesOptionList from "../CountriesOptionList";

type AddressField = "street" | "street2" | "city" | "state" | "zip" | "country";
interface AddressDetails {
  billing: {
    street: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  shipping: {
    street: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

interface AddressType {
  billing: AddressDetails["billing"];
  shipping: AddressDetails["shipping"];
}

const EditCustomer = () => {
  const { id } = useParams<{ id: string }>();
  const {
    customerData,
    loading,
    error: customerError,
    fetchItems,
  } = useCustomerData(id);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSameAddress, setIsSameAddress] = useState<boolean>(true);
  const [preferredContactMedium, setPreferredContactMedium] = useState<string>(
    customerData
      ? customerData.contact_information.preferred_contact_medium
      : ""
  );

  const [addressDetails, setAddressDetails] = useState({
    billing: {
      street: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    shipping: {
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

  useEffect(() => {
    fetchItems();
  }, [id]);

  useEffect(() => {
    // Update the checkbox state when customerData changes
    if (customerData) {
      const checkSameAddress =
        JSON.stringify(customerData.shipping_details) ===
        JSON.stringify(customerData.billing_details);
      setIsSameAddress(checkSameAddress);
      toggleShipping(checkSameAddress);
      setPreferredContactMedium(
        customerData.contact_information.preferred_contact_medium
      );

      setAddressDetails({
        billing: {
          ...customerData.billing_details,
        },
        shipping: {
          ...customerData.shipping_details,
        },
      });
    }
  }, [customerData]);

  // Sync shipping details with billing only if `isSameAddress` is true
  useEffect(() => {
    if (isSameAddress) {
      setAddressDetails((prev) => ({
        ...prev,
        shipping: { ...prev.billing },
      }));
    }
  }, [isSameAddress]);

  useDatalist(currencyInputRef, currencyDatalistRef, loading);
  useDatalist(
    billingDetailsCountryInputRef,
    billingDetailsCountryDatalistRef,
    loading
  );
  useDatalist(
    shippingDetailsCountryInputRef,
    shippingDetailsCountryDatalistRef,
    loading
  );

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

  const shippingCheckBoxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.target.checked;
    setIsSameAddress(checked);

    toggleShipping(checked);
  };

  const toggleShipping = (checked: boolean) => {
    if (shippingDetailsDivRef.current) {
      if (checked) {
        // shippingDetailsDivRef.current.classList.add("hidden");
        setAddressDetails((prev) => ({
          ...prev,
          shipping: checked ? { ...prev.billing } : prev.shipping,
        }));
      } else {
        shippingDetailsDivRef.current.classList.remove("hidden");
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    addressType: keyof AddressType // Use keyof AddressType to limit the address types
  ) => {
    const { name, value } = e.target;

    setAddressDetails((prev) => {
      const keys = name.split("."); // Split the name to get the nested keys
      const updatedDetails: AddressType = { ...prev }; // Explicitly define type

      // Use reduce to update the correct field in the nested address
      keys.reduce((acc: any, key: string, index: number) => {
        // Ensure we're working with an object
        if (typeof acc === "object" && acc !== null) {
          if (index === keys.length - 1) {
            acc[key] = value; // Update the value for the last key
          } else {
            // Ensure we have a nested object for the key
            acc[key] = acc[key] || {};
          }
        }
        return acc[key]; // Continue the traversal
      }, updatedDetails[addressType]);

      // If isSameAddress is true and we're updating billing, also update shipping
      if (isSameAddress && addressType === "billing") {
        updatedDetails.shipping = { ...updatedDetails.billing }; // Synchronize shipping with billing
      }

      return updatedDetails; // Return updated address details
    });
  };

  const changePreferredContactMedium = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPreferredContactMedium(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget as HTMLFormElement;
    const formData = new FormData(formElement);

    if (customerData) {
      try {
        // Convert FormData to a plain object
        const data: Record<string, any> = {};
        formData.forEach((value, key) => {
          const keys = key.split("."); // Split the key by dot notation
          keys.reduce((acc, curr, index) => {
            if (index === keys.length - 1) {
              acc[curr] = value; // Assign the value to the last key
            } else {
              acc[curr] = acc[curr] || {}; // Create nested object if not present
            }
            return acc[curr];
          }, data);
        });
        const response = await fetch(
          `/api/customers/edit/${customerData._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          setSuccess("Customer updated successfully!");
        } else {
          setError(
            "Could not update customer.\n\n" +
              response.status +
              " " +
              response.statusText
          );
        }
      } catch (error) {
        setError("Could not update customer.");
        console.error("Error submitting form:", error);
      }
    }
  };

  if (deleteError || customerError) {
    return <Alert message={deleteError || customerError} type="error" />;
  }

  if (loading || deleting) {
    <Loader fullPage={false} />;
  }

  if (!customerData) {
    return <Loader fullPage={true} />;
  }

  return (
    <>
      {error && (
        <Alert message={error || deleteError || customerError} type="error" />
      )}
      {success && <Alert message={success} type="success" />}
      <div className="wrapper">
        <Link className="link" to="/customers/">
          Customers
        </Link>

        <button onClick={handleDeleteCustomer}>Delete</button>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="separate">
            <h2>Personal Information</h2>
            <label htmlFor="first_name">First Name:</label>
            <input
              type="text"
              id="first_name"
              name="personal_information.first_name"
              defaultValue={customerData.personal_information.first_name}
              required
            />

            <label htmlFor="last_name">Last Name:</label>
            <input
              type="text"
              id="last_name"
              name="personal_information.last_name"
              defaultValue={customerData.personal_information.last_name}
              required
            />

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="personal_information.email"
              defaultValue={customerData.personal_information.email}
              required
            />

            <label htmlFor="company">Company:</label>
            <input
              type="text"
              id="company"
              name="personal_information.company"
              defaultValue={customerData.personal_information.company}
            />

            <label htmlFor="currency">Currency:</label>
            <div className="data-list">
              <input
                list=""
                name="personal_information.currency"
                id="currency"
                className="data-list-input"
                autoComplete="off"
                defaultValue={
                  customerData.personal_information.currency_name +
                  " (" +
                  customerData.personal_information.currency_symbol +
                  ")"
                }
                ref={currencyInputRef}
                required
              />
              <datalist
                ref={currencyDatalistRef}
                className="data-list-datalist"
              >
                <option value="ALL (Lek)">ALL (Lek)</option>
                <option value="AFN (؋)">AFN (؋)</option>
                <option value="ARS ($)">ARS ($)</option>
                <option value="AWG (ƒ)">AWG (ƒ)</option>
                <option value="AUD ($)">AUD ($)</option>
                <option value="AZN (₼)">AZN (₼)</option>
                <option value="BSD ($)">BSD ($)</option>
                <option value="BDT (৳)">BDT (৳)</option>
                <option value="BBD ($)">BBD ($)</option>
                <option value="BYN (Br)">BYN (Br)</option>
                <option value="BZD (BZ$)">BZD (BZ$)</option>
                <option value="BMD ($)">BMD ($)</option>
                <option value="BOB ($b)">BOB ($b)</option>
                <option value="BAM (KM)">BAM (KM)</option>
                <option value="BWP (P)">BWP (P)</option>
                <option value="BGN (лв)">BGN (лв)</option>
                <option value="BRL (R$)">BRL (R$)</option>
                <option value="BND ($)">BND ($)</option>
                <option value="KHR (៛)">KHR (៛)</option>
                <option value="CAD ($)">CAD ($)</option>
                <option value="KYD ($)">KYD ($)</option>
                <option value="CLP ($)">CLP ($)</option>
                <option value="CNY (¥)">CNY (¥)</option>
                <option value="COP ($)">COP ($)</option>
                <option value="CRC (₡)">CRC (₡)</option>
                <option value="HRK (kn)">HRK (kn)</option>
                <option value="CUP (₱)">CUP (₱)</option>
                <option value="CZK (Kč)">CZK (Kč)</option>
                <option value="DKK (kr)">DKK (kr)</option>
                <option value="DOP (RD$)">DOP (RD$)</option>
                <option value="XCD ($)">XCD ($)</option>
                <option value="EGP (£)">EGP (£)</option>
                <option value="SVC ($)">SVC ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="FKP (£)">FKP (£)</option>
                <option value="FJD ($)">FJD ($)</option>
                <option value="GHS (¢)">GHS (¢)</option>
                <option value="GIP (£)">GIP (£)</option>
                <option value="GTQ (Q)">GTQ (Q)</option>
                <option value="GGP (£)">GGP (£)</option>
                <option value="GYD ($)">GYD ($)</option>
                <option value="HNL (L)">HNL (L)</option>
                <option value="HKD ($)">HKD ($)</option>
                <option value="HUF (Ft)">HUF (Ft)</option>
                <option value="ISK (kr)">ISK (kr)</option>
                <option value="INR (₹)">INR (₹)</option>
                <option value="IDR (Rp)">IDR (Rp)</option>
                <option value="IRR (﷼)">IRR (﷼)</option>
                <option value="IMP (£)">IMP (£)</option>
                <option value="ILS (₪)">ILS (₪)</option>
                <option value="JMD (J$)">JMD (J$)</option>
                <option value="JPY (¥)">JPY (¥)</option>
                <option value="JEP (£)">JEP (£)</option>
                <option value="KZT (лв)">KZT (лв)</option>
                <option value="KPW (₩)">KPW (₩)</option>
                <option value="KRW (₩)">KRW (₩)</option>
                <option value="KGS (лв)">KGS (лв)</option>
                <option value="LAK (₭)">LAK (₭)</option>
                <option value="LBP (£)">LBP (£)</option>
                <option value="LRD ($)">LRD ($)</option>
                <option value="MKD (ден)">MKD (ден)</option>
                <option value="MYR (RM)">MYR (RM)</option>
                <option value="MUR (₨)">MUR (₨)</option>
                <option value="MXN ($)">MXN ($)</option>
                <option value="MNT (₮)">MNT (₮)</option>
                <option value="MNT (د.إ)">MNT (د.إ)</option>
                <option value="MZN (MT)">MZN (MT)</option>
                <option value="NAD ($)">NAD ($)</option>
                <option value="NPR (₨)">NPR (₨)</option>
                <option value="ANG (ƒ)">ANG (ƒ)</option>
                <option value="NZD ($)">NZD ($)</option>
                <option value="NIO (C$)">NIO (C$)</option>
                <option value="NGN (₦)">NGN (₦)</option>
                <option value="NOK (kr)">NOK (kr)</option>
                <option value="OMR (﷼)">OMR (﷼)</option>
                <option value="PKR (₨)">PKR (₨)</option>
                <option value="PAB (B/.)">PAB (B/.)</option>
                <option value="PYG (Gs)">PYG (Gs)</option>
                <option value="PEN (S/.)">PEN (S/.)</option>
                <option value="PHP (₱)">PHP (₱)</option>
                <option value="PLN (zł)">PLN (zł)</option>
                <option value="QAR (﷼)">QAR (﷼)</option>
                <option value="RON (lei)">RON (lei)</option>
                <option value="RUB (₽)">RUB (₽)</option>
                <option value="SHP (£)">SHP (£)</option>
                <option value="SAR (﷼)">SAR (﷼)</option>
                <option value="RSD (Дин.)">RSD (Дин.)</option>
                <option value="SCR (₨)">SCR (₨)</option>
                <option value="SGD ($)">SGD ($)</option>
                <option value="SBD ($)">SBD ($)</option>
                <option value="SOS (S)">SOS (S)</option>
                <option value="KRW (₩)">KRW (₩)</option>
                <option value="ZAR (R)">ZAR (R)</option>
                <option value="LKR (₨)">LKR (₨)</option>
                <option value="SEK (kr)">SEK (kr)</option>
                <option value="CHF (CHF)">CHF (CHF)</option>
                <option value="SRD ($)">SRD ($)</option>
                <option value="SYP (£)">SYP (£)</option>
                <option value="TWD (NT$)">TWD (NT$)</option>
                <option value="THB (฿)">THB (฿)</option>
                <option value="TTD (TT$)">TTD (TT$)</option>
                <option value="TRY (₺)">TRY (₺)</option>
                <option value="TVD ($)">TVD ($)</option>
                <option value="UAH (₴)">UAH (₴)</option>
                <option value="AED (د.إ)">AED (د.إ)</option>
                <option value="GBP (£)">GBP (£)</option>
                <option value="USD ($)">USD ($)</option>
                <option value="UYU ($U)">UYU ($U)</option>
                <option value="UZS (лв)">UZS (лв)</option>
                <option value="VEF (Bs)">VEF (Bs)</option>
                <option value="VND (₫)">VND (₫)</option>
                <option value="YER (﷼)">YER (﷼)</option>
                <option value="XOF (F.CFA)">XOF (F.CFA)</option>
                <option value="ZWD (Z$)">ZWD (Z$)</option>
              </datalist>
            </div>
          </div>

          <div>
            <div className="billing_details separate">
              <h2>Billing Details</h2>
              {Object.keys(addressDetails.billing).map((field) => {
                const fieldKey = field as AddressField; // Type assertion
                if (field !== "country") {
                  return (
                    <div key={fieldKey}>
                      <label htmlFor={`billing_${fieldKey}`}>
                        {fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)}:
                      </label>
                      <input
                        type="text"
                        id={`billing_details.${fieldKey}`}
                        name={`billing_details.${fieldKey}`}
                        value={addressDetails.billing[fieldKey]} // Use fieldKey here
                        onChange={(e) => handleInputChange(e, "billing")}
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
                  name="billing_details.country"
                  className="data-list-input"
                  id="billing_country"
                  autoComplete="off"
                  value={addressDetails.billing.country}
                  onChange={(e) => handleInputChange(e, "billing")}
                />
                <datalist
                  id="billing_countries"
                  className="data-list-datalist"
                  ref={billingDetailsCountryDatalistRef}
                >
                  <CountriesOptionList />
                </datalist>
              </div>
              <label className="checkbox">
                <input
                  type="checkbox"
                  onChange={shippingCheckBoxChange}
                  checked={isSameAddress}
                />
                Shipping same as billing
              </label>
            </div>

            <div
              ref={shippingDetailsDivRef}
              className="shipping_details separate"
            >
              <h2>Shipping Details</h2>
              {Object.keys(addressDetails.shipping).map((field) => {
                if (field !== "country") {
                  const fieldKey = field as AddressField;
                  return (
                    <div key={fieldKey}>
                      <label htmlFor={`shipping_${fieldKey}`}>
                        {fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)}:
                      </label>
                      <input
                        type="text"
                        id={`shipping_details.${fieldKey}`}
                        name={`shipping_details.${fieldKey}`}
                        value={addressDetails.shipping[fieldKey]}
                        onChange={(e) => handleInputChange(e, "shipping")}
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
                  value={addressDetails.shipping.country}
                  onChange={(e) => handleInputChange(e, "shipping")}
                />
                <datalist
                  id="shipping_countries"
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
                        onChange={changePreferredContactMedium}
                        checked={preferredContactMedium === medium}
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
                          defaultValue={
                            customerData.contact_information
                              .other_option_response
                          }
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
                  defaultValue={
                    customerData.contact_information.contact_medium_username
                  }
                />
              </div>
            </div>
          </div>
          <button type="submit">Update</button>
        </form>
      </div>
    </>
  );
};

export default EditCustomer;
