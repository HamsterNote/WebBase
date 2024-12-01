import React, { useState } from 'react';
import { CardItem } from '../../store/data/types';
import { Card } from 'antd';
import { Number2 } from '../../types/Math';
import { moveCard, store } from '../../store/data/note';

interface Props {
	card: CardItem;
}

export const NoteCard: React.FC<Props> = (props: Props) => {
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const position = props.card.position ? { top: `${props.card.position.y}px`, left: `${props.card.position.x}px` } : undefined;
	const onDragStart = (evt: React.DragEvent<HTMLDivElement>) => {
		setIsDragging(true);
		const startDragPosition: Number2 = {
			x: evt.pageX,
			y: evt.pageY,
		};
		const startPosition: Number2 = props.card.position ? {
			x: props.card.position.x,
			y: props.card.position.y,
		} : {
			// 这个还有问题，要减去滚动位置
			x: evt.pageX,
			y: evt.pageY,
		};
		const onMouseMove = (evt: MouseEvent) => {
			const diffPosition: Number2 = {
				x: evt.pageX - startDragPosition.x,
				y: evt.pageY - startDragPosition.y,
			}
			const result: Number2 = {
				x: startPosition.x + diffPosition.x,
				y: startPosition.y + diffPosition.y,
			}
			store.dispatch(moveCard({
				id: props.card.id,
				position: result,
			}));
		}
		const onMouseUp = (evt: MouseEvent) => {
			console.log(evt);
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
			setIsDragging(false);
		}
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
	}
	return <Card className={`hamster-note-card ${isDragging ? 'dragging' : ''}`} size="small" title={props.card.title} style={{ width: 300, ...position }} onMouseDown={onDragStart}>
		{props.card.content}
	</Card>;
};
