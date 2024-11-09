import { Link, useNavigate, useParams } from "react-router-dom";
import { Discount as DiscountType } from "../../types/Discounts";
import useFetchData from "../../hooks/useFetchData";
import { useEffect } from "react";
import Alert from "../../Alert";
import Loader from "../../Loader";
import useDeleteItems from "../../hooks/useDeleteItems";

const Discount = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: discountData,
    loading: discountLoading,
    error: discountError,
    fetchItems: discountFetch,
  } = useFetchData<DiscountType>({
    id: "",
    endpoint: `settings/discounts/${id}`,
  });

  const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    discountFetch();
  }, []);

  const {
    handleDeleteSelected,
    loading: deleting,
    error: deleteError,
  } = useDeleteItems();

  const handleDeleteDiscount = async () => {
    if (id) {
      await handleDeleteSelected("/api/settings/discounts/delete", id);
      if (!deleteError) {
        navigate("/settings/discounts");
      }
    }
  };

  if (discountError) {
    return (
      <Alert
        key={discountError.id}
        message={discountError.message}
        type="error"
        scroll={true}
      />
    );
  }

  if (discountLoading || !discountData || deleting) {
    return <Loader fullPage={true} />;
  }

  return (
    <>
      <div className="settings-wrapper">
        <Link className="link" to={`/settings/discounts`}>
          Discounts
        </Link>
        <Link className="button" to={`/settings/discounts/edit/${id}`}>
          Edit Discount
        </Link>

        <button onClick={handleDeleteDiscount} className="button" type="submit">
          Delete
        </button>
        <div className="overview">
          <div className="separate">
            <div className="inline">
              <p>Name:</p>
              <p>{discountData.name}</p>
            </div>
            <div className="inline">
              <p>Code:</p>
              <p>{discountData.code}</p>
            </div>
            <div className="inline">
              <p>Total Amount:</p>
              <p>
                {discountData.amount.total
                  ? cachedUser.currency_symbol + " " + discountData.amount.total
                  : cachedUser.currency_symbol + " 0"}
              </p>
            </div>
            <div className="inline">
              <p>Percentage Amount:</p>
              <p>
                {discountData.amount.percentage
                  ? discountData.amount.percentage + "%"
                  : "0%"}
              </p>
            </div>
            <div className="inline">
              <p>Description:</p>
              <p>{discountData.description}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Discount;
