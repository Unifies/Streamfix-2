'use strict';


/**
 * Add event on multiple elements
 */


const addEventOnElements = function (elements, eventType, callback) {
  for (const elem of elements) elem.addEventListener(eventType, callback);
}

/**
 * Toggle search-box in mobile devices || small screen
 */


const searchBox = document.querySelector("[search-box]");
const searchTogglers = document.querySelectorAll("[search-toggler]");


addEventOnElements(searchTogglers, "click", function () {
  searchBox.classList.toggle("active");
});


// store movieId in local storage


/*const getMovieDetail = function(movieId) {
  window.localStorage.setItem("movieId", String(movieId)); 
} */

 export  function storeMovieId(id) {
    localStorage.setItem('selectedMovieId', id);
  }

