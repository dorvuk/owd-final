//SLIDESHOW

const slideshow = document.querySelector('.slideshow');
const images = slideshow.querySelectorAll('.slide');

// Modal setup
const modal = document.createElement('div');
modal.classList.add('modal');
modal.innerHTML = `
    <div class="modal-content">
        <span class="close">&times;</span>
        <img class="modal-image" src="" title="Povećana slika">
    </div>
`;
document.body.appendChild(modal);

const modalImage = modal.querySelector('.modal-image');
const closeButton = modal.querySelector('.close');

let isSlideshowPaused = false;
let scrollInterval;

// Clone images and attach event listeners
images.forEach((img) => {
    const clone = img.cloneNode(true);
    slideshow.appendChild(clone);

    // Attach click event listener to the clone
    clone.addEventListener('click', () => openModal(clone.src));
});

// Start the slideshow
function startSlideshow() {
    scrollInterval = setInterval(() => {
        slideshow.scrollLeft += 1; // Adjust speed as needed
        if (slideshow.scrollLeft >= slideshow.scrollWidth / 2) {
            slideshow.scrollLeft = 0; // Reset to the start for infinite looping
        }
    }, 30);
}

// Stop the slideshow
function stopSlideshow() {
    clearInterval(scrollInterval);
}

// Open the modal
function openModal(imgSrc) {
    stopSlideshow();
    isSlideshowPaused = true;
    modalImage.src = imgSrc;
    modal.style.display = 'flex'; // Show modal
    modal.classList.add('open-animation');
    setTimeout(() => modal.classList.remove('open-animation'), 300); // Clean up after animation
}

// Close the modal
function closeModal() {
    modal.classList.add('close-animation');
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('close-animation');
        if (isSlideshowPaused) {
            startSlideshow();
            isSlideshowPaused = false;
        }
    }, 300); // Match animation duration
}

// Event listeners for original images
images.forEach((img) => {
    img.addEventListener('click', () => openModal(img.src));
});

closeButton.addEventListener('click', closeModal);

// Start the slideshow on page load
startSlideshow();

//ACCESSIBILITY SETTINGS
// Elements
const settingsIcon = document.querySelector('.settings .icon');
const settingsMenu = document.querySelector('.settings-menu');
const fontSizeSlider = document.getElementById('font-size-slider');
const highContrastCheckbox = document.getElementById('high-contrast');

// Toggle the settings menu
settingsIcon.addEventListener('click', () => {
    settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block';
});

// Apply saved preferences on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedFontSize = localStorage.getItem('fontSize');
    const savedHighContrast = localStorage.getItem('highContrast');

    if (savedFontSize) {
        document.documentElement.style.fontSize = `${savedFontSize}px`;
        fontSizeSlider.value = savedFontSize;
    }

    if (savedHighContrast === 'true') {
        document.body.classList.add('high-contrast');
        highContrastCheckbox.checked = true;
    }
});

// Adjust font size
fontSizeSlider.addEventListener('input', (e) => {
    const fontSize = e.target.value;
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('fontSize', fontSize);
});

// Toggle high contrast mode
highContrastCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
        document.body.classList.add('high-contrast');
        localStorage.setItem('highContrast', 'true');
    } else {
        document.body.classList.remove('high-contrast');
        localStorage.setItem('highContrast', 'false');
    }
});

//LOGIN
// Predefined user accounts
const validUsers = {
    dorian123: "test123",
    doris123: "test123",
    tona123: "test123",
};

// Function to check login status
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const loggedInUser = localStorage.getItem("username");
    return { isLoggedIn, loggedInUser };
}

// Function to update login UI based on login status
function updateLoginUI() {
    const { isLoggedIn, loggedInUser } = checkLoginStatus();

    const loginDiv = document.querySelector(".login");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginButton = document.querySelector(".small-button");

    if (isLoggedIn && loggedInUser) {
        // User is logged in
        usernameInput.style.display = "none";
        passwordInput.style.display = "none";

        // Add welcome message
        let welcomeMessage = loginDiv.querySelector(".welcome-message");
        if (!welcomeMessage) {
            welcomeMessage = document.createElement("p");
            welcomeMessage.textContent = `Dobrodošli, ${loggedInUser}!`;
            welcomeMessage.classList.add("welcome-message");
            loginDiv.insertBefore(welcomeMessage, loginButton);
        }

        // Change button to "Odjavi se"
        loginButton.textContent = "Odjavi se";

        // Add logout functionality
        loginButton.onclick = () => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("username");
            location.reload(); // Reload to reset the UI
        };
    } else {
        // User is not logged in
        loginButton.textContent = "Prijavi se";

        loginButton.onclick = (e) => {
            e.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            // Validate login credentials
            if (!validUsers[username]) {
                showTemporaryPlaceholder(usernameInput, "Korisnik ne postoji.");
                usernameInput.value = ""; // Clear the username input
                passwordInput.value = ""; // Clear the password input
                return;
            }

            if (validUsers[username] !== password) {
                showTemporaryPlaceholder(passwordInput, "Neispravna lozinka.");
                passwordInput.value = ""; // Clear the password input
                return;
            }

            // Successful login
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", username);
            location.reload(); // Reload to update the UI
        };
    }
}


