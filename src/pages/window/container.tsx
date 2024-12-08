import React, { useCallback, useEffect, useState } from 'react';
import { isWindowItem, NewSplitWindowPosition, split as splitContainer, WindowContainer, windowControlStore, WindowSplitType } from '../../store/data/windowControl';
import { Splitter } from 'antd';
import { WindowItemComponent } from './windowItem';
import './index.scss';
import { Number2 } from '../../types/Math';

interface Props {
	container: WindowContainer;
}

const splitMap: Record<WindowSplitType, 'horizontal' | 'vertical'> = {
	[WindowSplitType.HORIZONTAL]: 'horizontal',
	[WindowSplitType.VERTICAL]: 'vertical',
	[WindowSplitType.NONE]: 'horizontal',
}

export const Container: React.FC<Props> = (props: Props) => {
	const { container } = props;
	const { items, split } = container;

	return <Splitter layout={splitMap[split]} className="hamster-note-window-splitter">
		{
			items.map(item => {
				return <Splitter.Panel key={item.id} collapsible>
					<ContainerContent container={container} item={item} key={`${item.id}-content`} />
				</Splitter.Panel>;
			})
		}
	</Splitter>;
};

interface ContentProps {
	container: WindowContainer;
	item: WindowContainer['items'][number];
}

const ContainerContent: React.FC<ContentProps> = (props) => {
	const { container, item } = props;
	if (isWindowItem(item)) {
		return <WindowItemComponent container={container} windowItem={item} />;
	} else {
		return <Container container={item} />;
	}
}
