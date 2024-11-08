import React, { useEffect, useRef, useState } from "react";
import useFetchData from "../hooks/useFetchData";
import CountriesOptionList from "../options/CountriesOptionList";
import CurrenciesOptionList from "../options/CurrenciesOptionList";
import TimeZonesOptionList from "../options/TimeZonesOptionList";
import { UserSettings } from "../types/User";
import useDatalist from "../hooks/useDatalist";
import usePreviewImage from "../hooks/usePreviewImage";
import Loader from "../Loader";
import Alert from "../Alert";
import "../../stylesheets/images/preview_image.css";

const Account = () => {
  const [error, setError] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const [success, setSuccess] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const {
    data: userData,
    loading: userLoading,
    error: userError,
    fetchItems: userFetch,
  } = useFetchData<UserSettings>({
    id: "",
    endpoint: "user",
  });
  const timeZoneInputRef = useRef<HTMLInputElement>(null);
  const timeZoneDatalistRef = useRef<HTMLDataListElement>(null);
  useDatalist(timeZoneInputRef, timeZoneDatalistRef, userLoading);

  const currencyInputRef = useRef<HTMLInputElement>(null);
  const currencyDatalistRef = useRef<HTMLDataListElement>(null);
  useDatalist(currencyInputRef, currencyDatalistRef, userLoading);

  const countryInputRef = useRef<HTMLInputElement>(null);
  const countryDatalistRef = useRef<HTMLDataListElement>(null);
  useDatalist(countryInputRef, countryDatalistRef, userLoading);

  const { imageSrc, handleImageChange, fileInputRef, handleImageClick } =
    usePreviewImage();

  useEffect(() => {
    userFetch();
  }, []);

  const handleEditUserSettings = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // Type-cast event.target to HTMLFormElement
    const form = event.target as HTMLFormElement;

    // Create a new FormData instance
    const formData = new FormData();
    const formDataFields = new FormData(form);

    // Append the image file if it exists and is available
    const file = fileInputRef.current?.files?.[0] || null;
    if (file) {
      formData.append("picture", file);
      console.log(formData);
    }

    for (const [key, value] of formDataFields.entries()) {
      if (key !== "picture") {
        formData.append(key, value);
      }
    }

    try {
      const response = await fetch(`/api/settings/account/`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess({
          message: "Account settings successfully edited!",
          id: Date.now(),
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            currency_symbol: data.currency_symbol,
            date_format: data.date_format,
            picture: data.picture,
          })
        );
      } else {
        const errorData = await response.json();
        throw new Error(
          "Failed to edit account settings.\n" + errorData.message
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

  if (userError) {
    return (
      <Alert
        key={userError.id}
        message={userError.message}
        type="error"
        scroll={true}
      />
    );
  }

  if (!userData) {
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
        <form encType="multipart/form-data" onSubmit={handleEditUserSettings}>
          <div className="separate">
            <label htmlFor="picture">Profile Picture:</label>
            <img
              className="preview-image"
              src={imageSrc || `/uploads/resized/${userData?.picture}`}
              alt="Preview"
              onClick={handleImageClick}
            />
            <input
              type="file"
              id="picture"
              name="picture"
              ref={fileInputRef}
              className={imageSrc || userData?.picture ? "hidden" : ""}
              onChange={handleImageChange}
            />

            <label htmlFor="date_format">Select Date Format:</label>
            <select
              defaultValue={userData.date_format}
              name="date_format"
              id="date_format"
              required
            >
              <option value="en-GB">DD/MM/YYYY</option>
              <option value="en-US">MM/DD/YYYY</option>
              <option value="zh-Hans-CN">YYYY/MM/DD</option>
            </select>

            <label htmlFor="time-zone">Select Time Zone:</label>
            <div className="data-list">
              <input
                list=""
                name="time_zone"
                id="time-zone"
                className="data-list-input"
                autoComplete="off"
                defaultValue={userData?.time_zone}
                ref={timeZoneInputRef}
                required
              />
              <datalist
                id="time-zone-datalist"
                role="listbox"
                className="data-list-datalist"
                ref={timeZoneDatalistRef}
              >
                <TimeZonesOptionList />
              </datalist>
            </div>

            <label htmlFor="currency">Select Currency:</label>
            <div className="data-list">
              <input
                list=""
                name="currency"
                id="currency"
                className="data-list-input"
                autoComplete="off"
                role="combobox"
                defaultValue={`${userData.currency_name} (${userData.currency_symbol})`}
                ref={currencyInputRef}
                required
              />
              <datalist
                id="datalist"
                role="listbox"
                className="data-list-datalist"
                ref={currencyDatalistRef}
              >
                <CurrenciesOptionList />
              </datalist>
            </div>

            <div className="personal-information">
              <label htmlFor="personal_information.first_name">
                First Name:
              </label>
              <input
                type="text"
                id="personal_information.first_name"
                name="personal_information.first_name"
                defaultValue={userData.personal_information.first_name}
                required
              />

              <label htmlFor="personal_information.last_name">Last Name:</label>
              <input
                type="text"
                id="personal_information.last_name"
                name="personal_information.last_name"
                defaultValue={userData.personal_information.last_name}
                required
              />

              <label htmlFor="personal_information.email">Email:</label>
              <input
                type="text"
                id="personal_information.email"
                name="personal_information.email"
                defaultValue={userData.personal_information.email}
                required
              />

              <label htmlFor="personal_information.company_name">
                Company Name:
              </label>
              <input
                type="text"
                id="personal_information.company_name"
                name="personal_information.company_name"
                defaultValue={userData.personal_information.company_name}
                required
              />
            </div>

            <div className="address-information">
              <label htmlFor="address_information.street">Street:</label>
              <input
                type="text"
                id="address_information.street"
                name="address_information.street"
                defaultValue={userData.address_information.street}
                required
              />

              <label htmlFor="address_information.street2">Street2:</label>
              <input
                type="text"
                id="address_information.street2"
                name="address_information.street2"
                defaultValue={userData.address_information.street2}
                required
              />

              <label htmlFor="address_information.city">City:</label>
              <input
                type="text"
                id="address_information.city"
                name="address_information.city"
                defaultValue={userData.address_information.city}
                required
              />

              <label htmlFor="address_information.state">State:</label>
              <input
                type="text"
                id="address_information.state"
                name="address_information.state"
                defaultValue={userData.address_information.state}
              />

              <label htmlFor="address_information.zip">Zip:</label>
              <input
                type="text"
                id="address_information.zip"
                name="address_information.zip"
                defaultValue={userData.address_information.zip}
                required
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
                  defaultValue={userData.address_information.country}
                  ref={countryInputRef}
                  required
                />
                <datalist
                  ref={countryDatalistRef}
                  className="data-list-datalist"
                >
                  <CountriesOptionList />
                </datalist>
              </div>
            </div>
          </div>

          <button type="submit">Update</button>
        </form>
      </div>
    </>
  );
};

export default Account;
