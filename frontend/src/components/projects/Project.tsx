import { useEffect, useRef, useState } from "react";
import Alert from "../Alert";
import Loader from "../Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import useDeleteItems from "../hooks/useDeleteItems";
import { ProjectFetch, TimeTrackingFetch } from "../types/Projects";
import useFetchData from "../hooks/useFetchData";
import Pagination from "../Pagination";
import usePaginatedTable from "../hooks/usePaginatedTable";

import useRunningTimer from "../hooks/useStartRunningTimer";

const Project = () => {
  const { id } = useParams<{ id: string }>();
  const [timeTrackingSuccess, setTimeTrackingSuccess] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const [timeTrackingError, setTimeTrackingError] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const [isTimeTrackingRunning, setIsTimeTrackingRunning] =
    useState<boolean>(false);
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

  const { startUseRunningTimer, stopAllRunningTimers, timers } =
    useRunningTimer(); // Call the hook function

  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
    fetchTableItems();
  }, [id]);

  useEffect(() => {
    const hasRunningTimeTracking = (timeTrackings as TimeTrackingFetch[]).some(
      (item) => item.stop === null || item.stop === ""
    );
    setIsTimeTrackingRunning(hasRunningTimeTracking);
  }, [timeTrackings]);

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

  const handleStartTimeTracking = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const timeTrackingNameInput = form.elements.namedItem(
      "time_tracking_name"
    ) as HTMLInputElement;
    const timeTrackingName = timeTrackingNameInput.value;

    try {
      const response = await fetch(
        `/api/projects/${projectData?.project._id}/time-trackings/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            time_tracking_name: timeTrackingName, // Send the name in the request body
          }),
        }
      );
      if (response.ok) {
        setIsTimeTrackingRunning(true);
        fetchTableItems();
        if (!loadingTableItems) {
          setTimeTrackingSuccess({
            message: "Time tracking successfully started!",
            id: Date.now(),
          });
        }
      } else {
        const error = await response.json();
        setTimeTrackingError({
          message: error.message
            ? error.message
            : "Something went wrong while starting the time tracking, please try again later.\n",
          id: Date.now(),
        });
      }
    } catch (err) {
      setTimeTrackingError({
        message:
          "Something went wrong while starting the time tracking, please try again later.\n" +
          (err as Error).message,
        id: Date.now(),
      });
    }
  };

  const handleStopTimeTracking = async (id: string) => {
    try {
      const response = await fetch(
        `/api/projects/${projectData?.project._id}/time-trackings/stop/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setIsTimeTrackingRunning(false);
        fetchTableItems();
        stopAllRunningTimers();
        if (!loadingTableItems) {
          setTimeTrackingSuccess({
            message: "Time tracking successfully stopped!",
            id: Date.now(),
          });
        }
      } else {
        setTimeTrackingError({
          message:
            "Something went wrong while stopping the time tracking, please try again later.",
          id: Date.now(),
        });
      }
    } catch (err) {
      setTimeTrackingError({
        message:
          "Something went wrong while stopping the time tracking, please try again later.\n" +
          (err as Error).message,
        id: Date.now(),
      });
    }
  };

  if (error) {
    return <Alert message={error} type="error" scroll={true} />;
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
          scroll={true}
        />
      )}
      <div className="wrapper project-overview">
        <Link className="link" to="/projects/">
          Projects
        </Link>
        <Link
          className="button"
          to={`/projects/edit/${projectData.project._id}>`}
        >
          Edit Project
        </Link>
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
        {projectData.billed && (
          <div className="separate">
            <p>
              ❗This project has been added to an invoice, start a new project
              to track time or delete your invoice.
            </p>
          </div>
        )}
        {!isTimeTrackingRunning && !projectData.billed ? (
          <form onSubmit={handleStartTimeTracking}>
            <label htmlFor="time-tracking-name">Add Time Tracking:</label>
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
        ) : (
          <Alert
            key={Date.now()}
            message={`❗You currently have running time trackings, stop your time tracking to start a new one.`}
            type="info"
            scroll={false}
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
        {timeTrackingSuccess && !loadingTableItems && (
          <Alert
            key={timeTrackingSuccess.id}
            message={timeTrackingSuccess.message}
            type="success"
            scroll={true}
          />
        )}
        {timeTrackingError && !loadingTableItems && (
          <Alert
            key={timeTrackingError.id}
            message={timeTrackingError.message}
            type="error"
            scroll={true}
          />
        )}
        {!loadingTableItems && timeTrackingsData.items.length > 0 && (
          <>
            <button onClick={handleDeleteTimeTrackings} type="submit">
              Delete
            </button>
            <div className="time-tracking table">
              <div className="overview separate">
                <div className="inline">
                  <p>Total Time:</p>
                  <p className="total-time-passed">
                    {isTimeTrackingRunning && timers ? (
                      <>
                        {startUseRunningTimer(
                          timeTrackingsData.totalTime ?? "0h 0m 0s",
                          "total_time"
                        )}
                        {timers.find((timer) => timer.id === "total_time")
                          ?.newTime || "0h 0m 0s"}
                      </>
                    ) : (
                      timeTrackingsData.totalTime
                    )}
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
                          {timeTracking.stop !== "" ? (
                            timeTracking.totalTime
                          ) : (
                            <>
                              {startUseRunningTimer(
                                timeTracking.totalTime ?? "0h 0m 0s",
                                timeTracking._id
                              )}
                              {timers.find(
                                (timer) => timer.id === timeTracking._id
                              )?.newTime || "0h 0m 0s"}
                            </>
                          )}
                        </td>
                        <td>{timeTracking.start}</td>
                        <td className="stop-td">
                          {timeTracking.stop ? (
                            <p className="stop">{timeTracking.stop}</p>
                          ) : (
                            <button
                              type="submit"
                              className="time-tracking-stop button"
                              onClick={() =>
                                handleStopTimeTracking(timeTracking._id)
                              }
                            >
                              Stop
                            </button>
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
