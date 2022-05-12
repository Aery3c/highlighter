/**
 * 去掉字符串首尾空白
 * @param {string} value
 * @returns {string}
 */
import rnothtmlwhite from '@/utils/rnothtmlwhite';

function stripAndCollapse( value ) {
  const tokens = value.match(rnothtmlwhite) || [];
  return tokens.join(' ');
}

export default stripAndCollapse;