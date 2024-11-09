import { useEffect } from "react";
import usePaginatedTable from "../../hooks/usePaginatedTable";
import { Discount } from "../../types/Discounts";
import useDeleteItems from "../../hooks/useDeleteItems";
import Alert from "../../Alert";
import { Link } from "react-router-dom";
import Pagination from "../../Pagination";
import Loader from "../../Loader";

const Discounts = () => {
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
  } = usePaginatedTable<Discount>({
    baseUrl: "/settings/discounts",
    enableSorting: true,
  });

  const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchItems();
  }, []);

  const {
    handleDeleteSelected,
    loading: deleting,
    error: deleteError,
    success: deleteSuccess,
  } = useDeleteItems();

  const handleDeleteDiscounts = async () => {
    const selectedIds = Array.from(checkedItems);
    await handleDeleteSelected("/api/settings/discounts/delete", selectedIds);
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
        <Link className="button" to="/settings/discounts/create/">
          Create Discount
        </Link>

        <button onClick={handleDeleteDiscounts} type="submit">
          Delete
        </button>
        <div className="discounts table">
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
                  onClick={() => handleSort && handleSort("code")}
                  className={getSortClass("code") + ` sort-th`}
                >
                  Code
                </th>
                <th
                  onClick={() => handleSort && handleSort("amount.total")}
                  className={getSortClass("amount.total") + ` sort-th`}
                >
                  Total Amount
                </th>
                <th
                  onClick={() => handleSort && handleSort("amount.percentage")}
                  className={getSortClass("amount.percentage") + ` sort-th`}
                >
                  Percentage Amount
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
                          className="discount-checkbox box-checkbox"
                          checked={checkedItems.has(item._id)}
                          onChange={() => handleCheckItem(item._id)}
                        />
                      </label>
                    </td>
                    <td>
                      <Link
                        className="link"
                        to={`/settings/discounts/${item._id}`}
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td>{item.code}</td>
                    <td>
                      {item.amount.total
                        ? cachedUser.currency_symbol + " " + item.amount.total
                        : cachedUser.currency_symbol + " 0"}
                    </td>
                    <td>
                      {" "}
                      {item.amount.percentage
                        ? item.amount.percentage + "%"
                        : "0%"}
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
                link="/settings/discounts/"
                linkOptions={linkOptions}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Discounts;
