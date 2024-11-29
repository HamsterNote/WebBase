import React, { useState } from 'react';
import './index.css';
import { Page } from './types';
import ReaderPage from './readerPage';

interface Props {
	pages: Page[];
}

const Reader: React.FC<Props> = (props: Props) => {
	return <div className="hamster-note-reader">
		{props.pages.map(page => <ReaderPage page={page}/>)}
	</div>;
};

export default Reader;
