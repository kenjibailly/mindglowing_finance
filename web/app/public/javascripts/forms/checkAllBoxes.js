function checkAllBoxes(input) {
    // Select all checkboxes with the class 'box-checkbox'
    const checkboxes = document.querySelectorAll('.box-checkbox');

    // Loop through each checkbox and set its 'checked' property
    checkboxes.forEach((checkbox) => {
        checkbox.checked = input.checked;
    });
}