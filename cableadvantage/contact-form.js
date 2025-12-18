document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const alertPlaceholder = document.getElementById('alert-placeholder');

    function showAlert(message, type) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        alertPlaceholder.innerHTML = '';
        alertPlaceholder.append(wrapper);
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Disable submit button and show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';

        // Create FormData object
        const formData = new FormData(form);

        // Send AJAX request
        fetch('submit.php', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                showAlert(data.message, 'success');
                form.reset();
            } else {
                showAlert(data.message, 'danger');
            }
        })
        .catch(error => {
            showAlert('An error occurred. Please try again later.', 'danger');
            console.error('Error:', error);
        })
        .finally(() => {
            // Restore submit button state
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        });
    });
});