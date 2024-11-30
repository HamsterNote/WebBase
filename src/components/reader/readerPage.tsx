import React, { useState } from 'react';
import './index.scss';
import ReaderText from './readerText';
import { Page } from './types';

interface Props {
	page: Page;
}

/* 阅读器分页 */
const ReaderPage: React.FC<Props> = (props: Props) => {
	const onSelect = (evt: React.ChangeEvent<HTMLDivElement>) => {
		console.log(evt);
	}
	// paddingBottom为了让页面等比宽高
	return <div className="hamster-note-reader-page" onSelect={onSelect} style={{ paddingBottom: `${props.page.width / props.page.height * 100}%`, ...props.page.style }}>
		{props.page.texts.map(text => {
			return <ReaderText text={text} key={text.id} />;
		})}
	</div>;
};

export default ReaderPage;
