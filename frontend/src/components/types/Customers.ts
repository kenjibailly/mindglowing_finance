export interface PersonalInformation {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  currency_name: string;
  currency_symbol: string;
}

export interface ShippingDetails {
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface BillingDetails {
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface ContactInformation {
  preferred_contact_medium: string;
  contact_medium_username: string;
  other_option_response: string;
}

// Main Customer interface
export interface Customer {
  _id: string;
  personal_information: PersonalInformation;
  shipping_details: ShippingDetails;
  billing_details: BillingDetails;
  contact_information: ContactInformation;
  created_on: string;
  amount_due: number;
}
