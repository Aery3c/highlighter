// @flow
import TextSearch from './TextSearch';

const textSearch = new TextSearch();

const el = document.querySelector('#search');
el?.addEventListener('keyup', debounce(() => {
  // $FlowIgnore
  console.log(el.value);
}, 1000));


function debounce (func: Function, wait?: number = 100) {
  let timestamp, args, timeout, context;
  function later () {
    const last = Date.now() - timestamp;
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      func.apply(context, args);
      context = args = null;
    }

  }
  // $FlowIgnore
  return function () {
    context = this;
    args = arguments;
    timestamp = Date.now();
    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
  }
}