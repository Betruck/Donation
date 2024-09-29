document.addEventListener('DOMContentLoaded', () => {
    // Select all donate buttons with the data-amount attribute
    const donateButtons = document.querySelectorAll('button[data-amount]');
  
    // Add click event listener to each button
    donateButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            let amount = event.target.getAttribute('data-amount');
  
            // Check if the amount is 'custom-amount', and retrieve the value from the input field
            if (amount === 'custom-amount') {
                amount = document.getElementById('custom-amount').value;
            }
  
            // Redirect to payment page with the selected amount
            if (amount && amount > 0) {
                window.location.href = `/payment.html?amount=${amount}`;
            } else {
                alert('Please enter a valid donation amount.');
            }
        });
    });

    // Payment form functionality
    const cardNumberInput = document.getElementById('card-number');
    const expiryDateInput = document.getElementById('expiry-date');
    const cvvInput = document.getElementById('cvv'); // Ensure you have a CVV input element
    const paymentForm = document.getElementById('payment-form');
    const congratsMessage = document.getElementById('congrats-message');

    // Auto-spacing for card number input (1234 5678 1234 5678)
    cardNumberInput.addEventListener('input', (e) => {
        let cardNumber = e.target.value.replace(/\D/g, '').substring(0, 16);
        cardNumber = cardNumber.match(/.{1,4}/g)?.join(' ') || '';
        e.target.value = cardNumber;
    });

    // Auto-slash for expiry date input (MM/YY)
    expiryDateInput.addEventListener('input', (e) => {
        let expiryDate = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (expiryDate.length >= 3) {
            expiryDate = expiryDate.substring(0, 2) + '/' + expiryDate.substring(2, 4);
        }
        e.target.value = expiryDate;
    });

    // Form submission with congratulatory message
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the default form submission

        // Validate inputs (make sure to check CVV length too)
        if (cardNumberInput.value.length !== 19 || 
            expiryDateInput.value.length !== 5 || 
            cvvInput.value.length !== 3) {
            alert('Please fill out all fields correctly.');
            return;
        }

        // Hide the form and show the congratulatory message
        paymentForm.style.display = 'none';
        congratsMessage.style.display = 'block';
    });
});
