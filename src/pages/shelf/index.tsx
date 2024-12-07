import React from 'react';
import './index.scss';
import { Badge, Card, Col, Row } from 'antd';
import imgsrc from './logo192.png';
import { Typography } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

interface Props {
}

export const Shelf: React.FC<Props> = (props) => {
	return <div className="hamster-note-shelf">
		<Row gutter={[60, 30]} justify="center" align="top">
			{
				[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((item, index) => <Col key={`shelf-${item}`} className="gutter-row">
					<div className="hamster-note-shelf-item">
						<Badge.Ribbon text={<SaveOutlined />} color="green">
							<Card size="small" className="hamster-note-shelf-item-container">
								<img className="hamster-note-shelf-item-cover" src={imgsrc} alt="" style={{ backgroundColor: 'gray' }}/>
								<Paragraph
									className="hamster-note-shelf-item-title"
									ellipsis={{
										rows: 2,
									}}
									title={`钢铁是怎样炼成的钢铁是怎样炼成的钢铁是怎样炼成的`}
								>钢铁是怎样炼成的钢铁是怎样炼成的钢铁是怎样炼成的</Paragraph>
							</Card>
						</Badge.Ribbon>
					</div>
				</Col>)
			}
		</Row>
	</div>;
};
