import * as story from '../story/index.sts';
import * as __env from './environment';

let contentContainer = document.getElementById('content');
let storyContent = __env.getSerializer().serialize(story, '\r\n');
let htmlStoryContent = `${storyContent.split('\r\n').map((str) => {

  if (!str || str === '') {
    str = '&nbsp;'
  }
  return `<div class="content-line">${str}</div>`;
}).join('')}`;

if (contentContainer) {
  contentContainer.innerHTML = htmlStoryContent
}
