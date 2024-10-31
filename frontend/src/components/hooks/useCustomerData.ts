import { useState } from "react";
import { Customer as CustomerData } from "../types/Customers";

const useCustomerData = (id: string | undefined) => {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/customers/${id}`);
      const data = await response.json();
      if (response.ok) {
        setCustomerData(data.customer);
      } else {
        setError("Something went wrong");
      }
    } catch (err) {
      setError((err as Error).message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { customerData, loading, error, fetchItems };
};

export default useCustomerData;
