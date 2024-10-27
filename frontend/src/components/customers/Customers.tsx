import React from "react";
import { Link } from "react-router-dom";
import { Customer } from "../types/Customers";
import "../../stylesheets/table/table.css";
import "../../stylesheets/checkbox/checkbox.css";
import Error from "../Error";
import Pagination from "../Pagination";
import usePaginatedTable from "../hooks/usePaginatedTable";
import useDeleteItems from "../hooks/useDeleteItems";
import Loader from "../Loader";

const Customers: React.FC = () => {
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
    deleteItems,
    loading: deleting,
    error: deleteError,
  } = useDeleteItems();

  const handleDeleteSelected = async () => {
    const selectedIds = Array.from(checkedItems); // Get selected IDs
    if (selectedIds.length === 0) {
      alert("No items selected for deletion");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete the selected items?"
    );
    if (confirmed) {
      await deleteItems("/api/customers/delete/", selectedIds);
      fetchItems();
    }
  };

  if (loading || deleting) {
    return <Loader />;
  }

  if (error || deleteError) {
    return <Error error={error || deleteError} />;
  }

  return (
    <div className="wrapper">
      <Link
        to="/customers/create"
        key="/customers/create"
        className="button create-customer-button"
      >
        Create Customer
      </Link>
      <button onClick={handleDeleteSelected} type="submit">
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
                className={getSortClass("personal_information.email")}
              >
                Email
              </th>
              <th
                onClick={() => handleSort && handleSort("amount_due")}
                className={getSortClass("amount_due")}
              >
                Amount Due
              </th>
              <th
                onClick={() => handleSort && handleSort("created_on")}
                className={getSortClass("created_on")}
              >
                Created on
              </th>
            </tr>
          </thead>
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
                  <Link
                    className="link"
                    to={`/customers/customer/${item._id}`}
                    key={`/customers/customer/${item._id}`}
                  >
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
  );
};

export default Customers;
