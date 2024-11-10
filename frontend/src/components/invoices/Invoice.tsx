import { useEffect } from "react";
import useFetchData from "../hooks/useFetchData";
import { useNavigate, useParams } from "react-router-dom";
import useDeleteItems from "../hooks/useDeleteItems";
import Alert from "../Alert";
import Loader from "../Loader";
import { InvoicesFetch as InvoiceType } from "../types/Invoices";

const Invoice = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: invoiceData,
    loading,
    error,
    fetchItems,
  } = useFetchData<InvoiceType>({
    id: id,
    endpoint: "invoices",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, [id]);

  const {
    handleDeleteSelected,
    loading: deleting,
    error: deleteError,
  } = useDeleteItems();

  const handleDeleteInvoice = async () => {
    if (id) {
      await handleDeleteSelected("/api/invoices/delete", id);
      if (!deleteError) {
        navigate("/invoices");
      }
    }
  };

  if (error) {
    return <Alert message={error.message} type="error" scroll={true} />;
  }

  if (loading || deleting) {
    <Loader fullPage={false} />;
  }

  if (!invoiceData) {
    return <Loader fullPage={true} />;
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
      <div className="wrapper invoice-overview">
        <a className="link" href="/invoices/">
          Invoices
        </a>
        <a className="button" href="/invoices/edit/{{invoice._id}}">
          Edit Invoice
        </a>
        <a className="button" href="/invoices/invoice/pdf/{{invoice._id}}">
          Show PDF
        </a>

        <form action="/invoices/delete/{{invoice._id}}/" method="post">
          <button type="submit">Delete</button>
        </form>

        {/* <div className="overview">
        <div className="separate">
            <div className="inline">
                <p>Number:</p><p>{customization.invoice_prefix}{{customization.invoice_separator}}{{invoice.number}}</p>
            </div>
            <div className="inline">
                <p>Customer:</p><a href="/customers/customer/{{customer._id}}">
                <p>{{#if customer.personal_information.company}}{{customer.personal_information.company}}{{else}}{{customer.personal_information.first_name}} {{customer.personal_information.last_name}}{{/if}}</p></a>
            </div>
        </div>
        {{#if products}}
            <div className="separate">
                <h2>Products</h2>
                <div className="products table">
                    <table className="dataTable">
                        <thead>
                            <tr>
                                <th>Picture</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {{#each products}}
                                <tr>
                                    <td><img src="/uploads/resized/{{picture}}" width="60px" alt=""></td>
                                    <td><a className="link" href="/products/product/{{_id}}">{{name}} {{personal_information.last_name}}</a></td>
                                    <td>{{../user.currency_symbol}} {{price}}</td>
                                    <td>{{quantity}}</td>
                                    <td>{{description}}</td>
                                </tr>
                            {{/each}}
                        </tbody>
                    </table>
                    <button className="button hidden toggleButton" onclick="toggleCollapse(this)">Show More</button>
                </div>
            </div>
        {{/if}}
        {{#if invoice.project_billed.timeTracking}}
            <div className="separate">
                <h2><a className="link" href="/projects/project/{{invoice.project_billed.id}}">{{invoice.project_billed.name}}</a></h2>
                <div className="inline">
                    <p>Total Time:</p><p className="amount_due">{{invoice.project_billed.total_time}}</p>
                </div>
                <p>{{invoice.project_billed.description}}</p>
                <h2>Time Tracking</h2>
                <div className="projects table">
                    <table className="dataTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Start</th>
                                <th>Stop</th>
                                <th>Total Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {{#each invoice.project_billed.timeTracking}}
                                <tr>
                                    <td><a className="link" href="/projects/project/{{../invoice.project_billed.id}}">{{name}}</a></td>
                                    <td>{{start}}</td>
                                    <td>{{stop}}</td>
                                    <td>{{timePassed}}</td>
                                </tr>
                            {{/each}}
                        </tbody>
                    </table>
                    <button className="button hidden toggleButton" onclick="toggleCollapse(this)">Show More</button>
                </div>
            </div>
        {{/if}}
        {{#if discounts}}
            <div className="separate">
                <h2>Discounts</h2>
                <div className="discounts table">
                    <table className="dataTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Code</th>
                                <th>Total Amount</th>
                                <th>Percentage Amount</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {{#each discounts}}
                                <tr>
                                    <td><a className="link" href="/settings/discounts/edit/{{_id}}">{{name}}</a></td>
                                    <td>{{code}}</td>
                                    <td>{{../user.currency_symbol}} {{amount.total}}</td>
                                    <td>{{amount.percentage}}%</td>
                                    <td>{{description}}</td>
                                </tr>
                            {{/each}}
                        </tbody>
                    </table>
                    <button className="button hidden toggleButton" onclick="toggleCollapse(this)">Show More</button>
                </div>
            </div>
        {{/if}}
        {{#if shipping_company}}
            <div className="separate">
                <h2>Shipping</h2>
                <div className="inline">
                    <p>Shipping Company:</p><a href="/settings/shipping-companies/edit/{{shipping_company._id}}"><p>{{shipping_company.name}}</p></a>
                </div>
                <div className="inline">
                    <p>Shipping Amount:</p><p>{{invoice.shipping.amount}}</p>
                </div>
            </div>
        {{/if}}
        {{#if paid}}
            <div className="separate">
                <h2>Payments</h2>
                <div className="payments table">
                    <div className="inline">
                        <p>Due date:</p><p>{{invoice.due_date}}</p>
                    </div>
                    <table className="dataTable">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Method</th>
                            </tr>
                        </thead>
                        <tbody>
                            {{#each paid}}
                                <tr>
                                    <td>{{paid_on}}</td>
                                    <td>{{paid_amount}}</td>
                                    <td>{{payment_method}}</td>
                                </tr>
                            {{/each}}
                        </tbody>
                    </table>
                    <button className="button hidden toggleButton" onclick="toggleCollapse(this)">Show More</button>
                </div>
            </div>
        {{/if}}
        {{#if invoice.description}}
            <div className="separate">
                <div className="inline">
                    <p>Description:</p><p>{{invoice.description}}</p>
                </div>
            </div>
        {{/if}}
        <div className="separate">
            <div className="inline">
                <p>Product total:</p><p className="total_products"></p>
            </div>
            <div className="inline">
                <p>Shipping:</p><p className="total_shipping"></p>
            </div>
            <div className="inline">
                <p>Discount:</p><p className="total_discount"></p>
            </div>
            <div className="inline">
                <p>VAT:</p><p className="total_vat"></p>
            </div>
            <div className="inline">
                <p>Total:</p><p className="total_amount"></p>
            </div>
            <div className="inline">
                <p>Amount due:</p><p className="amount_due"></p>
            </div>
        </div>
    </div> */}
      </div>
    </>
  );
};

export default Invoice;
