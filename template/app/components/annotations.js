'use strict'

import { dom } from '@/index';
import { ADD_ANNOTATION } from '../event/event';
import './annotations.scss';
import { highlighterPink } from '../pen';

const container = dom.gE('.book_annotations');
container.addEventListener(ADD_ANNOTATION, (e) => {
  const { detail: highlight } = e;
  const [el, edit] = createCard(highlight);
  container.appendChild(el);
  const range = document.createRange();
  range.selectNodeContents(edit);
  range.collapse(true);
  const s = window.getSelection();
  s.removeAllRanges();
  s.addRange(range);

});

function createCard (curht) {

  const el = document.createElement('div');

  el.addEventListener('mouseover', () => {
    const range = document.createRange();
    range.selectNodeContents(description);
    range.collapse();
    const s = window.getSelection();
    s.removeAllRanges();
    s.addRange(range);
  });

  el.addEventListener('mouseout', () => {
    const s = window.getSelection();
    s.removeAllRanges();
  });

  dom.addClass(el, 'book_annotations_card');
  const cardBody = document.createElement('div');
  dom.addClass(cardBody, 'book_annotations_card_body');

  const meta = document.createElement('div');
  dom.addClass(meta, 'book_annotations_card_meta');

  meta.innerHTML = `
    <div class="book_annotations_card_meta_avatar">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-highlightSelection"></use>
      </svg>
    </div>
  `;

  const detail = document.createElement('div');
  dom.addClass(detail, 'book_annotations_card_meta_detail');

  const title = document.createElement('div');
  dom.addClass(title, 'book_annotations_card_meta_title');
  title.appendChild(document.createTextNode('Aery'));

  const description = document.createElement('div');
  dom.addClass(description, 'book_annotations_card_meta_description');
  description.setAttribute('contenteditable', 'true');

  description.addEventListener('focus', () => {
    highlighterPink.addHighlight(curht);
    dom.toggleClass(el, 'book_annotations_card_active');
    const rangeRect = curht.characterRange.toRange().getBoundingClientRect();
    const containerRect = dom.gE('.book_container_content').getBoundingClientRect();
    el.style.top = `${rangeRect.y + window.pageYOffset - (el.offsetHeight / 2)}px`;
    // 计算现在的位置, 上下必须隔离一个卡片的高度
    const els = document.querySelectorAll('.book_annotations_card');
    const tops = [];
    els.forEach(el => {
      tops.push(el.style.top);
    });
    console.log(tops);
    const elRect = el.getBoundingClientRect();
    const canvas = dom.gE('#canvas');
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.moveTo(rangeRect.x, rangeRect.y + window.pageYOffset);
      ctx.lineTo(containerRect.right, rangeRect.y + window.pageYOffset);
      ctx.lineTo(elRect.x, elRect.y + window.pageYOffset);
      ctx.stroke();
      ctx.closePath();
    }
  });

  description.addEventListener('blur', () => {
    dom.toggleClass(el, 'book_annotations_card_active')
    highlighterPink.removeHighlights([curht]);
    const canvas = dom.gE('#canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  detail.appendChild(title);
  detail.appendChild(description)

  meta.appendChild(detail);
  cardBody.appendChild(meta);

  const actions = document.createElement('ul');
  dom.addClass(actions, 'book_annotations_card_actions');
  ['action1', 'action2', 'remove'].forEach(item => {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    if (item === 'remove') {
      li.addEventListener('click', function() {
        console.log('remove');
      });
    }
    actions.appendChild(li);
  });

  el.appendChild(cardBody);
  el.appendChild(actions);

  return [el, description];
}
