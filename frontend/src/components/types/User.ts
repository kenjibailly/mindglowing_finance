import { AddressFields } from "./Customers";

export interface PersonalInformation {
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
}

export interface UserSettings {
  _id: string;
  time_zone: string;
  address_information: AddressFields;
  currency_name: string;
  currency_symbol: string;
  date_format: string;
  personal_information: PersonalInformation;
  picture: string;
}
