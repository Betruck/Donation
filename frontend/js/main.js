// Define the backend API URL
const backendApiUrl = 'https://donation-production.up.railway.app'; // Replace with your actual backend API URL

/* 1. Signup functionality */
const signupForm = document.getElementById('signup-form');
signupForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };
    try {
        const response = await fetch(`${backendApiUrl}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (result.success) {
            alert('Signup successful');
            window.location.href = 'login.html';
        } else {
            alert('Signup failed: ' + result.message);
        }
    } catch (error) {
        console.error('Error during signup:', error);
        alert('An error occurred during signup');
    }
});

/* 2. Login functionality */
const loginForm = document.getElementById('login-form');
loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
    };
    try {
        const response = await fetch(`${backendApiUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (result.success && result.user && result.user.username) {
            console.log(result.user); // Log user details to the console
            localStorage.setItem('user', JSON.stringify(result.user)); // Save user details locally
            localStorage.setItem('token', result.token); // Save the JWT token locally
            replaceAuthButtonsWithUsername(result.user.username); 
            window.location.href = 'index.html';
        } else {
            alert('Login failed: ' + result.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login');
    }
});

function replaceAuthButtonsWithUsername(username) {
    const authButtons = document.getElementById('auth-buttons');
    if (authButtons) {
        const profileContainer = document.createElement('div');
        profileContainer.classList.add('profile-container', 'dropdown');
        profileContainer.style.position = 'relative';

        // Create the profile picture circle
        const profilePic = document.createElement('div');
        profilePic.classList.add('profile-picture');
        profilePic.style.width = '50px';
        profilePic.style.height = '50px';
        profilePic.style.borderRadius = '50%';
        profilePic.style.backgroundColor = 'rgb(196, 218, 210)';
        profilePic.style.color = 'rgb(22, 66, 60)';
        profilePic.style.display = 'flex';
        profilePic.style.alignItems = 'center';
        profilePic.style.justifyContent = 'center';
        profilePic.style.fontWeight = 'bold';
        profilePic.style.fontSize = '1.2em';
        profilePic.textContent = username.substring(0, 2).toUpperCase(); // Display first 2 letters of username

        profilePic.style.cursor = 'pointer'; // Make profile pic clickable

        // Create the dropdown menu
        const dropdownMenu = document.createElement('div');
        dropdownMenu.classList.add('dropdown-menu');
        dropdownMenu.style.position = 'absolute';
        dropdownMenu.style.top = '100%';
        dropdownMenu.style.left = '0';
        dropdownMenu.style.backgroundColor = '#fff';
        dropdownMenu.style.padding = '10px';
        dropdownMenu.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
        dropdownMenu.style.display = 'none'; // Hide dropdown initially

        // Create logout option
        const logoutOption = document.createElement('button');
        logoutOption.textContent = 'Log Out';
        logoutOption.style.display = 'block';
        logoutOption.style.margin = '5px 0';
        logoutOption.addEventListener('click', handleLogout);

        dropdownMenu.appendChild(logoutOption);

        // Toggle dropdown on profile picture click
        profilePic.addEventListener('click', () => {
            dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
        });

        // Append the profile picture and dropdown menu to the container
        profileContainer.appendChild(profilePic);
        profileContainer.appendChild(dropdownMenu);

        // Replace auth buttons with the profile container
        authButtons.replaceWith(profileContainer);
    }
}

// Handle logout function
function handleLogout() {
    // Clear user data from local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
        const user = JSON.parse(storedUser);
        if(user && user.username) {
            replaceAuthButtonsWithUsername(user.username);
        } else {
            console.error('User object is missing username');
        }
    } else {
        console.error('No user object found in local storage');
    }
});

// Fetch all donation buttons once DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const donationButtons = document.querySelectorAll('[data-amount]');
    
    donationButtons.forEach(button => {
        button.addEventListener('click', handleDonationClick);
    });
});

// Handle donation click
function handleDonationClick(event) {
    event.preventDefault();  // Stop any default button action early
    
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) {
        // User is not logged in
        alert('Please log in to make a donation.');
        window.location.href = 'login.html';  // Redirect to login page
        return;  // Exit the function to stop further execution
    }

    // User is logged in
    const user = JSON.parse(storedUser);
    let amount = event.target.getAttribute('data-amount');
    
    if (amount === 'custom-amount') {
        const customAmountInput = document.querySelector('.custom-amount');
        if (customAmountInput) {
            amount = customAmountInput.value;
        }
    }

    console.log(`User: ${user.username}, Donation Amount: ${amount}`);
    // Proceed with the donation logic using `amount` and `user`

}

// -----------------------
// Chart Rendering Logic
// -----------------------
const sdg1Data = {
    labels: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [{
        label: 'People in Poverty (millions)',
        data: [750, 720, 700, 680, 660, 640, 655, 575],
        backgroundColor: 'rgba(255, 136, 91, 0.5)',
        borderColor: '#FF885B',
        borderWidth: 2
    }]
};

const sdg2Data = {
    labels: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [{
        label: 'People Facing Hunger (millions)',
        data: [630, 640, 650, 670, 680, 690, 700, 600],
        backgroundColor: 'rgba(22, 66, 60, 0.5)',
        borderColor: '#557C56',
        borderWidth: 2
    }]
};

const sdg1Chart = new Chart(document.getElementById('sdg1Chart'), {
    type: 'line',
    data: sdg1Data,
    options: { scales: { y: { beginAtZero: true } } }
});

const sdg2Chart = new Chart(document.getElementById('sdg2Chart'), {
    type: 'line',
    data: sdg2Data,
    options: { scales: { y: { beginAtZero: true } } }
});
