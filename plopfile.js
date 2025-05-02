import componentModule from './generators/component/index.js';
import fetchJsonModule from './generators/fetch-json/index.js';

export default function (plop) {
  fetchJsonModule(plop);
  componentModule(plop);
}