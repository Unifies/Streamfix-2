'use strict';

const api_key = '7e1a313fd93c16e937bd6e695fb3c17a';
const imageBaseURL = 'https://image.tmdb.org/t/p/';

/**
 * Fetch data from a server using the provided URL.
 * Returns a Promise that resolves with the JSON data.
 */
const fetchDataFromServer = function (url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error to propagate it
    });
};

export { imageBaseURL, api_key, fetchDataFromServer };