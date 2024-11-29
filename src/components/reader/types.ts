import { CSSProperties } from 'react';

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
	position: {
		x: number;
		y: number;
	};
	style?: CSSProperties;
}
