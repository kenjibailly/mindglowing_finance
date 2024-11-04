import { useEffect, useState } from "react";
import Alert from "../Alert";
import Loader from "../Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import useDeleteItems from "../hooks/useDeleteItems";
import { ProjectFetch, TimeTrackingFetch } from "../types/Projects";
import useFetchData from "../hooks/useFetchData";
import Pagination from "../Pagination";
import usePaginatedTable from "../hooks/usePaginatedTable";

const Project = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: projectData,
    loading,
    error,
    fetchItems,
  } = useFetchData<ProjectFetch>({
    id: id,
    endpoint: "projects",
  });

  const {
    items: timeTrackings,
    data: timeTrackingsData,
    loading: loadingTableItems,
    error: loadingErrorItems,
    currentPage,
    totalPages,
    linkOptions,
    isAllChecked,
    checkedItems,
    handleCheckAll,
    handleCheckItem,
    handleSort,
    getSortClass,
    fetchItems: fetchTableItems,
  } = usePaginatedTable<TimeTrackingFetch>({
    baseUrl: `/projects/${id}/time-trackings/`,
    enableSorting: true,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
    fetchTableItems();
  }, [id]);

  const {
    handleDeleteSelected,
    loading: deleting,
    error: deleteError,
    success: deleteSuccess,
  } = useDeleteItems();

  const handleDeleteTimeTrackings = async () => {
    const selectedIds = Array.from(checkedItems);
    await handleDeleteSelected(
      "/api/projects/time-trackings/delete",
      selectedIds
    );
    // Check if there's an error; if not, navigate to /customers
    if (!deleteError) {
      fetchTableItems();
    }
  };

  const handleDeleteProject = async () => {
    if (id) {
      await handleDeleteSelected("/api/projects/delete", id);
      if (!deleteError) {
        navigate("/projects");
      }
    }
  };

  if (error) {
    return <Alert message={error} type="error" />;
  }

  if (loading || deleting) {
    <Loader fullPage={false} />;
  }

  if (!projectData) {
    return <Loader fullPage={true} />;
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
      <div className="wrapper project-overview">
        <Link className="link" to="/projects/">
          Projects
        </Link>
        <Link className="button" to="/projects/edit/{{project._id}}">
          Edit Project
        </Link>

        <div className="alert alert-success hidden" role="alert">
          Project edited!
        </div>

        <button onClick={handleDeleteProject} type="submit">
          Delete
        </button>

        <div className="overview separate">
          <div className="inline">
            <p>Name:</p>
            <p>{projectData.project.name}</p>
          </div>
          <div className="inline">
            <p>Customer:</p>
            <Link
              className="link"
              to={`/customers/${projectData.project.customer_id}`}
            >
              <p>{projectData.customer_name}</p>
            </Link>
          </div>
          <div className="inline">
            <p>Description:</p>
            <p>{projectData.project.description}</p>
          </div>
          {projectData.invoice && (
            <div className="inline">
              <p>Billed to:</p>
              <p>
                <Link
                  className="link"
                  to={`/invoices/${projectData.invoice._id}}`}
                >
                  {projectData.customizationSettings.invoice_prefix}
                  {projectData.customizationSettings.invoice_separator}
                  {projectData.invoice.number}
                </Link>
              </p>
            </div>
          )}
        </div>

        {projectData.billed ? (
          <div className="separate">
            <p>
              ❗This project has been added to an invoice, start a new project
              to track time or delete your invoice.
            </p>
          </div>
        ) : (
          <form
            action="/projects/time-tracking/start/{{project._id}}/"
            method="post"
          >
            <label htmlFor="time-tracking-name">Name:</label>
            <input
              type="text"
              className="time-tracking-name"
              id="time-tracking-name"
              name="time_tracking_name"
            />
            <button type="submit" className="time-tracking-start">
              Start
            </button>
          </form>
        )}

        <form
          action="/projects/time-tracking/stop/{{project._id}}/"
          method="post"
        >
          <button type="submit" className="time-tracking-stop hidden">
            Stop
          </button>
        </form>
        {deleteSuccess && (
          <Alert
            key={deleteSuccess.id}
            message={deleteSuccess.message}
            type="success"
          />
        )}
        {timeTrackingsData.items.length > 0 && (
          <>
            <button onClick={handleDeleteTimeTrackings} type="submit">
              Delete
            </button>
            <div className="time-tracking table">
              <div className="overview separate">
                <div className="inline">
                  <p>Total Time:</p>
                  <p className="total-time-passed">
                    {timeTrackingsData.totalTime}
                  </p>
                </div>
              </div>
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
                      onClick={() =>
                        handleSort && handleSort("duration_seconds")
                      }
                      className={getSortClass("duration_seconds") + ` sort-th`}
                    >
                      Total Time
                    </th>
                    <th
                      onClick={() => handleSort && handleSort("start")}
                      className={getSortClass("start") + ` sort-th`}
                    >
                      Start
                    </th>
                    <th
                      onClick={() => handleSort && handleSort("stop")}
                      className={getSortClass("stop") + ` sort-th`}
                    >
                      Stop
                    </th>
                  </tr>
                </thead>
                {loadingTableItems || deleting ? (
                  <tbody>
                    <tr>
                      <td colSpan={5}>
                        <Loader fullPage={false} />
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {timeTrackings?.map((timeTracking) => (
                      <tr className="time-tracking-tr" key={timeTracking._id}>
                        <td>
                          <label className="checkbox">
                            <input
                              type="checkbox"
                              className="time-tracking-checkbox box-checkbox"
                              checked={checkedItems.has(timeTracking._id)}
                              onChange={() => handleCheckItem(timeTracking._id)}
                            />
                          </label>
                        </td>
                        <td>{timeTracking.name}</td>
                        <td className="time-passed">
                          {timeTracking.totalTime}
                        </td>
                        <td>{timeTracking.start}</td>
                        <td className="stop-td">
                          {timeTracking.stop ? (
                            <p className="stop">{timeTracking.stop}</p>
                          ) : (
                            <form
                              action="/projects/time-tracking/stop/{{../project._id}}/{{_id}}"
                              method="post"
                            >
                              <button
                                type="submit"
                                className="time-tracking-stop"
                                // onClick="stopTimeTracking()"
                              >
                                Stop
                              </button>
                            </form>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </>
        )}
        <div className="pagination">
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              link={`/projects/${projectData.project._id}`}
              linkOptions={linkOptions}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Project;
