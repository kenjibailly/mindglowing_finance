// Define the structure of the customer response
export interface PersonalInformation {
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  currency_name: string;
  currency_symbol: string;
}

export interface BillingDetails {
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface ShippingDetails {
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface ContactInformation {
  preferred_contact_medium: string;
  contact_medium_username?: string;
  other_option_response?: string;
}

export interface Customer {
  personal_information: PersonalInformation;
  billing_details: BillingDetails;
  shipping_details: ShippingDetails;
  contact_information: ContactInformation;
  _id: string;
  created_on: Date;
}
