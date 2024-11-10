export interface Tax {
  _id: string;
  name: string;
  percentage: number;
  default: boolean;
  description: string;
}

export interface fetchTax {
  items: Array<Tax>;
}
