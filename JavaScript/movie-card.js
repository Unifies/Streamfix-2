'use strict';

import { imageBaseURL } from "./api.js";



/**
 * Movie card / Card
 */


export function createMovieCard(movie, runtime) {

  const {
    poster_path,
    title,
    vote_average,
    release_date,
    id
  } = movie;

  const cardMovie = document.createElement("div");
  cardMovie.classList.add("card");

   // Function to store movie ID in localStorage
   const storeMovieId = (id) => {
    localStorage.setItem('selectedMovieId', id);
  };

  cardMovie.innerHTML = `
  
  <a href="./detail.html"><img class="card-image" src="${imageBaseURL}w342${poster_path}" alt="${title}" loading="lazy"></a>
                    <div class="card-info">
                        <div class="movie-info">
                            <a href="./detail.html" onclick="storeMovieId(${id})"><p>${title}</p></a>
                            <span>${release_date.split("-")[0]}</span>
                        </div>
                        <div class="movie-info">
                            <img src="../assets/HD tag.png" alt="HD resolution">
                            <div class="time-ratings">
                                <div class="time">
                                    <img src="../assets/clock-icon.png" alt="movie length">
                                    <span>120 min</span>
                                </div>
                                <div class="time">
                                    <img src="../assets/Star.png" alt="movie length">
                                    <span>${vote_average.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
  `;

  cardMovie.addEventListener('click', () => {
    storeMovieId(id);
  });


  return cardMovie;

}