function updateProjectButtons() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    document.querySelectorAll(".apply-button").forEach(button => {
        button.disabled = !isLoggedIn; // Enable or disable based on login status
        button.classList.toggle("disabled", !isLoggedIn); // Add or remove "disabled" class
        button.title = isLoggedIn ? "" : "Morate biti prijavljeni da biste se prijavili."; // Update tooltip
    });
    
    const prijavaProjekataButton = document.getElementById("prijava_projekata");
    if (prijavaProjekataButton) {
        prijavaProjekataButton.classList.toggle("disabled", !isLoggedIn); // Add or remove "disabled" class
        prijavaProjekataButton.title = isLoggedIn ? "" : "Morate biti prijavljeni da biste pristupili prijavi projekata.";
    }
}

// Function to display temporary placeholder with error
function showTemporaryPlaceholder(inputElement, message) {
    const originalPlaceholder = inputElement.placeholder; // Save the original placeholder
    inputElement.placeholder = message; // Replace with error message
    inputElement.classList.add("error"); // Add error class

    // Restore original placeholder and remove error class after a delay
    setTimeout(() => {
        inputElement.placeholder = originalPlaceholder; // Restore placeholder
        inputElement.classList.remove("error"); // Remove error class gradually
    }, 3000); // Duration of the error display
}

//MOST RECENT PROJECTS
// Helper function to fetch projects from a category page
async function fetchProjects(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        return Array.from(doc.querySelectorAll(".project"));
    } catch (error) {
        console.error(`Error fetching projects from ${url}:`, error);
        return [];
    }
}

// Function to get recent projects from all category pages
async function getRecentProjects() {
    const categoryPages = [
        "radionice.html",
        "natjecanja.html",
        "programi.html",
        "proslave.html",
        "eu_projekti.html",
    ];

    let allProjects = [];

    for (const page of categoryPages) {
        const projects = await fetchProjects(page);
        allProjects = allProjects.concat(projects);
    }

    // Parse dates and sort projects by recency
    allProjects.sort((a, b) => {
        const dateA = new Date(a.dataset.date);
        const dateB = new Date(b.dataset.date);
        return dateB - dateA; // Newest first
    });

    // Return the 5 most recent projects
    return allProjects.slice(0, 5);
}

// Function to display recent projects on the homepage
async function displayRecentProjects() {
    const recentProjects = await getRecentProjects();
    const projectsContainer = document.querySelector("#recent-projects");

    recentProjects.forEach((project) => {
        const projectClone = project.cloneNode(true);

        // Modify the apply-button
        const applyButton = projectClone.querySelector(".apply-button");
        if (applyButton) {
            applyButton.textContent = "Saznaj više";
            applyButton.className = "gotocategory";

            // Format the category into a valid href
            const category = projectClone.dataset.category.toLowerCase().replace(/\s+/g, "_");
            const categoryHref = `${category}.html`;

            // Set the button to redirect to the category page
            applyButton.href = categoryHref;
        }

        projectsContainer.appendChild(projectClone);
    });
}


// Run the function to display projects on homepage
// Initialize login state and UI
document.addEventListener("DOMContentLoaded", async () => {
    const isIndexPage = document.querySelector("#recent-projects") !== null;

    if (isIndexPage) {
        // Dynamically load projects only on the index page
        await displayRecentProjects();
    }

    // Initialize login UI and update buttons after confirming the page type
    updateLoginUI();
    updateProjectButtons();
});

