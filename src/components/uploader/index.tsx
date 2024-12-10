import React, { ReactElement } from 'react';
import { Upload } from 'antd';
import { uploadFiles } from '../../api/file';
import { RcFile } from 'antd/es/upload';

interface Props {
	children: ReactElement
}

export const Uploader: React.FC<Props> = (props) => {
	const beforeUpload = async (file: RcFile, fileList: RcFile[]) => {
		setTimeout(() => {
			uploadFiles(file);
		}, 0);
	}
	return <Upload name="file" accept={'pdf'} beforeUpload={beforeUpload} multiple showUploadList={false}>
		{props.children}
	</Upload>
};
