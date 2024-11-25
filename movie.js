// Extract IMDb ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id'); // Get the IMDb ID from the URL

// Function to fetch and display movie details
function fetchMovieDetails(imdbId) {
  const apiKey = '7c00b3de'; // Replace with your OMDb API key
  const omdbUrl = `http://www.omdbapi.com/apikey.aspx?VERIFYKEY=15fc98f0-8124-464e-a274-ab49d0f2e66e`;

  // Fetch movie data from the OMDb API
  fetch(omdbUrl)
    .then(response => response.json())
    .then(data => {
      if (data.Response === "True") {
        document.getElementById('movie-details').innerHTML = `
          <h1>${data.Title}</h1>
          <p><strong>IMDb Rating:</strong> ${data.imdbRating}</p>
          <p><strong>Year:</strong> ${data.Year}</p>
          <p><strong>Genre:</strong> ${data.Genre}</p>
          <p><strong>Director:</strong> ${data.Director}</p>
          <p><strong>Plot:</strong> ${data.Plot}</p>
          <img src="${data.Poster}" alt="${data.Title} Poster">
        `;

        // Call function to fetch tagline data
        fetchTaglines(imdbId);
      } else {
        document.getElementById('movie-details').innerText = 'Movie not found.';
      }
    })
    .catch(error => {
      console.error('Error fetching movie data:', error);
      document.getElementById('movie-details').innerText = 'Error fetching movie details.';
    });
}

// Function to fetch movie taglines from RapidAPI
function fetchTaglines(imdbId) {
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      const taglinesData = JSON.parse(this.responseText);
      const taglines = taglinesData && taglinesData.length > 0 ? taglinesData.join(', ') : 'No taglines available';
      document.getElementById('movie-details').innerHTML += `
        <p><strong>Taglines:</strong> ${taglines}</p>
      `;
    }
  });

  xhr.open('GET', `https://imdb-com.p.rapidapi.com/title/get-taglines?tconst=${imdbId}`);
  xhr.setRequestHeader('x-rapidapi-key', '581bf2f4f7msh819617d35ceb031p14396fjsn045286a06324'); // Replace with your RapidAPI key
  xhr.setRequestHeader('x-rapidapi-host', 'imdb-com.p.rapidapi.com');

  xhr.send(null);
}

// Call fetchMovieDetails if a valid IMDb ID is provided
if (movieId) {
  fetchMovieDetails(movieId);
} else {
  document.getElementById('movie-details').innerText = 'Invalid movie ID.';
}