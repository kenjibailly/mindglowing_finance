import { Link, useNavigate, useParams } from "react-router-dom";
import { Tax as TaxesType } from "../../types/Taxes";
import useFetchData from "../../hooks/useFetchData";
import { useEffect } from "react";
import Alert from "../../Alert";
import Loader from "../../Loader";
import useDeleteItems from "../../hooks/useDeleteItems";

const Taxes = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: taxData,
    loading: taxLoading,
    error: taxError,
    fetchItems: taxFetch,
  } = useFetchData<TaxesType>({
    id: "",
    endpoint: `settings/taxes/${id}`,
  });

  useEffect(() => {
    taxFetch();
  }, []);

  const {
    handleDeleteSelected,
    loading: deleting,
    error: deleteError,
  } = useDeleteItems();

  const handleDeleteTaxes = async () => {
    if (id) {
      await handleDeleteSelected("/api/settings/taxes/delete", id);
      if (!deleteError) {
        navigate("/settings/taxes");
      }
    }
  };

  if (taxError) {
    return (
      <Alert
        key={taxError.id}
        message={taxError.message}
        type="error"
        scroll={true}
      />
    );
  }

  if (taxLoading || !taxData || deleting) {
    return <Loader fullPage={true} />;
  }

  return (
    <>
      <div className="settings-wrapper">
        <Link className="link" to={`/settings/taxes`}>
          Taxes
        </Link>
        <Link className="button" to={`/settings/taxes/edit/${id}`}>
          Edit Tax
        </Link>

        <button onClick={handleDeleteTaxes} className="button" type="submit">
          Delete
        </button>
        <div className="overview">
          <div className="separate">
            <div className="inline">
              <p>Name:</p>
              <p>{taxData.name}</p>
            </div>

            <div className="inline">
              <p>Percentage:</p>
              <p>{taxData.percentage}</p>
            </div>

            <div className="inline">
              <p>Default:</p>
              <p>{taxData.default ? "Yes" : "No"}</p>
            </div>

            <div className="inline">
              <p>Description:</p>
              <p>{taxData.description}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Taxes;
