


const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("s-btn");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");

let currentPage = 1;
let currentQuery = "nature"; // Default query

// Function to fetch photos from the Pexels API
function fetchPhotos(query, page = 1) {
    let url = `https://api.pexels.com/v1/search?query=${query}&per_page=50&page=${page}`;

    fetch(url, {
        headers: {
            Authorization: "7WQFtWjuSjmAnvGpbK0zl6aQegN3bqAH99ohrYyxQNX1BYzvRSsCM6iE" // Replace with your actual Pexels API key
        }
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Could not fetch the Resource");
        }
        return res.json();
    })
    .then(data => {
        gallery.innerHTML = ""; // Clear previous results
        console.log(data)

        data.photos.forEach(photo => {
            // Create a Bootstrap column with the photo information
            const photoCard = document.createElement("div");
            photoCard.classList.add("col-md-3", "photo-card", "mb-4");

            photoCard.innerHTML = `
                <a href="${photo.url}" target="_blank">
                    <img src="${photo.src.medium}" alt="${photo.alt}" class="img-fluid rounded">
                </a>

            `;

            // Append photo card to the gallery
            gallery.appendChild(photoCard);
        });

        // Update pagination buttons
        prevButton.disabled = page === 1;
        nextButton.disabled = data.photos.length < 8; // Disable if fewer than 8 photos are returned
    })
    .catch(err => {
        console.error("Error:", err);
        gallery.innerHTML = `<p class="text-center text-danger">Error loading photos. Please try again later.</p>`;
    });
}

// Event listener for the search button
searchButton.addEventListener("click", () => {
    currentQuery = searchInput.value || "nature"; // Default to 'nature' if the search input is empty
    currentPage = 1;
    fetchPhotos(currentQuery, currentPage);
});

// Event listener for dropdown selection
document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", (event) => {
        currentQuery = event.target.textContent;
        searchInput.value = currentQuery; // Update search input with the category name
        currentPage = 1;
        fetchPhotos(currentQuery, currentPage);
    });
});

// Event listeners for pagination buttons
prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        fetchPhotos(currentQuery, currentPage);
    }
});

nextButton.addEventListener("click", () => {
    currentPage++;
    fetchPhotos(currentQuery, currentPage);
});

// Initial load
fetchPhotos(currentQuery, currentPage);
