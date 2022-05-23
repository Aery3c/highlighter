import { createMerge } from '@/index';

import createContextMenu from '../common/contextMenu';
import '../common/contextMenu/styles.scss';
const merge = createMerge();

createContextMenu(null, [{
  name: 'test'
}]);
