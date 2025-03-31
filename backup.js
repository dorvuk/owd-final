// // DROPDOWN NA PRIJAVA-PROJEKTA.HTML
// document.addEventListener("DOMContentLoaded", async () => {
//     const today = new Date();
//     const projectDropdown = document.getElementById("project-name");

//     if (projectDropdown) {
//         try {
//             // Define category pages to fetch projects from
//             const categoryPages = [
//                 "radionice.html",
//                 "natjecanja.html",
//                 "programi.html",
//                 "proslave.html",
//                 "eu_projekti.html",
//             ];

//             async function fetchProjects(url) {
//                 const response = await fetch(url);
//                 const text = await response.text();
//                 const parser = new DOMParser();
//                 const doc = parser.parseFromString(text, "text/html");
//                 return Array.from(doc.querySelectorAll(".project"));
//             }

//             let allProjects = [];
//             for (const page of categoryPages) {
//                 const projects = await fetchProjects(page);
//                 allProjects = allProjects.concat(projects);
//             }

//             // Sort projects by date (most recent first)
//             allProjects.sort((a, b) => {
//                 const dateA = new Date(a.dataset.date);
//                 const dateB = new Date(b.dataset.date);
//                 return dateB - dateA; // Most recent projects first
//             });

//             // Clear existing options in the dropdown (optional)
//             projectDropdown.innerHTML = '<option>Odaberi projekt</option>';

//             // Populate the dropdown with sorted projects
//             allProjects.forEach((project) => {
//                 const deadline = new Date(project.dataset.date);
//                 const projectName = project.dataset.name;

//                 const option = document.createElement("option");
//                 option.value = projectName;
//                 option.textContent = projectName;

//                 // Disable options for projects past the deadline
//                 if (today > deadline) {
//                     option.disabled = true;
//                     option.textContent += " (Isteklo)";
//                 }

//                 projectDropdown.appendChild(option);
//             });

//             console.log("Dropdown populated and sorted by date.");
//         } catch (error) {
//             console.error("Error fetching or processing projects:", error);
//         }
//     } else {
//         console.error("Dropdown with id 'project-name' not found.");
//     }
// });

// //AUTOFILL PROJECT
// document.addEventListener("DOMContentLoaded", () => {
//     const params = new URLSearchParams(window.location.search);
//     const selectedProject = params.get("project");

//     if (selectedProject) {
//         const projectSelect = document.getElementById("project-name");
//         Array.from(projectSelect.options).forEach(option => {
//             if (option.textContent.trim() === selectedProject.trim()) {
//                 projectSelect.value = option.value; // Set the matching value
//             }
//         });
//     }
// });
