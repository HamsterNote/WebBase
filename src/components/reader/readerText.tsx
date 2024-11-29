import React, { useState } from 'react';
import './index.css';
import { RelationText } from '../../store/data/types';

interface Props {
	text: RelationText;
}

const ReaderText: React.FC<Props> = (props: Props) => {
	return <div className="hamster-note-reader-text" style={props.text.style}>
		{props.text.content}
	</div>;
};

export default ReaderText;
