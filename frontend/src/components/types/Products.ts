export interface Product {
  _id: string;
  name: string;
  price: number;
  tax: {
    id: string;
    percentage: number;
  };
  description: string;
  picture: string;
  currency_symbol: string;
}

export interface ProductFetch extends Product {
  tax_details: {
    _id: string;
    name: string;
    percentage: string;
    description: string;
    default: boolean;
  };
}
