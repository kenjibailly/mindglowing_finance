export interface Discount {
  _id: string;
  name: string;
  code: string;
  amount: Amount;
  description: string;
}

export interface Amount {
  total: number;
  percentage: number;
}
