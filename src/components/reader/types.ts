import { CSSProperties } from 'react';

export interface Document {
	id: string;
	pages: Page[];
}

export interface Page {
	id: string;
	height: number;
	width: number;
	texts: Text[];
	style?: CSSProperties;
}

export interface Text {
	id: string;
	content: string;
	hasReturn: boolean;
	position: {
		x: number;
		y: number;
	};
	style?: CSSProperties;
}
