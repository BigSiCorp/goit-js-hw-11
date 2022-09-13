import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkup } from './createMarkup';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.js-gallery');
const btnLoad = document.querySelector('.js-btn-load');
btnLoad.hidden = true;

const instance = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: '29900757-a95284a7c551857b6b1f8b41e',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: 1,
    per_page: 40,
  },
});

searchForm.addEventListener('submit', onSearchQuery);

async function onSearchQuery(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  const query = e.target.elements.searchQuery.value.trim();
  if (!query) {
    Notify.info('Please, enter key word for search!');
    return;
  }
  await instance
    .request({ params: { q: query } })
    .then(response => {
      if (!response.data.hits.length) {
        throw new Error();
      }
      gallery.insertAdjacentHTML('beforeend', createMarkup(response.data.hits));
      btnLoad.hidden = false;
    })
    .catch(error =>
      Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      )
    );
}
