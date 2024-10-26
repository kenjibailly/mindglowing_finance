export interface Customer {
  id: string; // Adjust the type as per your model
  personal_information: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface Product {
  id: string; // Adjust the type as per your model
  name: string;
  description: string;
}

export interface Invoice {
  id: string; // Adjust the type as per your model
  number: number | null;
  description: string;
}

export interface Project {
  id: string; // Adjust the type as per your model
  name: string;
  description: string;
}

export interface CustomizationSettings {
  invoice_prefix: string;
  invoice_separator: string;
}

export interface SearchResult {
  customers: Customer[];
  products: Product[];
  invoices: Invoice[];
  projects: Project[];
  customization_settings: CustomizationSettings;
}
