import { dom } from '@/index';

dom.gBEI('#addClass').addEventListener('click', function () {
  dom.addClass(dom.gBEI('#p'), 'addClass1 addClass2');
});