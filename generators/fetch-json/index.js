import fetchJsonAction from './fetchJsonAction.js';
import fetchJsonGenerator from './fetchJsonGenerator.js';

export default function (plop) {
  plop.setActionType('fetch-json', fetchJsonAction);
  plop.setGenerator('save-json', fetchJsonGenerator(plop));
}
