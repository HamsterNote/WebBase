import React, { useEffect } from 'react';
import { NoteItem } from '../../store/data/types';
import './index.scss';
import { DEFAULT_NOTE_HEIGHT, DEFAULT_NOTE_WIDTH } from '../consts/noteConsts';
import { NoteCard } from './card';

interface Props {
	note: NoteItem;
}

export const Note: React.FC<Props> = (props: Props) => {
	const noteRef = React.useRef<HTMLDivElement>(null);
	useEffect(() => {
		noteRef.current?.scrollTo(DEFAULT_NOTE_WIDTH / 2, DEFAULT_NOTE_HEIGHT / 2);
	}, []);
	return <div className="hamster-note-note" ref={noteRef}>
		<div className="hamster-note-note-container" style={{ width: `${DEFAULT_NOTE_WIDTH}px`, height: `${DEFAULT_NOTE_HEIGHT}px` }}>
			{props.note.cards.map(card => <NoteCard card={card} key={card.id} />)}
		</div>
	</div>;
};
