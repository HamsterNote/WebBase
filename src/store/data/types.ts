import { Page, Text } from '../../components/reader/types';
import { Number2 } from '../../types/Math';

export interface NoteItem {
	id: string;
	cards: CardItem[];
	relationDocument: string;
}

export enum CardType {
	// 脑图
	MIND_MAP = 'mindMap',
	// 框架
	FRAME = 'frame',
}

export interface CardItem {
	title: string;
	content: string;
	isOCR: boolean;
	image: string;
	selections: Selection[];
	children: CardItem[];
	id: string;
	relationDocument?: string;
	position?: Number2;
	type: CardType;
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

export interface Selection {
	pages: Page[];
	texts: Text[];
}
