export interface Page {
	height: number;
	width: number;
	texts: Text[];
}

export interface Text {
	content: string;
	fontSize: number | string;
	position: {
		x: number;
		y: number;
	};
	rotation: number;
}
