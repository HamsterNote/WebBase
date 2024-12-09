import { Page, Text } from '../../components/reader/types';
import { Number2 } from '../../types/Math';

export interface NoteData {
	id: string;
	cardIds: string[];
	relationDocument: string;
}

export enum CardType {
	// 脑图
	MIND_MAP = 'mindMap',
	// 框架
	FRAME = 'frame',
}

export interface CardData {
	title: string;
	content: string;
	isOCR: boolean;
	image: string;
	selections: Selection[];
	childrenIds: string[];
	id: string;
	relationDocument?: string;
	position?: Number2;
	type: CardType;
	noteId: string;
}

export enum RelationType {
	LINK = 'link',
	MIND_MAP = 'mind-map',
	SUMMARY = 'summary',
}

// 从这个Card的哪个方向连接
export enum RelationLocation {
	NONE = 'none',
	CENTER = 'center',
	LEFT = 'left',
	RIGHT = 'right',
	TOP = 'top',
	BOTTOM = 'bottom',
}

export interface RelationItem {
	location: RelationLocation;
}

export interface Relation {
	type: RelationType;
	items: RelationItem[];
}

export interface SelectionRect {}

export interface Selection {
	pages: Page[];
	texts: Text[];
	rect: SelectionRect[];
}
