// useDeleteItems.ts
import { useState } from "react";

const useDeleteItems = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteItems = async (url: string, selectedIds: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete items");
      }

      // You might want to return response data if needed
      return await response.json();
    } catch (err) {
      setError((err as Error).message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { deleteItems, loading, error };
};

export default useDeleteItems;
