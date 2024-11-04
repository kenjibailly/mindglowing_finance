import { Link } from "react-router-dom";
import { Customer } from "../types/Customers";
import "../../stylesheets/table/table.css";
import "../../stylesheets/checkbox/checkbox.css";
import Alert from "../Alert";
import Pagination from "../Pagination";
import usePaginatedTable from "../hooks/usePaginatedTable";
import useDeleteItems from "../hooks/useDeleteItems";
import Loader from "../Loader";

const Customers = () => {
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
  } = usePaginatedTable<Customer>({
    baseUrl: "/customers",
    enableSorting: true,
  });

  const {
    handleDeleteSelected,
    loading: deleting,
    error: deleteError,
    success: deleteSuccess,
  } = useDeleteItems();

  const handleDeleteCustomers = async () => {
    const selectedIds = Array.from(checkedItems);
    await handleDeleteSelected("/api/customers/delete", selectedIds);
    // Check if there's an error; if not, navigate to /customers
    if (!deleteError) {
      fetchItems();
    }
  };

  if (error) {
    return <Alert message={error} type="error" />;
  }

  return (
    <>
      {deleteError && (
        <Alert
          key={deleteError.id}
          message={deleteError.message}
          type="error"
        />
      )}
      {deleteSuccess && (
        <Alert
          key={deleteSuccess.id}
          message={deleteSuccess.message}
          type="success"
        />
      )}
      <div className="wrapper">
        <Link
          to="/customers/create"
          key="/customers/create"
          className="button create-customer-button"
        >
          Create Customer
        </Link>
        <button onClick={handleDeleteCustomers} type="submit">
          Delete
        </button>
        <div className="customers table">
          <table className="table-sort">
            <thead>
              <tr>
                <th data-field="checkbox">
                  <label className="checkbox">
                    <input type="checkbox" onChange={handleCheckAll} />
                  </label>
                </th>
                <th
                  onClick={() => handleSort && handleSort("customer_name")}
                  className={getSortClass("customer_name")}
                >
                  Name
                </th>
                <th
                  onClick={() =>
                    handleSort && handleSort("personal_information.email")
                  }
                  className={
                    getSortClass("personal_information.email") + ` sort-th`
                  }
                >
                  Email
                </th>
                <th
                  onClick={() => handleSort && handleSort("amount_due")}
                  className={getSortClass("amount_due") + ` sort-th`}
                >
                  Amount Due
                </th>
                <th
                  onClick={() => handleSort && handleSort("created_on")}
                  className={getSortClass("created_on") + ` sort-th`}
                >
                  Created on
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
              // Show items when not loading or deleting
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          className="customer-checkbox box-checkbox"
                          checked={checkedItems.has(item._id)}
                          onChange={() => handleCheckItem(item._id)}
                        />
                      </label>
                    </td>
                    <td>
                      <Link className="link" to={`/customers/${item._id}`}>
                        {item.personal_information.company ||
                          `${item.personal_information.first_name} ${item.personal_information.last_name}`}
                      </Link>
                    </td>
                    <td>{item.personal_information.email}</td>
                    <td>{`${item.personal_information.currency_symbol} ${item.amount_due}`}</td>
                    <td>{item.created_on}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            link="/customers/"
            linkOptions={linkOptions}
          />
        )}
      </div>
    </>
  );
};

export default Customers;
