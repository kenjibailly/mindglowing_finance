export interface Invoice {
  _id: string;
  number: number;
  customer_id: string;
  status: string;
  products: Array<Products>;
  discounts: Array<Discounts>;
  tax: Tax;
  shipping: Shipping;
  paid: Array<Paid>;
  amount_total: number;
  amount_due: number;
  description: string;
  created_on: Date;
}

export interface Products {
  _id: string;
  id: string;
  quantity: number;
}

export interface Discounts {
  _id: string;
  id: string;
  total: number;
  percentate: number;
}

export interface Tax {
  id: string;
  percentage: number;
}

export interface Shipping {
  id: string;
  amount: number;
}

export interface Paid {
  _id: string;
  paid_on: Date;
  paid_amount: number;
  payment_method_id: string;
}

export interface InvoicesFetch
  extends Omit<Invoice, "due_date" | "created_on"> {
  due_date: string;
  created_on: string;
  customer_name: string;
  over_due: boolean;
}
