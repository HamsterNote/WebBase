import { Layout, theme } from 'antd';
import React, { useState, useEffect } from 'react';
import { ReadPageHeader } from './header';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import Reader from '../../components/reader';
import { Note } from '../../components/note';
import { NoteData } from '../../store/data/types';
import { store } from '../../store/data/note';

GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url,
).toString();

const { Content } = Layout;

export const ReadPage: React.FC = () => {
	const [currentNote, setCurrentNote] = useState<NoteData | undefined>();
	useEffect(() => {
		const notes = store.getState().note.notes;
		const currentId = store.getState().note.currentNote;
		setCurrentNote(notes.find(note => note.id === currentId));
		const unsubscribe = store.subscribe(() => {
			const _notes = store.getState().note.notes;
			setCurrentNote(_notes.find(note => note.id === currentId));
		});
		return () => unsubscribe();
	}, []);
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();
	const fileToArrayBuffer = (file: File): Promise<string | ArrayBuffer | undefined | null> => {
		return new Promise((resolve) => {
			let reader = new FileReader()
			reader.onload = function(result) {
				resolve(result.target?.result)
			}
			reader.readAsArrayBuffer(file)
		})
	}
	const onUpload = async (evt: React.ChangeEvent<HTMLInputElement>) => {
		console.log(evt);
		const file = await fileToArrayBuffer(evt.target.files![0]);
		if (file) {
			getDocument(file).promise.then(pdf => {
				console.log(pdf);
				pdf.getPage(1).then(page => {
					page.getTextContent().then(text => console.log(text));
				})
			})
		}
	};
	return <Layout>
		<ReadPageHeader />
		<Content
			style={{
				// margin: '24px 16px',
				// padding: 24,
				minHeight: 'calc(100% - 56px)',
				// background: colorBgContainer,
				borderRadius: borderRadiusLG,
				overflow: 'auto',
				display: 'flex',
			}}
		>
			<Reader document={{
				id: 'doc1',
				pages: [
					{
						height: 100,
						width: 50,
						texts: [{
							content: 'test',
							hasReturn: true,
							position: {
								x: 0,
								y: 0
							},
							id: 'test2',
							style: {
								top: '30px',
								left: '100px',
								fontSize: '20px',
							}
						}],
						id: 'test1'
					},
					{
						height: 100,
						width: 100,
						texts: [{
							content: 'test',
							hasReturn: false,
							position: {
								x: 0,
								y: 0
							},
							id: 'test4',
							style: {
								top: '100px',
								left: '140px',
								fontSize: '30px',
							}
						}, {
							content: 'test test test test test test test',
							hasReturn: false,
							position: {
								x: 0,
								y: 0
							},
							id: 'test5',
							style: {
								top: '130px',
								left: '140px',
								fontSize: '30px',
							}
						}, {
							content: 'test test test test test test test',
							hasReturn: true,
							position: {
								x: 0,
								y: 0
							},
							id: 'test6',
							style: {
								top: '150px',
								left: '140px',
								fontSize: '30px',
							}
						}, {
							content: '模拟中文1111，模拟左右分段没有回车',
							hasReturn: false,
							position: {
								x: 0,
								y: 0
							},
							id: 'test7',
							style: {
								top: '124px',
								left: '520px',
								fontSize: '30px',
							}
						}, {
							content: '模拟中文22222，模拟左右分段有回车',
							hasReturn: true,
							position: {
								x: 0,
								y: 0
							},
							id: 'test8',
							style: {
								top: '144px',
								left: '520px',
								fontSize: '30px',
							}
						}, {
							content: '模拟中文3333，模拟左右分段没有回车',
							hasReturn: false,
							position: {
								x: 0,
								y: 0
							},
							id: 'test9',
							style: {
								top: '164px',
								left: '520px',
								fontSize: '30px',
							}
						}],
						id: 'test3'
					}
				]
			}} />
			{currentNote && <Note note={currentNote}/>}
			<input type="file" onChange={onUpload} style={{ display: 'none' }}/>
		</Content>
	</Layout>;
}
