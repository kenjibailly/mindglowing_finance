import Alert from "../Alert";
import useDeleteItems from "../hooks/useDeleteItems";
import usePaginatedTable from "../hooks/usePaginatedTable";
import { InvoicesFetch } from "../types/Invoices";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import Loader from "../Loader";

const Invoices = () => {
  const {
    items,
    data: InvoicesData,
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
  } = usePaginatedTable<InvoicesFetch>({
    baseUrl: "/invoices",
    enableSorting: true,
  });

  const {
    handleDeleteSelected,
    loading: deleting,
    error: deleteError,
    success: deleteSuccess,
  } = useDeleteItems();

  const handleDeleteInvoices = async () => {
    const selectedIds = Array.from(checkedItems);
    await handleDeleteSelected("/api/invoices/delete", selectedIds);
    // Check if there's an error; if not, navigate to /invoices
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
      <div className="wrapper">
        <Link to="/invoices/create" className="button create-invoice-button">
          Create Invoice
        </Link>

        <button onClick={handleDeleteInvoices} type="submit">
          Delete
        </button>
        <div className="invoices table">
          <table className="table-sort">
            <thead>
              <tr>
                <th>
                  <label className="checkbox">
                    <input type="checkbox" onChange={handleCheckAll} />
                  </label>
                </th>
                <th
                  onClick={() => handleSort && handleSort("customer_name")}
                  className={getSortClass("customer_name") + ` sort-th`}
                >
                  Customer
                </th>
                <th
                  onClick={() => handleSort && handleSort("number")}
                  className={getSortClass("number") + ` sort-th`}
                >
                  Number
                </th>
                <th
                  onClick={() => handleSort && handleSort("created_on")}
                  className={getSortClass("created_on") + ` sort-th`}
                >
                  Created on
                </th>
                <th
                  onClick={() => handleSort && handleSort("amount_due")}
                  className={getSortClass("amount_due") + ` sort-th`}
                >
                  Amount Due
                </th>
                <th
                  onClick={() => handleSort && handleSort("amount_total")}
                  className={getSortClass("amount_total") + ` sort-th`}
                >
                  Total Amount
                </th>
                <th
                  onClick={() => handleSort && handleSort("status")}
                  className={getSortClass("status") + ` sort-th`}
                >
                  Status
                </th>
                <th
                  onClick={() => handleSort && handleSort("due_date")}
                  className={getSortClass("due_date") + ` sort-th`}
                >
                  Due Date
                </th>
                <th
                  onClick={() => handleSort && handleSort("over_due")}
                  className={getSortClass("over_due") + ` sort-th`}
                >
                  Past Due
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
                  <tr key={item._id} className={item.over_due ? "overdue" : ""}>
                    <td>
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          className="invoice-checkbox box-checkbox"
                          checked={checkedItems.has(item._id)}
                          onChange={() => handleCheckItem(item._id)}
                        />
                      </label>
                    </td>
                    <td>{item.customer_name}</td>
                    <td>
                      <Link className="link" to={`/invoices/${item._id}`}>
                        {InvoicesData.customization_settings.invoice_prefix}
                        {InvoicesData.customization_settings.invoice_separator}
                        {item.number}
                      </Link>
                    </td>
                    <td>{item.created_on}</td>
                    <td>
                      {InvoicesData.user_settings.currency_symbol}{" "}
                      {item.amount_due}
                    </td>
                    <td>
                      {InvoicesData.user_settings.currency_symbol}{" "}
                      {item.amount_total}
                    </td>
                    <td>{item.status}</td>
                    <td>{item.due_date}</td>
                    <td>{item.over_due ? "Yes" : "No"}</td>
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
            link="/invoices/"
            linkOptions={linkOptions}
          />
        )}
      </div>
    </>
  );
};

export default Invoices;
