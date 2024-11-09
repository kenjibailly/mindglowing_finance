import { Link, useNavigate, useParams } from "react-router-dom";
import { ShippingCompany as ShippingCompaniesType } from "../../types/ShippingCompanies";
import useFetchData from "../../hooks/useFetchData";
import { useEffect } from "react";
import Alert from "../../Alert";
import Loader from "../../Loader";
import useDeleteItems from "../../hooks/useDeleteItems";

const ShippingCompanies = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: shippingCompaniesData,
    loading: shippingCompaniesLoading,
    error: shippingCompaniesError,
    fetchItems: shippingCompaniesFetch,
  } = useFetchData<ShippingCompaniesType>({
    id: "",
    endpoint: `settings/shipping-companies/${id}`,
  });

  useEffect(() => {
    shippingCompaniesFetch();
  }, []);

  const {
    handleDeleteSelected,
    loading: deleting,
    error: deleteError,
  } = useDeleteItems();

  const handleDeleteShippingCompanies = async () => {
    if (id) {
      await handleDeleteSelected("/api/settings/shipping-companies/delete", id);
      if (!deleteError) {
        navigate("/settings/shipping-companies");
      }
    }
  };

  if (shippingCompaniesError) {
    return (
      <Alert
        key={shippingCompaniesError.id}
        message={shippingCompaniesError.message}
        type="error"
        scroll={true}
      />
    );
  }

  if (shippingCompaniesLoading || !shippingCompaniesData || deleting) {
    return <Loader fullPage={true} />;
  }

  return (
    <>
      <div className="settings-wrapper">
        <Link className="link" to={`/settings/shipping-companies`}>
          Shipping Companies
        </Link>
        <Link className="button" to={`/settings/shipping-companies/edit/${id}`}>
          Edit Shipping Company
        </Link>

        <button
          onClick={handleDeleteShippingCompanies}
          className="button"
          type="submit"
        >
          Delete
        </button>
        <div className="overview">
          <div className="separate">
            <div className="inline">
              <p>Name:</p>
              <p>{shippingCompaniesData.name}</p>
            </div>

            <div className="inline">
              <p>Description:</p>
              <p>{shippingCompaniesData.description}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingCompanies;
