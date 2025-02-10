'use strict';

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";

const pageContent = document.querySelector(".heroSection");

// Initialize sidebar
sidebar();

// Home page Sections
const homePageSections = [
  {
    title: "Upcoming Movies",
    path: "/movie/upcoming"
  },
  {
    title: "Top Rated Movies",
    path: "/movie/top_rated"
  }
];

// Check if pageContent exists before proceeding
if (pageContent) {
  // Function to create banner section for popular movies
  const createBanner = function (movieList) {
    const banner = document.createElement("section");
    banner.classList.add("banner");
    banner.setAttribute("aria-label", "Popular Movies");

    const heroImagesContainer = document.createElement('div');
    heroImagesContainer.classList.add('heroImagesContainer');

    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('controlsContainer');

    // Loop through each movie in the list
    movieList.forEach((movie, index) => {
      const { id, backdrop_path, poster_path, title } = movie;

      // Create control item (movie poster) and add click event listener
      const controlItem = document.createElement('button');
      controlItem.classList.add('poster-box');
      controlItem.setAttribute("data-index", index);
      controlItem.innerHTML = `
        <img src="${imageBaseURL}w154${poster_path}" alt="Slide to ${title}" loading="lazy" draggable="false" class="img-cover">
      `;
      controlItem.addEventListener('click', async () => {
        try {
          const movieDetails = await fetchDataFromServer(`https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}`);
          const { runtime } = movieDetails;

          // Update hero image and display runtime
          updateHeroImage(backdrop_path, title, runtime);
          storeMovieId(id); // Store movie ID in localStorage
        } catch (error) {
          console.error('Error fetching movie details:', error);
        }
      });
      controlsContainer.appendChild(controlItem);
    });

    banner.appendChild(heroImagesContainer);
    banner.appendChild(controlsContainer);

    pageContent.appendChild(banner);

    // Function to update hero image and display runtime
    const updateHeroImage = (backdrop_path, title, runtime) => {
      heroImagesContainer.innerHTML = `
         <div class="heroText">
          <h1>STREAMFIX</h1>
          <p>Unlimited Entertainment: <span>Movies, TV Shows & More</span></p>
          <a href="./detail.html"><button><img src="./assets/play icon.png" alt="">PLAY NOW</button></a> 
        </div>
        <img src="${imageBaseURL}w1280${backdrop_path}" alt="${title}">
        <p>Runtime: ${runtime} minutes</p>
      

      `;
    };

    // Function to store movie ID in localStorage
    const storeMovieId = (id) => {
      localStorage.setItem('selectedMovieId', id);
    };

    // Add sliding functionality for controlsContainer
    controlsContainer.style.display = 'flex';
    controlsContainer.style.overflowX = 'auto';
    controlsContainer.style.scrollBehavior = 'smooth';
  };

  // Fetch popular movies and display hero banner
  fetchDataFromServer(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`)
    .then(data => {
      if (data.results) {
        createBanner(data.results);
      } else {
        console.error('No movie results found.');
      }
    })
    .catch(error => {
      console.error('Error fetching popular movies:', error);
    });

  // Function to create movie list section
  const createMovieList = function (movieList, title) {
    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list-section");
    movieListElem.setAttribute("aria-label", `${title}`);

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

    const movieListDiv = movieListElem.querySelector('.movie-list');
    for (const movie of movieList) {
      const card = createMovieCard(movie);
      movieListDiv.appendChild(card);

      // Add click event to store movie ID
      card.addEventListener("click", () => {
        storeMovieId(movie.id);
      });
    }

    pageContent.appendChild(movieListElem);

    // Add sliding functionality with smooth easing
    const slideLeftButton = movieListElem.querySelector('.slide-left');
    const slideRightButton = movieListElem.querySelector('.slide-right');

    slideLeftButton.addEventListener('click', () => {
      movieListDiv.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    });

    slideRightButton.addEventListener('click', () => {
      movieListDiv.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    });
  };

  // Fetch data for upcoming and top rated movies sections
  const fetchAndCreateMovieList = async (path, title) => {
    try {
      const data = await fetchDataFromServer(`https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`);
      if (data.results) {
        createMovieList(data.results, title);
      } else {
        console.error(`No movie results found for ${title}.`);
      }
    } catch (error) {
      console.error(`Error fetching ${title} movies:`, error);
    }
  };

  // Fetch upcoming and top rated movies
  fetchAndCreateMovieList(homePageSections[0].path, homePageSections[0].title);
  fetchAndCreateMovieList(homePageSections[1].path, homePageSections[1].title);

} else {
  console.error('Element with class "heroSection" not found.');
}