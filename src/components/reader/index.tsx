import React from 'react';
import './index.scss';
import { Document } from './types';
import ReaderPage from './readerPage';
import { addCard, noteDataStore, addNote, setCurrentNote } from '../../store/data/note';
import { DEFAULT_NOTE_HEIGHT, DEFAULT_NOTE_WIDTH } from '../consts/noteConsts';

interface Props {
	document: Document;
}

noteDataStore.dispatch(addNote({
	relationDocument: '',
}));

noteDataStore.dispatch(setCurrentNote(noteDataStore.getState().note.notesData[0]?.id));

/* 阅读器，接收公用数据格式，渲染*/
const Reader: React.FC<Props> = (props: Props) => {
	const onSelect = () => {
		console.log(window.getSelection());
		const selection = window.getSelection();
		const selectionContent = selection?.getRangeAt(0).cloneContents()?.textContent || '';
		console.log(selectionContent);
		if (selectionContent) {
			noteDataStore.dispatch(addCard({
				title: '',
				content: selectionContent,
				isOCR: false,
				image: '',
				selections: [],
				position: {
					x: DEFAULT_NOTE_WIDTH / 2,
					y: DEFAULT_NOTE_HEIGHT / 2,
				},
				noteId: noteDataStore.getState().note.notesData[0]?.id || '',
			}));
		}
	};
	// useEffect(() => {
	// 	const originSelectionChangeFunction = document.onselectionchange;
	// 	document.onselectionchange = onSelect;
	// 	return () => {
	// 		document.onselectionchange = originSelectionChangeFunction;
	// 	}
	// }, []);
	return <div className="hamster-note-reader" onMouseUp={onSelect}>
		{props.document.pages.map(page => <ReaderPage key={page.id} page={page}/>)}
	</div>;
};

export default Reader;
