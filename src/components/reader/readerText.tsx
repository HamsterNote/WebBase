import React from 'react';
import './index.scss';
import { Text } from './types';

interface Props {
	text: Text;
}

const ReaderText: React.FC<Props> = (props: Props) => {
	return <div className="hamster-note-reader-text" style={props.text.style}>
		{props.text.content}
	</div>;
};

export default ReaderText;
