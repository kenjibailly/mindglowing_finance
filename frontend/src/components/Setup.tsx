import React, { useRef, useState } from "react";
import "../stylesheets/form/form.css";
import useDatalist from "./hooks/useDatalist"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import CountriesOptionList from "./CountriesOptionList";

const Setup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const currencyInputRef = useRef<HTMLInputElement>(null);
  const currencyDatalistRef = useRef<HTMLDataListElement>(null);

  const { user, setUser } = useAuth();

  if (user && !user.user.setup) {
    navigate("/dashboard");
    return;
  }

  const countryInputRef = useRef<HTMLInputElement>(null);
  const countryDatalistRef = useRef<HTMLDataListElement>(null);

  useDatalist(currencyInputRef, currencyDatalistRef);
  useDatalist(countryInputRef, countryDatalistRef);

  const previewImageRef = useRef<HTMLImageElement>(null);

  const previewImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Access the first file if available
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string); // Set the image URL to state
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget as HTMLFormElement;
    const formData = new FormData(formElement);

    const response = await fetch("/api/setup", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      if (user) {
        setUser({
          ...user,
          user: {
            ...user.user,
            setup: false, // Update the setup property
          },
        });
      }
      navigate("/dashboard");
    } else {
      console.error("Form submission failed:", response.statusText);
      setError("Something went wrong, please try again later.");
    }
  };

  return (
    <>
      <h1>SETUP</h1>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="date_format">Select Date Format:</label>
        <select name="date_format" id="date_format" required>
          <option value="en-GB">DD/MM/YYYY</option>
          <option value="en-US">MM/DD/YYYY</option>
          <option value="zh-Hans-CN">YYYY/MM/DD</option>
        </select>

        <label htmlFor="currency">Select Currency:</label>
        <div className="data-list">
          <input
            list=""
            name="currency"
            id="currency"
            className="data-list-input"
            autoComplete="off"
            role="combobox"
            required
            ref={currencyInputRef}
          />
          <datalist
            role="listbox"
            className="data-list-datalist"
            ref={currencyDatalistRef}
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

        <div className="personal-information">
          <label htmlFor="personal_information.first_name">First Name:</label>
          <input
            type="text"
            id="personal_information.first_name"
            name="personal_information.first_name"
          />

          <label htmlFor="personal_information.last_name">Last Name:</label>
          <input
            type="text"
            id="personal_information.last_name"
            name="personal_information.last_name"
          />

          <label htmlFor="personal_information.email">Email:</label>
          <input
            type="text"
            id="personal_information.email"
            name="personal_information.email"
          />

          <label htmlFor="personal_information.company_name">
            Company Name:
          </label>
          <input
            type="text"
            id="personal_information.company_name"
            name="personal_information.company_name"
          />
        </div>

        <div className="address-information">
          <label htmlFor="address_information.street">Street:</label>
          <input
            type="text"
            id="address_information.street"
            name="address_information.street"
          />

          <label htmlFor="address_information.street2">Street2:</label>
          <input
            type="text"
            id="address_information.street2"
            name="address_information.street2"
          />

          <label htmlFor="address_information.city">City:</label>
          <input
            type="text"
            id="address_information.city"
            name="address_information.city"
          />

          <label htmlFor="address_information.state">State:</label>
          <input
            type="text"
            id="address_information.state"
            name="address_information.state"
          />

          <label htmlFor="address_information.zip">Zip:</label>
          <input
            type="text"
            id="address_information.zip"
            name="address_information.zip"
          />

          <label
            className="data-list-label"
            htmlFor="address_information.country"
          >
            Country:
          </label>
          <div className="data-list">
            <input
              list=""
              name="address_information.country"
              className="data-list-input"
              id="address_information.country"
              autoComplete="off"
              ref={countryInputRef}
              required
            />
            <datalist className="data-list-datalist" ref={countryDatalistRef}>
              <CountriesOptionList />
            </datalist>
          </div>
        </div>

        <label htmlFor="picture">Profile Picture:</label>
        <img
          className="previewImage"
          src={imageSrc || ""}
          width="200px"
          alt=""
          ref={previewImageRef}
        />
        <input
          type="file"
          id="picture"
          name="picture"
          onChange={previewImage}
        />

        <button type="submit">Finish Setup</button>
      </form>
      {error ? <p className="error">{error}</p> : ""}
    </>
  );
};

export default Setup;
