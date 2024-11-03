// useDeleteItems.ts
import { useState } from "react";

const useDeleteItems = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const [success, setSuccess] = useState<{
    message: string;
    id: number;
  } | null>(null);

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
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete items");
      }

      setSuccess(data.message);
      return data;
    } catch (err) {
      setError({
        message: (err as Error).message || "Unknown error",
        id: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  // Handler function for deleting multiple items or a single item
  const handleDeleteSelected = async (
    url: string,
    selectedIds: string | string[]
  ) => {
    const idsArray = Array.isArray(selectedIds) ? selectedIds : [selectedIds];

    if (idsArray.length === 0) {
      alert("No items selected for deletion");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete the selected items?"
    );

    if (confirmed) {
      try {
        await deleteItems(url, idsArray);
      } catch (error) {
        setError({ message: (error as Error).message, id: Date.now() });
      }
    }
  };

  return { deleteItems, handleDeleteSelected, loading, error, success };
};

export default useDeleteItems;
