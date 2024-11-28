import { Layout, theme } from 'antd';
import React from 'react';
import { ReadPageHeader } from './header';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url,
).toString();

const { Content } = Layout;

export const ReadPage: React.FC = () => {
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
				margin: '24px 16px',
				padding: 24,
				minHeight: 280,
				background: colorBgContainer,
				borderRadius: borderRadiusLG,
				overflow: 'auto',
			}}
		>
			<p>Content</p>
			<input type="file" onChange={onUpload}/>
		</Content>
	</Layout>;
}
