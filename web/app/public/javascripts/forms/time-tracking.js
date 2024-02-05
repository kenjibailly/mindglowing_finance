// If we're on the project overview page
if (projectOverview) {

    // Select all elements with the class "time-tracking-tr"
    const timeTrackingRows = document.querySelectorAll('.time-tracking-tr');
    const totalTimePassedEl = document.querySelector('.total-time-passed');

    // Loop through each timeTracking row
    timeTrackingRows.forEach(row => {
        // Check if the row does not have the class "stop"
        const stopEl = row.querySelector('.stop-td .stop');
        if (!stopEl) {
            // Get relevant data attributes from the row
            const timePassedEl = row.querySelector('.time-passed');

            // Initialize timePassed if not present
            var timePassed = unformatTime(timePassedEl.innerHTML) || 0;
            var totalTimePassed = unformatTime(totalTimePassedEl.innerHTML) || 0;

            // Update timePassed differently (e.g., with a timer)
            const timeTrackTimer = setInterval(() => {
                timePassed += 1;
                totalTimePassed +=1;

                // Update the timePassed element
                timePassedEl.innerHTML = formatTime(timePassed);
                totalTimePassedEl.innerHTML = formatTime(totalTimePassed);
            }, 1000);
        }
    });

}


function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    return formattedTime;
}

function unformatTime(formattedTime) {
    // Split the formatted time into hours, minutes, and seconds
    const [hours, minutes, seconds] = formattedTime.split(':').map(Number);

    // Calculate the total time in seconds
    const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

    return totalTimeInSeconds;
}


function deleteSelectedTimeTrackings(project_id) {

    // Select all checked checkboxes
    const checkedCheckboxes = document.querySelectorAll('.time-tracking-checkbox:checked');
    // Extract data-ids from checked checkboxes
    const selectedIds = Array.from(checkedCheckboxes).map((checkbox) => {
        return checkbox.dataset.id;
    });

    // Send a POST request with the selected data-ids
    fetch(`/projects/time-tracking/delete-selected/${project_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedIds }),
    })
    .then(response => response.json())
    .then(data => {
        // Check for success message or error message in the response
        if (data.message === 'Time trackings deleted successfully') {
            // Perform page refresh or other actions
            location.reload(); // Reload the page
        } else {
            // Handle errors
            console.error('Error:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}