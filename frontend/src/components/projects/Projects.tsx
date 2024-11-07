import { Link } from "react-router-dom";
import useDeleteItems from "../hooks/useDeleteItems";
import usePaginatedTable from "../hooks/usePaginatedTable";
import { ProjectExtraData } from "../types/Projects";
import Pagination from "../Pagination";
import Loader from "../Loader";
import Alert from "../Alert";
import useRunningTimer from "../hooks/useStartRunningTimer";

const Projects = () => {
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
  } = usePaginatedTable<ProjectExtraData>({
    baseUrl: "/projects",
    enableSorting: true,
  });

  const {
    handleDeleteSelected,
    loading: deleting,
    error: deleteError,
    success: deleteSuccess,
  } = useDeleteItems();

  const { startUseRunningTimer, stopAllRunningTimers, timers } =
    useRunningTimer();

  const handleDeleteProjects = async () => {
    const selectedIds = Array.from(checkedItems);
    await handleDeleteSelected("/api/projects/delete", selectedIds);
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

      <div className="wrapper">
        <Link to="/projects/create" className="button create-project-button">
          Create Project
        </Link>

        <button onClick={handleDeleteProjects} type="submit">
          Delete
        </button>
        <div className="projects table">
          <table className="table-sort">
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
                  onClick={() => handleSort && handleSort("customer_name")}
                  className={getSortClass("customer_name") + ` sort-th`}
                >
                  Customer
                </th>
                <th
                  onClick={() => handleSort && handleSort("total_time_seconds")}
                  className={getSortClass("total_time_seconds") + ` sort-th`}
                >
                  Time
                </th>
                <th
                  onClick={() => handleSort && handleSort("billed")}
                  className={getSortClass("billed") + ` sort-th`}
                >
                  Billed
                </th>
                <th
                  onClick={() => handleSort && handleSort("created_on")}
                  className={getSortClass("created_on") + ` sort-th`}
                >
                  Created On
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
                      <Link className="link" to={`/projects/${item._id}`}>
                        {item.name}
                      </Link>
                    </td>
                    <td>{item.customer_name}</td>
                    <td>
                      {item.running ? (
                        <>
                          {startUseRunningTimer(
                            item.total_time ?? item.total_time,
                            "total_time"
                          )}
                          {timers.find((timer) => timer.id === "total_time")
                            ?.newTime || item.total_time}
                        </>
                      ) : (
                        item.total_time
                      )}
                    </td>
                    <td>{item.billed}</td>
                    <td>{item.created_on}</td>
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
              link="/projects/"
              linkOptions={linkOptions}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Projects;
