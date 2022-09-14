import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkup } from './createMarkup';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.js-gallery');
const btnLoad = document.querySelector('.js-btn-load');
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
const axiosParams = instance.defaults.params;

btnLoad.hidden = true;

searchForm.addEventListener('submit', onSearchQuery);
btnLoad.addEventListener('click', onMoreImages);

async function onSearchQuery(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  console.dir(axiosParams);
  const query = e.target.elements.searchQuery.value.trim();
  if (!query) {
    Notify.info('Please, enter key word for search!');
    return;
  }
  return await instance
    .request({ params: { q: query, page: 1 } })
    .then(response => {
      const { hits, totalHits } = response.data;
      btnLoad.hidden = true;
      if (!hits.length) {
        throw new Error();
      }
      if (hits.length === axiosParams.per_page) {
        btnLoad.hidden = false;
      }
      gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
      Notify.success(`Hooray! We found ${totalHits} images.`);
      new SimpleLightbox('.gallery a');
    })
    .catch(error =>
      Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      )
    );
}

async function onMoreImages(e) {
  return await instance
    .request({
      params: {
        page: (axiosParams.page += 1),
        q: searchForm.elements.searchQuery.value.trim(),
      },
    })
    .then(response => {
      gallery.insertAdjacentHTML('beforeend', createMarkup(response.data.hits));
      new SimpleLightbox('.gallery a');
      console.log(axiosParams.per_page * axiosParams.page);
      if (response.data.totalHits <= axiosParams.per_page * axiosParams.page) {
        btnLoad.hidden = true;
        throw new Error();
      }
    })
    .catch(error =>
      Notify.info("We're sorry, but you've reached the end of search results.")
    );
}
