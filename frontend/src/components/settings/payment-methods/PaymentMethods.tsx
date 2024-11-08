import { Link } from "react-router-dom";
import usePaginatedTable from "../../hooks/usePaginatedTable";
import { PaymentMethod } from "../../types/PaymentMethods";
import { useEffect } from "react";
import Pagination from "../../Pagination";
import useDeleteItems from "../../hooks/useDeleteItems";
import Alert from "../../Alert";
import Loader from "../../Loader";

const PaymentMethods = () => {
  const {
    items,
    loading,
    error,
    currentPage,
    totalPages,
    linkOptions,
    handleSort,
    checkedItems,
    handleCheckAll,
    handleCheckItem,
    getSortClass,
    fetchItems,
  } = usePaginatedTable<PaymentMethod>({
    baseUrl: "/settings/payment-methods",
    enableSorting: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const {
    handleDeleteSelected,
    loading: deleting,
    error: deleteError,
    success: deleteSuccess,
  } = useDeleteItems();

  const handleDeletePaymentMethods = async () => {
    const selectedIds = Array.from(checkedItems);
    await handleDeleteSelected(
      "/api/settings/payment-methods/delete",
      selectedIds
    );
    // Check if there's an error; if not, navigate to /customers
    if (!deleteError) {
      fetchItems();
    }
  };

  if (error) {
    return <Alert message={error.message} type="error" scroll={true} />;
  }

  return (
    <>
      {deleteError && (
        <Alert
          key={deleteError.id}
          message={deleteError.message}
          type="error"
          scroll={true}
        />
      )}
      {deleteSuccess && (
        <Alert
          key={deleteSuccess.id}
          message={deleteSuccess.message}
          type="success"
          scroll={true}
        />
      )}
      <div className="settings-wrapper">
        <Link className="link" to="/settings/payment-methods/create/">
          Create Payment Method
        </Link>

        <button onClick={handleDeletePaymentMethods} type="submit">
          Delete
        </button>
        <div className="paymentMethods table">
          <table>
            <thead>
              <tr>
                <th>
                  <label className="checkbox">
                    <input type="checkbox" onChange={handleCheckAll} />
                  </label>
                </th>
                <th
                  onClick={() => handleSort && handleSort("name")}
                  className={getSortClass("name") + ` sort-th`}
                >
                  Name
                </th>
                <th
                  onClick={() => handleSort && handleSort("description")}
                  className={getSortClass("description") + ` sort-th`}
                >
                  Description
                </th>
              </tr>
            </thead>
            {loading || deleting ? (
              <tbody>
                <tr>
                  <td colSpan={5}>
                    <Loader fullPage={false} />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          className="payment-method-checkbox box-checkbox"
                          checked={checkedItems.has(item._id)}
                          onChange={() => handleCheckItem(item._id)}
                        />
                      </label>
                    </td>
                    <td>
                      <Link
                        className="link"
                        to={`/settings/payment-methods/edit/${item._id}`}
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          <div className="pagination">
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                link="/projects/"
                linkOptions={linkOptions}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentMethods;
