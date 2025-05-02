

import componentGenerator from './componentGenerator.js';

export default function (plop) {
  plop.setGenerator('component', componentGenerator(plop));
}