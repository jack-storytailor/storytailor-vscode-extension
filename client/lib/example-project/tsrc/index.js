import * as story from '../story/index.sts';
import * as __env from './environment';

let contentContainer = document.getElementById('content');
let storyContent = __env.getSerializer().serialize(story, '\n');
let htmlStoryContent = `${storyContent.split('\n').map((str) => `<div> ${str} &nbsp;</div>`).join('')}`;

if (contentContainer) {
  contentContainer.innerHTML = htmlStoryContent
}

console.log('story is ', story);
