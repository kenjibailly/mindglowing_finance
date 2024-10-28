import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Customer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    // Fetch customer data using the id
    const fetchCustomerData = async () => {
      console.log(id);
      return;
      const response = await fetch(`/api/customers/${id}`);
      const data = await response.json();
      setCustomerData(data);
    };

    if (id) fetchCustomerData();
  }, [id]);

  return (
    <div>
      {customerData ? (
        <div>{/* Render customer details here */}</div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Customer;
