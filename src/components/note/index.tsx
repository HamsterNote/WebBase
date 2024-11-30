import React from 'react';
import { NoteItem } from '../../store/data/types';
import { NoteCard } from './card';

interface Props {
	note: NoteItem;
}

export const Note: React.FC<Props> = (props: Props) => {
	return <div>
		{props.note.cards.map(card => <NoteCard card={card} key={card.id} />)}
	</div>;
};
