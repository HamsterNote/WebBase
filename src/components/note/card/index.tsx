import React, { useState } from 'react';
import { CardData, CardType } from '../../../store/data/types';
import { MindMapCard } from './mindMapCard';
import { FrameCard } from './frameCard';
import { Number2 } from '../../../types/Math';
import { noteDataStore, setCardPosition } from '../../../store/data/note';

interface Props {
	card: CardData;
}

export const NoteCard: React.FC<Props> = (props: Props) => {
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [draggingPosition, setDraggingPosition] = useState<Number2 | undefined>();
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
			setDraggingPosition(result);
		}
		const onMouseUp = (evt: MouseEvent) => {
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
			setIsDragging(false);
			setDraggingPosition(undefined);
			noteDataStore.dispatch(setCardPosition({
				id: props.card.id,
				position: draggingPosition || startPosition,
			}));
		}
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
	}
	switch(props.card.type) {
		case CardType.MIND_MAP: return <MindMapCard draggingPosition={draggingPosition} card={props.card} className={isDragging ? 'dragging' : ''} onDragStart={onDragStart} />;
		case CardType.FRAME: return <FrameCard card={props.card} />;
	}
}
