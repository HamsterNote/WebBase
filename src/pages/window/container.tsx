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

	return <Splitter layout={splitMap[split]}>
		{
			items.map(item => {
				return <Splitter.Panel key={item.id} defaultSize="50%" min="20%" max="70%" collapsible>
					{ isWindowItem(item) ? <WindowItemComponent container={container} windowItem={item} /> : <Container container={item} /> }
				</Splitter.Panel>;
			})
		}
	</Splitter>;
};
