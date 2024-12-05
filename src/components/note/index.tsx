import React, { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { NoteItem } from '../../store/data/note';
import './index.scss';
import { NoteCard } from './card';
import { Number2 } from '../../types/Math';

interface Props {
	note: NoteItem;
}

const MIN_SCALE = 0.3;
const MAX_SCALE = 3;

export const Note: React.FC<Props> = (props: Props) => {
	const noteRef = React.useRef<HTMLDivElement>(null);
	const containerRef = React.useRef<HTMLDivElement>(null);
	const [transform, setTransform] = useState<Number2>({ x: 0, y: 0 });
	const [scale, setScale] = useState<number>(1);
	const onWheel = useCallback((evt: React.WheelEvent) => {
		// const mousePosition: Number2 = { x: evt.pageX, y: evt.pageY };
		// const containerRect = containerRef.current?.getBoundingClientRect();
		// const containerCenter: Number2 = containerRect ? { x: containerRect.left + containerRect.width / 2, y: containerRect.top + containerRect.height / 2 } : { x: evt.pageX, y: evt.pageY };
		evt.stopPropagation();
		const deltaY = evt.deltaY;
		if (evt.ctrlKey) {
			const delta = evt.deltaY;
			// 以mousePosition为中心缩放
			const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE,scale - delta * 0.05));
			setScale(newScale);
		} else {
			const deltaX = evt.deltaX;
			setTransform({ x: transform.x - deltaX, y: transform.y - deltaY });
		}
	}, [transform, scale]);
	useEffect(() => {
		// 禁止被动事件
		noteRef.current?.addEventListener('wheel', (evt) => {
			evt.preventDefault();
		}, { passive: false });
	}, []);
	return <div className="hamster-note-note" ref={noteRef} onWheel={onWheel}>
		<div className="hamster-note-note-container" ref={containerRef} style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${scale})` }}>
			{props.note.cards.map(card => <NoteCard card={card} key={card.id} />)}
		</div>
	</div>;
};
