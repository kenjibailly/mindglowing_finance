// src/components/Header/SearchResults.tsx
import React from "react";
import { Link } from "react-router-dom";

import {
  SearchResult,
  Customer,
  Product,
  Invoice,
  Project,
} from "../types/SearchResults";

interface SearchResultsProps {
  results: SearchResult | null;
  isVisible: boolean;
  error: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isVisible,
  error,
}) => {
  if (isVisible && error !== "")
    return (
      <div className="searchResultsPopup">
        <p className="error">{error}</p>
      </div>
    );
  if (!isVisible || !results) return;

  return (
    <div className="searchResultsPopup">
      <ul>
        {results.customers.map((customer: Customer) => (
          <Link to={`/customers/customer/${customer._id}`} key={customer._id}>
            <li>
              {customer.personal_information.first_name}{" "}
              {customer.personal_information.last_name}{" "}
              {customer.personal_information.email}
            </li>
          </Link>
        ))}
        {results.invoices.map((invoice: Invoice) => (
          <Link to={`/invoices/invoice/${invoice._id}`} key={invoice._id}>
            <li>
              {results.customization_settings.invoice_prefix}
              {results.customization_settings.invoice_separator}
              {invoice.number}
            </li>
          </Link>
        ))}
        {results.products.map((product: Product) => (
          <Link to={`/products/product/${product._id}`} key={product._id}>
            <li>
              {product.name} {product.description}
            </li>
          </Link>
        ))}
        {results.projects.map((project: Project) => (
          <Link to={`/projects/project/${project._id}`} key={project._id}>
            <li>{project.name}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
