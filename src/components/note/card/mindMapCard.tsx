import React, { CSSProperties } from 'react';
import { CardData } from '../../../store/data/types';
import { Card } from 'antd';
import { Number2 } from '../../../types/Math';

interface Props {
	card: CardData;
	className: string;
	onDragStart: (evt: React.DragEvent<HTMLDivElement>) => void;
	draggingPosition: Number2 | undefined;
}

export const MindMapCard: React.FC<Props> = (props: Props) => {
	let position: CSSProperties | undefined = undefined;
	if (props.draggingPosition) {
		position = { top: `${props.draggingPosition.y}px`, left: `${props.draggingPosition.x}px` };
	} else if (props.card.position) {
		position = { top: `${props.card.position.y}px`, left: `${props.card.position.x}px` };
	}
	return <div className={`hamster-note-card-container ${props.className}`} style={position}>
		<Card className={`hamster-note-card`} size="small" title={props.card.title} style={{ width: 300, }} onMouseDown={props.onDragStart}>
			{props.card.content}
		</Card>
	</div>;
};
