'use strict';

import { api_key, imageBaseURL, fetchDataFromServer } from './api.js';
import { sidebar } from "./sidebar.js";
import {  storeMovieId } from "./global.js";
import { createMovieCard } from './movie-card.js';

document.addEventListener("DOMContentLoaded", () => {
  sidebar(); // Initialize sidebar
});

const pageContent = document.querySelector(".heroSection");



const getGenres = function (genreList) {
  return genreList.map(genre => genre.name).join(", ");
};

const getCasts = function (castList) {
  return castList.map(cast => cast.name).slice(0, 10).join(", ");
};

const getDirectors = function (crewList) {
  const directors = crewList.filter(crew => crew.job === "Director");
  return directors.map(director => director.name).join(", ");
};

const filterVideos = function (videoList) {
  return videoList.filter(video => (video.type === "Trailer" || video.type === "Teaser") && video.site === "YouTube");
};

// Fetch and display details for a specific movie
const fetchMovieDetails = async (movieId) => {
  try {
    const movie = await fetchDataFromServer(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=videos,credits,recommendations`);

    const {
      backdrop_path,
      poster_path,
      title,
      release_date,
      runtime,
      vote_average,
      genres,
      overview,
      credits: { cast, crew },
      videos: { results: videos },
      recommendations: { results: recommendations }
    } = movie;

    document.title = `${title} - Tvflix`;

    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");

    movieDetail.innerHTML = `
      <div class="backdrop-image" style="background-image: url('${imageBaseURL}w1280${backdrop_path || poster_path}')"></div>

      <figure class="poster-box movie-poster">
          <img src="${imageBaseURL}w780${poster_path}" alt="${title} poster" class="img-cover">
      </figure>

      <div class="detail-box">
          <div class="detail-content">
              <h1 class="heading" style="color: white;">${title}</h1>
              <div class="meta-list">
                  <div class="meta-item">
                      <img src="../assets/Star.png" width="20" height="20" alt="rating">
                      <span class="span">${vote_average.toFixed(1)}</span>
                      <div class="separator"></div>
                      <div class="meta-item time">Duration: ${runtime}mins</div>
                      <div class="separator"></div>
                      <div class="meta-item year">${release_date.split("-")[0]}</div>
                      <!-- Certification or other relevant data -->
                  </div>
              </div>
              <p class="genre">${getGenres(genres)}</p>
              <p class="overview">${overview}</p>
              <ul class="detail-list">
                  <div class="list-item" style="margin-bottom: 10px;">
                      <p class="list-name">Starring</p>
                      <p>${getCasts(cast)}</p>
                  </div>
                  <div class="list-item" style="margin-bottom: 10px;">
                      <p class="list-name" >Directed By</p>
                      <p>${getDirectors(crew)}</p>
                  </div>
              </ul>
          </div>
          <div class="title-wrapper">
              <h3 class="title-large">Trailers and Clips</h3>
          </div>
          <div class="slider-list ">
              <div class="slider-inner"></div>
          </div>
      </div>
    `;

    for (const { key, name } of filterVideos(videos)) {
      const videoCard = document.createElement("div");
      videoCard.classList.add("video-card");
      videoCard.innerHTML = `
        <iframe width="500" height="294" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0" 
         frameborder="0" allowfullscreen="1" title="${name}" class="img-cover" loading="lazy"></iframe>
      `;
      movieDetail.querySelector(".slider-inner").appendChild(videoCard);
    }

    pageContent.appendChild(movieDetail);

    addSuggestedMovies(recommendations, "You May Also Like");

  } catch (error) {
    console.error('Error fetching movie details:', error);
  }
};

// Function to create recommended movies list section
const addSuggestedMovies = function (movieList, title) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list-section");
  movieListElem.setAttribute("aria-label", title);

  movieListElem.innerHTML = `
    <h2 class="title">${title}</h2>
    <div class="movie-list-container">
      <button class="slide-left">&lt;</button>
      <div class="movie-list">
        <!-- Movies will be inserted here -->
      </div>
      <button class="slide-right">&gt;</button>
    </div>
  `;

  for (const movie of movieList) {
    const card = createMovieCard(movie);
    movieListElem.querySelector(".movie-list").appendChild(card);
  }

  pageContent.appendChild(movieListElem);
};

// Example movieId (you need to assign the actual movieId dynamically)
const movieId = localStorage.getItem('selectedMovieId');  // Replace with actual movieId

fetchMovieDetails(movieId);


