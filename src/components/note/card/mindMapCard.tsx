import React from 'react';
import { CardItem } from '../../../store/data/types';
import { Card } from 'antd';

interface Props {
	card: CardItem;
	className: string;
	onDragStart: (evt: React.DragEvent<HTMLDivElement>) => void;
}

export const MindMapCard: React.FC<Props> = (props: Props) => {
	const position = props.card.position ? { top: `${props.card.position.y}px`, left: `${props.card.position.x}px` } : undefined;
	return <div className={`hamster-note-card-container ${props.className}`} style={position}>
		<Card className={`hamster-note-card`} size="small" title={props.card.title} style={{ width: 300, }} onMouseDown={props.onDragStart}>
			{props.card.content}
		</Card>
	</div>;
};
