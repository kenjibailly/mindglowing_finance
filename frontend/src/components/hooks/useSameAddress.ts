import React from "react";
import { AddressDetails } from "../types/Customers";

export const toggleShipping = (
  checked: boolean,
  setAddressDetails: React.Dispatch<React.SetStateAction<AddressDetails>>,
  shippingDetailsDivRef: React.RefObject<HTMLDivElement>
) => {
  if (shippingDetailsDivRef.current) {
    if (checked) {
      shippingDetailsDivRef.current.classList.add("hidden");
      setAddressDetails((prev) => ({
        ...prev,
        shipping: { ...prev.billing },
      }));
    } else {
      shippingDetailsDivRef.current.classList.remove("hidden");
    }
  }
};

const useSameAddress = (
  setIsSameAddress: React.Dispatch<React.SetStateAction<boolean>>,
  setAddressDetails: React.Dispatch<React.SetStateAction<AddressDetails>>,
  shippingDetailsDivRef: React.RefObject<HTMLDivElement>
) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsSameAddress(checked);
    toggleShipping(checked, setAddressDetails, shippingDetailsDivRef);
  };

  return handleChange; // Return the event handler function
};

export default useSameAddress;
