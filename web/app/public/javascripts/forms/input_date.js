const paid_on = document.getElementById('paid_on');
if(paid_on) {
    // Get the current date in the format YYYY-MM-DD
    const currentDate = new Date().toISOString().split('T')[0];

    // Set the value of the input element to the current date
    paid_on.value = currentDate;
}
  