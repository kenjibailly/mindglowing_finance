import { Link, useNavigate, useParams } from "react-router-dom";
import { PaymentMethod as PaymentMethodType } from "../../types/PaymentMethods";
import useFetchData from "../../hooks/useFetchData";
import { useEffect } from "react";
import Alert from "../../Alert";
import Loader from "../../Loader";
import useDeleteItems from "../../hooks/useDeleteItems";

const PaymentMethod = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: paymentMethodData,
    loading: paymentMethodLoading,
    error: paymentMethodError,
    fetchItems: paymentMethodFetch,
  } = useFetchData<PaymentMethodType>({
    id: "",
    endpoint: `settings/payment-methods/${id}`,
  });

  useEffect(() => {
    paymentMethodFetch();
  }, []);

  const {
    handleDeleteSelected,
    loading: deleting,
    error: deleteError,
  } = useDeleteItems();

  const handleDeletePaymentMethod = async () => {
    if (id) {
      await handleDeleteSelected("/api/settings/payment-methods/delete", id);
      if (!deleteError) {
        navigate("/settings/payment-methods");
      }
    }
  };

  if (paymentMethodError) {
    return (
      <Alert
        key={paymentMethodError.id}
        message={paymentMethodError.message}
        type="error"
        scroll={true}
      />
    );
  }

  if (paymentMethodLoading || !paymentMethodData || deleting) {
    return <Loader fullPage={true} />;
  }

  return (
    <>
      <div className="settings-wrapper">
        <Link className="button" to={`/settings/payment-methods/edit/${id}`}>
          Edit Payment Method
        </Link>

        <button
          onClick={handleDeletePaymentMethod}
          className="button"
          type="submit"
        >
          Delete
        </button>
        <div className="overview">
          <div className="separate">
            <div className="inline">
              <p>Name:</p>
              <p>{paymentMethodData.name}</p>
            </div>

            <div className="inline">
              <p>Description:</p>
              <p>{paymentMethodData.description}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;