//VALIDATION
function validateForm() {
    const emailInput = document.getElementById("email");
    const mobileInput = document.getElementById("phone");
    const projectInput = document.getElementById("project-name");
    const gradeInput = document.getElementById("grade");
    const nameInput = document.getElementById("name");

    // Helper function to show error
    function showError(input, message) {
        const originalPlaceholder = input.placeholder;
        input.value = "";
        input.placeholder = message;
        input.classList.add("input-error");

        setTimeout(() => {
            input.classList.remove("input-error");
            input.placeholder = originalPlaceholder;
        }, 3000);
    }

    function showErrorForSelect(select, message) {
        const originalPlaceholder = select.options[0].text; // Save the original placeholder text
        select.classList.add("input-error"); // Add error class to highlight the field
    
        // Temporarily replace the first option's text with the error message
        select.options[0].text = message;
        select.selectedIndex = 0; // Reset to the first option to show the error message
    
        setTimeout(() => {
            select.classList.remove("input-error"); // Remove error class after 3 seconds
            select.options[0].text = originalPlaceholder; // Restore the original placeholder
        }, 3000);
    }

    if (projectInput.value === "Odaberi projekt") {
        showErrorForSelect(projectInput, "Odaberite projekt.");
        return false;
    }

    if (!nameInput.value.trim()) {
        showError(nameInput, "Unesite ime i prezime.");
        return false;
    }

    if (gradeInput.value === "Odaberi razred") {
        showErrorForSelect(gradeInput, "Odaberite razred.");
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, "Unesite validnu e-mail adresu.");
        return false;
    }

    // Mobile number validation
    const mobileRegex = /^(\+?\d[\d\s-]{8,14}\d)$/;    
    if (!mobileRegex.test(mobileInput.value.trim())) {
        showError(mobileInput, "Unesite validan broj mobitela.");
        return false;
    }    

    // If all validations pass, redirect to feedback.html with project information
    const selectedProject = projectInput.value;
    const url = `feedback.html?project=${encodeURIComponent(selectedProject)}`;
    console.log(url)
    window.location.href = url;
    return true;
}


//FEEDBACK FILL UP
document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const selectedProject = params.get("project");

    if (!selectedProject) return;

    // Populate static fields
    document.querySelector(".feedback-message").textContent = `Prijava za ${selectedProject} uspješno zaprimljena!`;

    // Fetch category data
    const categoryPages = [
        "radionice.html",
        "natjecanja.html",
        "programi.html",
        "proslave.html",
        "eu_projekti.html"
    ];

    for (const page of categoryPages) {
        const response = await fetch(page);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        const projectDiv = Array.from(doc.querySelectorAll(".project")).find(
            (div) => div.querySelector("h3").textContent === selectedProject
        );

        if (projectDiv) {
            // Populate dynamic fields
            const submissionDeadline = projectDiv.dataset.date;
            const executionDate = new Date(new Date(submissionDeadline).getTime() + 5 * 24 * 60 * 60 * 1000);
            const location = `OŠ Augusta Harambašića, ${String.fromCharCode(65 + Math.floor(Math.random() * 4))}-${String(Math.floor(Math.random() * 150 + 1)).padStart(3, "0")}`;
            const category = projectDiv.dataset.category;
            const contactPerson = projectDiv.querySelector("#contact-person").textContent.split(":")[1].trim();
            const availableSlots = projectDiv.querySelector("#free-slots").textContent.split(":")[1].trim();

            document.querySelector("#submission-deadline").textContent = submissionDeadline;
            document.querySelector("#execution-date").textContent = executionDate.toISOString().split("T")[0];
            document.querySelector("#location").textContent = location;
            document.querySelector("#project-category").textContent = category;
            document.querySelector("#contact-person").textContent = contactPerson;
            document.querySelector("#available-slots").textContent = availableSlots;

            break;
        }
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    // DROPDOWN NA PRIJAVA-PROJEKTA.HTML
    const today = new Date();
    const projectDropdown = document.getElementById("project-name");

    if (projectDropdown) {
        try {
            // Define category pages to fetch projects from
            const categoryPages = [
                "radionice.html",
                "natjecanja.html",
                "programi.html",
                "proslave.html",
                "eu_projekti.html",
            ];

            async function fetchProjects(url) {
                const response = await fetch(url);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, "text/html");
                return Array.from(doc.querySelectorAll(".project"));
            }

            let allProjects = [];
            for (const page of categoryPages) {
                const projects = await fetchProjects(page);
                allProjects = allProjects.concat(projects);
            }

            // Sort projects by date (most recent first)
            allProjects.sort((a, b) => {
                const dateA = new Date(a.dataset.date);
                const dateB = new Date(b.dataset.date);
                return dateB - dateA; // Most recent projects first
            });

            // Clear existing options in the dropdown
            projectDropdown.innerHTML = '<option>Odaberi projekt</option>';

            // Populate the dropdown with sorted projects
            allProjects.forEach((project) => {
                const deadline = new Date(project.dataset.date);
                const projectName = project.dataset.name;

                const option = document.createElement("option");
                option.value = projectName;
                option.textContent = projectName;

                // Disable options for projects past the deadline
                if (today > deadline) {
                    option.disabled = true;
                    option.textContent += " (Isteklo)";
                }

                projectDropdown.appendChild(option);
            });

            console.log("Dropdown populated and sorted by date.");

            // AUTOFILL PROJECT
            const params = new URLSearchParams(window.location.search);
            const selectedProject = params.get("project");

            if (selectedProject) {
                Array.from(projectDropdown.options).forEach(option => {
                    if (option.textContent.trim() === selectedProject.trim()) {
                        projectDropdown.value = option.value; // Set the matching value
                    }
                });
            }

        } catch (error) {
            console.error("Error fetching or processing projects:", error);
        }
    } else {
        console.error("Dropdown with id 'project-name' not found.");
    }
});

