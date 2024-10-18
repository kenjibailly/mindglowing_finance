document.addEventListener('DOMContentLoaded', function() {
    const errorOverlay = document.querySelector('.error-overlay .blur');
    if (errorOverlay) {
        errorOverlay.addEventListener("click", async function () {
            closeError();
        });
    }
});

function closeError() {
    const errorOverlay = document.querySelector('.error-overlay');
    errorOverlay.remove();
}