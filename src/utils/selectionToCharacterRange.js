// @flow
import CharacterRange from './characterRange';
import rangeUtils from '../range-utils';
import { rangeToCharacterRange } from './rangeToCharacterRange';

export function selectionToCharacterRange (sel: Selection, referenceNode: Node): CharacterRange[] {
	const characterRanges: CharacterRange[] = [];
	rangeUtils.getRangesInSelection(sel).forEach(range => {
		characterRanges.push(rangeToCharacterRange(range, referenceNode));
	});

	return characterRanges;
}