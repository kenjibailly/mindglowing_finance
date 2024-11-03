import React, { useEffect, useRef, useState } from "react";
import "../stylesheets/form/form.css";
import useDatalist from "./hooks/useDatalist"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import CountriesOptionList from "./options/CountriesOptionList";
import CurrenciesOptionList from "./options/CurrenciesOptionList";
import usePreviewImage from "./hooks/usePreviewImage";
import "../stylesheets/images/preview_image.css";

const Setup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const currencyInputRef = useRef<HTMLInputElement>(null);
  const currencyDatalistRef = useRef<HTMLDataListElement>(null);

  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user && !user.user.setup) {
      navigate("/dashboard");
      return;
    }
  }, []);

  const { imageSrc, handleImageChange, fileInputRef, handleImageClick } =
    usePreviewImage();

  const countryInputRef = useRef<HTMLInputElement>(null);
  const countryDatalistRef = useRef<HTMLDataListElement>(null);

  useDatalist(currencyInputRef, currencyDatalistRef);
  useDatalist(countryInputRef, countryDatalistRef);

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
            <CurrenciesOptionList />
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
        {imageSrc && (
          <img
            className="preview-image"
            src={imageSrc}
            alt="Preview"
            onClick={handleImageClick}
          />
        )}
        <input
          type="file"
          id="picture"
          name="picture"
          onChange={handleImageChange}
          ref={fileInputRef}
          className={imageSrc ? "hidden" : ""}
        />
        <button type="submit">Finish Setup</button>
      </form>
      {error ? <p className="error">{error}</p> : ""}
    </>
  );
};

export default Setup;
