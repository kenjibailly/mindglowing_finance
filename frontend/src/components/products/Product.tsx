import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../Alert";
import Loader from "../Loader";
import "../../stylesheets/overview/overview.css";
import useDeleteItems from "../hooks/useDeleteItems";
import { Product as ProductData } from "../types/Products";
import useFetchData from "../hooks/useFetchData";

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: productData,
    loading,
    error,
    fetchItems,
  } = useFetchData<ProductData>({
    id: id,
    endpoint: "products",
  });
  const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, [id]);

  const {
    handleDeleteSelected,
    loading: deleting,
    error: deleteError,
  } = useDeleteItems();

  const handleDeleteProduct = async () => {
    if (id) {
      await handleDeleteSelected("/api/products/delete", id);
      if (!deleteError) {
        navigate("/products");
      }
    }
  };

  if (error) {
    return <Alert message={error} type="error" />;
  }

  if (loading || deleting) {
    <Loader fullPage={false} />;
  }

  if (!productData) {
    return <Loader fullPage={true} />;
  }

  return (
    <div className="wrapper product-overview">
      <Link className="link" to="/products/">
        Products
      </Link>
      <Link className="button" to={`/products/edit/${productData._id}`}>
        Edit Product
      </Link>

      <div className="alert alert-success hidden" role="alert">
        Product edited!
      </div>

      <button onClick={handleDeleteProduct} type="submit">
        Delete
      </button>

      <div className="overview">
        <div className="separate">
          <div>
            <p>Product Picture:</p>
            <img
              src={`/uploads/resized/${productData.picture}`}
              width="150px"
              alt=""
            />
          </div>
          <div className="inline">
            <p>Name:</p>
            <p>{productData.name}</p>
          </div>
          <div className="inline">
            <p>Price:</p>
            <p>
              {cachedUser.currency_symbol} {productData.price}
            </p>
          </div>
          <div className="inline">
            <p>Description:</p>
            <p>{productData.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
