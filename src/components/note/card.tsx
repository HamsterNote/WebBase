import React from 'react';
import { CardItem } from '../../store/data/types';

interface Props {
	card: CardItem;
}

export const NoteCard: React.FC<Props> = (props: Props) => {
	return <div>
		{props.card.content}
	</div>;
};
