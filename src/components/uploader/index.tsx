import React, { ReactElement } from 'react';
import { Upload } from 'antd';

interface Props {
	children: ReactElement
}

export const Uploader: React.FC<Props> = (props) => {
	return <Upload name="file" accept={'pdf'} showUploadList={false}>
		{props.children}
	</Upload>
};
