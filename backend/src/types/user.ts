export interface User {
  _id: string;
  username: string;
  password: string;
  setup: boolean;
  time_zone: string;
  address_information: AddressInformation;
  currency_name: string;
  currency_symbol: string;
  date_format: string;
  personal_information: PersonalInformation;
  picture: string;
}

export interface AddressInformation {
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PersonalInformation {
  company_name: string;
  email: string;
  first_name: string;
  last_name: string;
}