//INACTIVE PROJECTS - RED

document.addEventListener("DOMContentLoaded", () => {

const today = new Date();

// Handle all projects on the category pages and index.html
document.querySelectorAll(".project").forEach((project) => {
    const deadline = new Date(project.getAttribute("data-date"));
        if (today > deadline) {
            // Mark the project as inactive
            project.classList.add("inactive");

            // Remove the apply button
            const applyButton = project.querySelector(".apply-button");
            if (applyButton) {
                const buttonParent = applyButton.parentElement; // Get the parent to retain layout
                buttonParent.removeChild(applyButton); // Remove the button
                
                // Create the deadline message and insert it in place of the button
                const message = document.createElement("div");
                message.classList.add("deadline-message");
                message.textContent = "Rok za prijavu projekta je istekao.";
                buttonParent.appendChild(message); // Add message where the button was
            }
        }
    });

});

//APPLIED PROJECTS - GREEN
document.addEventListener("DOMContentLoaded", () => {
    const currentUser = localStorage.getItem("username"); // Get the current logged-in user
    const appliedProjectsKey = "appliedProjects"; // Key for localStorage
    const appliedProjects = JSON.parse(localStorage.getItem(appliedProjectsKey)) || {};

    // Ensure the appliedProjects structure exists for the current user
    if (currentUser && !appliedProjects[currentUser]) {
        appliedProjects[currentUser] = [];
        localStorage.setItem(appliedProjectsKey, JSON.stringify(appliedProjects));
    }

    // Function to toggle project application status
    function toggleProject(projectName, action) {
        if (action === "apply") {
            if (!appliedProjects[currentUser].includes(projectName)) {
                appliedProjects[currentUser].push(projectName);
            }
        } else if (action === "unbind") {
            appliedProjects[currentUser] = appliedProjects[currentUser].filter(
                (name) => name !== projectName
            );
        }
        localStorage.setItem(appliedProjectsKey, JSON.stringify(appliedProjects));
    }

    // Function to update the button state and project class
    function updateProjectButtons() {
        const userAppliedProjects = appliedProjects[currentUser] || [];
        document.querySelectorAll(".project").forEach((project) => {
            const projectName = project.dataset.name;

            const applyButton = project.querySelector(".apply-button");
            if (!applyButton) return;

            // Store the original href in a data attribute if not already stored
            if (!applyButton.dataset.originalHref) {
                applyButton.dataset.originalHref = applyButton.getAttribute("href");
            }

            if (userAppliedProjects.includes(projectName)) {
                // Add "applied" class, change button text to "Odjavi projekt" and disable href
                project.classList.add("applied");
                applyButton.textContent = "Odjavi projekt";
                applyButton.removeAttribute("href"); // Temporarily disable href
                applyButton.onclick = (event) => {
                    event.preventDefault(); // Explicitly prevent redirection
                    toggleProject(projectName, "unbind");
                    updateProjectButtons(); // Refresh buttons
                };
            } else {
                // Remove "applied" class, change button text to "Prijavi se", and restore href
                project.classList.remove("applied");
                applyButton.textContent = "Prijavi se";
                applyButton.setAttribute("href", applyButton.dataset.originalHref); // Restore href
                applyButton.onclick = null; // Allow default behavior (redirect)
            }
        });
    }

    // Run this function on relevant pages (index.html or category pages)
    if (document.querySelectorAll(".project").length > 0) {
        updateProjectButtons();
    }

    // Save a project as applied when redirected to feedback.html
    if (window.location.pathname.endsWith("feedback.html")) {
        const feedbackMessage = document.querySelector(".feedback-message");
        if (feedbackMessage && feedbackMessage.textContent.includes("uspješno zaprimljena")) {
            const appliedProject = feedbackMessage.textContent.match(/Prijava za (.+) uspješno zaprimljena/)[1];
            if (currentUser && appliedProject) {
                toggleProject(appliedProject, "apply");
            }
        }
    }
});


