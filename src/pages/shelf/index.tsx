import React, { useEffect, useState } from 'react';
import './index.scss';
import { Badge, Button, Card, Col, Empty, Flex, Layout, Row, Typography, Upload, UploadFile } from 'antd';
import imgsrc from './logo192.png';
import { SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { ShelfMenu } from './menu';
import { filesStore, FileType, HamsterDirectoryFile, HamsterFileBase, isDirectoryFile } from '../../store/data/files';
import moment from 'moment';
import { RcFile, UploadChangeParam } from 'antd/es/upload';
import { uploadFiles } from '../../api/file';
import { Uploader } from '../../components/uploader';

const { Header, Content } = Layout;

const { Paragraph } = Typography;

interface Props {
}

export const Shelf: React.FC<Props> = (props) => {
	const [currentDirectory, setCurrentDirectory] = useState<string>();
	const [files, setFiles] = useState<HamsterFileBase[]>([]);
	const defaultDirectory: HamsterDirectoryFile = {
		id: 'root',
		name: 'root',
		type: FileType.DIRECTORY,
		childrenIds: files.map(file => file.id),
		downloaded: true,
		createTime: moment().valueOf(),
		modifyTime: moment().valueOf(),
		isCloudFile: false,
		hasNewVersion: false,
	};
	const directory: HamsterDirectoryFile = currentDirectory ? (files.find(item => isDirectoryFile(item) && item.id === currentDirectory) as HamsterDirectoryFile | undefined) || defaultDirectory : defaultDirectory;
	const currentFiles = directory.childrenIds.map(id => files.find(item => item.id === id)).filter(item => item !== undefined) as HamsterFileBase[];
	useEffect(() => {
		setFiles(filesStore.getState().files.files);
		const unsubscribe = filesStore.subscribe(() => {
			setFiles(filesStore.getState().files.files);
		});
		return unsubscribe;
	}, []);
	const onUpload = async (options: any) => {
		return false;
	};
	return <Layout className="hamster-note-shelf">
		<Header>
			<ShelfMenu/>
		</Header>
		<Content className="hamster-note-shelf-content">
			{currentFiles.length ? <Row gutter={[60, 30]} justify="center" align="top">
				{
					currentFiles.map((file, index) => <Col key={`shelf-${file.id}`} className="gutter-row">
						<div className="hamster-note-shelf-item">
							<Badge.Ribbon text={<SaveOutlined/>} color="green">
								<Card size="small" className="hamster-note-shelf-item-container">
									<img className="hamster-note-shelf-item-cover" src={imgsrc} alt="" style={{ backgroundColor: 'gray' }}/>
									<Paragraph
										className="hamster-note-shelf-item-title"
										ellipsis={{
											rows: 2
										}}
										title={`钢铁是怎样炼成的钢铁是怎样炼成的钢铁是怎样炼成的`}
									>钢铁是怎样炼成的钢铁是怎样炼成的钢铁是怎样炼成的</Paragraph>
								</Card>
							</Badge.Ribbon>
						</div>
					</Col>)
				}
			</Row> : <Flex vertical justify="center" align="center" style={{ height: '100%' }}>
				<Empty description={'空空如也，上传一个文件开始学习吧'} style={{ width: '400px' }}>
					<Uploader>
						<Button icon={<UploadOutlined />}>点这里上传</Button>
					</Uploader>
				</Empty>
			</Flex>}
		</Content>
	</Layout>;
};
