'use strict'

import { dom } from '@/index';
import { ADD_ANNOTATION } from '../event/event';
import './annotations.scss';
import { highlighterPink } from '../pen';

const container = dom.gE('.book_annotations');
container.addEventListener(ADD_ANNOTATION, (e) => {
  const { detail: highlight } = e;
  const [elc, edit] = createCard(highlight);
  const els = document.querySelectorAll('.book_annotations_card');

  let isFlag = false;
  for (let i = 0, el; i < els.length; ++i) {
    el = els.item(i);
    if (highlight.characterRange.start < +el.dataset.characterRange) {
      isFlag = true;
      container.insertBefore(elc, el);
      break;
    }
  }
  if (!isFlag) {
    container.appendChild(elc);
  }

  const range = document.createRange();
  range.selectNodeContents(edit);
  range.collapse(true);
  const s = window.getSelection();
  s.removeAllRanges();
  s.addRange(range);

});

function createCard (curht) {

  const el = document.createElement('div');
  el.dataset.characterRange = curht.characterRange.start.toString();
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

    els.forEach(el => {
      const nextEl = el.nextSibling;
      if (nextEl) {
        const nextElTop = +nextEl.style.top.replace('px', '');
        const elTop = +el.style.top.replace('px', '');
        if (elTop + el.offsetHeight > nextElTop) {
          nextEl.style.top = elTop + el.offsetHeight + 'px';
        }
      }
    });

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
  ['', '', 'remove'].forEach(item => {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    if (item === 'remove') {
      li.addEventListener('click', function() {
        highlighterPink.removeHighlights([curht]);
        dom.removeNode(el);
        const canvas = dom.gE('#canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      });
    }
    actions.appendChild(li);
  });

  el.appendChild(cardBody);
  el.appendChild(actions);

  return [el, description];
}
