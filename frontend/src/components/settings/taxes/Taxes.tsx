import { Link } from "react-router-dom";
import usePaginatedTable from "../../hooks/usePaginatedTable";
import { Tax } from "../../types/Taxes";
import { useEffect } from "react";
import Pagination from "../../Pagination";
import useDeleteItems from "../../hooks/useDeleteItems";
import Alert from "../../Alert";
import Loader from "../../Loader";

const Taxes = () => {
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
  } = usePaginatedTable<Tax>({
    baseUrl: "/settings/taxes",
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

  const handleDeleteTaxes = async () => {
    const selectedIds = Array.from(checkedItems);
    await handleDeleteSelected("/api/settings/taxes/delete", selectedIds);
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
        <Link className="button" to="/settings/taxes/create/">
          Create Tax
        </Link>

        <button onClick={handleDeleteTaxes} type="submit">
          Delete
        </button>
        <div className="tax table">
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
                  onClick={() => handleSort && handleSort("percentage")}
                  className={getSortClass("percentage") + ` sort-th`}
                >
                  Percentage
                </th>
                <th
                  onClick={() => handleSort && handleSort("default")}
                  className={getSortClass("default") + ` sort-th`}
                >
                  Default
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
                          className="tax-checkbox box-checkbox"
                          checked={checkedItems.has(item._id)}
                          onChange={() => handleCheckItem(item._id)}
                        />
                      </label>
                    </td>
                    <td>
                      <Link className="link" to={`/settings/taxes/${item._id}`}>
                        {item.name}
                      </Link>
                    </td>
                    <td>{item.percentage}</td>
                    <td>{item.default ? "Yes" : "No"}</td>
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
                link="/settings/taxes/"
                linkOptions={linkOptions}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Taxes;
