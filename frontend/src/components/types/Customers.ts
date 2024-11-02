export interface PersonalInformation {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  currency_name: string;
  currency_symbol: string;
}

export interface AddressFields {
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface AddressDetails {
  billing_details: AddressFields;
  shipping_details: AddressFields;
}

export interface ContactInformation {
  preferred_contact_medium: string;
  contact_medium_username: string;
  other_option_response: string;
}

export interface AddressType {
  billing_details: AddressDetails["billing_details"];
  shipping_details: AddressDetails["shipping_details"];
}

export type AddressField =
  | "street"
  | "street2"
  | "city"
  | "state"
  | "zip"
  | "country";

// Main Customer interface
export interface Customer {
  _id: string;
  personal_information: PersonalInformation;
  shipping_details: AddressFields;
  billing_details: AddressFields;
  contact_information: ContactInformation;
  created_on: string;
  amount_due: number;
}
