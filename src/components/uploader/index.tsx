import React from 'react';
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export const Uploader: React.FC = () => {
	return <Upload name="file" accept={'pdf'} showUploadList={false}>
		<Button icon={<UploadOutlined />}>点这里上传</Button>
	</Upload>
};
