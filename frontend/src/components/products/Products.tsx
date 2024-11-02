import { Link } from "react-router-dom";
import useDeleteItems from "../hooks/useDeleteItems";
import usePaginatedTable from "../hooks/usePaginatedTable";
import { Product } from "../types/Products";
import Pagination from "../Pagination";
import Loader from "../Loader";
import Alert from "../Alert";

const Products = () => {
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
  } = usePaginatedTable<Product>({
    baseUrl: "/products",
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
    await handleDeleteSelected("/api/products/delete", selectedIds);
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
      {deleteError && <Alert message={deleteError} type="error" />}
      {deleteSuccess && <Alert message={deleteSuccess} type="success" />}
      <div className="wrapper">
        <Link to="/products/create" className="button create-product-button">
          Create Product
        </Link>

        <button onClick={handleDeleteCustomers} type="submit">
          Delete
        </button>
        <div className="products table">
          <table className="table-sort">
            <thead>
              <tr>
                <th>
                  <label className="checkbox">
                    <input type="checkbox" onChange={handleCheckAll} />
                  </label>
                </th>
                <th>Picture</th>
                <th
                  onClick={() => handleSort && handleSort("name")}
                  className={getSortClass("name")}
                >
                  Name
                </th>
                <th
                  onClick={() => handleSort && handleSort("price")}
                  className={getSortClass("price")}
                >
                  Price
                </th>
                <th
                  onClick={() => handleSort && handleSort("customer_name")}
                  className={getSortClass("description")}
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
                          className="product-checkbox box-checkbox"
                          checked={checkedItems.has(item._id)}
                          onChange={() => handleCheckItem(item._id)}
                        />
                      </label>
                    </td>
                    <td>
                      <img
                        src={`/uploads/resized/${item.picture}`}
                        width="60px"
                        alt=""
                      />
                    </td>
                    <td>
                      <Link className="link" to={`/products/${item._id}`}>
                        {item.name}
                      </Link>
                    </td>
                    <td>
                      {item.currency_symbol} {item.price}
                    </td>
                    <td>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        <div className="pagination">
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              link="/products/"
              linkOptions={linkOptions}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Products;
