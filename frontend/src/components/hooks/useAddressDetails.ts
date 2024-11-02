import { AddressType, AddressDetails } from "../types/Customers";

const useAddressDetails = (
  isSameAddress: boolean,
  setAddressDetails: React.Dispatch<React.SetStateAction<AddressDetails>>
) => {
  const handleAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    addressSection: keyof AddressType
  ) => {
    const { name, value } = event.target;

    setAddressDetails((previousAddressDetails) => {
      const updatedAddress = { ...previousAddressDetails };

      // Split `name` into keys, e.g., "billing_details.country" becomes ["billing_details", "country"]
      const nestedKeys = name.split(".");

      // Traverse and update the nested field in the correct address section
      nestedKeys.reduce((nestedField: any, key: string, index: number) => {
        if (typeof nestedField === "object" && nestedField !== null) {
          if (index === nestedKeys.length - 1) {
            nestedField[key] = value;
          } else {
            nestedField[key] = nestedField[key] || {};
          }
        }
        return nestedField[key];
      }, updatedAddress);

      // If `isSameAddress` is true and updating billing, copy values to shipping
      if (isSameAddress && addressSection === "billing_details") {
        updatedAddress.shipping_details = { ...updatedAddress.billing_details };
      }

      return updatedAddress;
    });
  };

  return handleAddressChange;
};

export default useAddressDetails;
