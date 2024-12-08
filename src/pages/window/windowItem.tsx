import React, { useCallback, useEffect, useState } from 'react';
import { addPage, closePage, insertPage, isWindowItem, movePage, NewSplitWindowPosition, PageType, setCurrentDraggingPageId, split as splitContainer, WindowContainer, windowControlStore, WindowItem, WindowSplitType } from '../../store/data/windowControl';
import './index.scss';
import { Flex, Tabs } from 'antd';
import { Shelf } from '../shelf';
import { Number2 } from '../../types/Math';
import { getId } from '../../utils/getId';
import { CloseOutlined } from '@ant-design/icons';
import { MovingBar } from './movingBar';

interface Props {
	windowItem: WindowItem;
	container: WindowContainer;
}

export const WindowItemComponent: React.FC<Props> = (props) => {
	const ref = React.useRef<HTMLDivElement>(null);
	const { windowItem, container } = props;
	const pages = windowItem.pages;
	const [activeKey, setActiveKey] = useState<string | undefined>(pages[0]?.id);
	const [currentMoveTab, setCurrentMoveTab] = useState<string>();

	const [currentDraggingPageId, _setCurrentDraggingPageId] = useState<{ pageId: string; windowId: string; containerId: string; mousePosition: Number2; } | undefined>(undefined);
	const [movingInsidePosition, setMovingInsidePosition] = useState<NewSplitWindowPosition | undefined>();
	useEffect(() => {
		_setCurrentDraggingPageId(windowControlStore.getState().windowControl.currentDraggingPageId);
		const unsubscribe = windowControlStore.subscribe(() => {
			_setCurrentDraggingPageId(windowControlStore.getState().windowControl.currentDraggingPageId);
		});
		return unsubscribe;
	}, []);
	useEffect(() => {
		if (!currentDraggingPageId) {
			setMovingInsidePosition(undefined);
		}
	}, [currentDraggingPageId]);
	useEffect(() => {
		if (pages.length && !pages.find(page => page.id === activeKey)) {
			setActiveKey(pages[0].id)
		}
	}, [windowItem, activeKey]);
	const onMouseUp: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
		if (movingInsidePosition && currentDraggingPageId) {
			const fromWindowId = currentDraggingPageId.windowId
			if (movingInsidePosition === NewSplitWindowPosition.NONE) {
				if (fromWindowId !== windowItem.id) {
					windowControlStore.dispatch(movePage({
						pageId: currentDraggingPageId.pageId,
						fromWindowId: fromWindowId,
						toWindowId: windowItem.id,
					}));
				}
			} else if (windowItem.pages.length > 1 || fromWindowId !== windowItem.id) {
				windowControlStore.dispatch(splitContainer({
					windowId: windowItem.id,
					split: movingInsidePosition === NewSplitWindowPosition.LEFT || movingInsidePosition === NewSplitWindowPosition.RIGHT ? WindowSplitType.HORIZONTAL : WindowSplitType.VERTICAL,
					newPosition: movingInsidePosition,
					source: {
						containerId: container.id,
						pageId: currentDraggingPageId.pageId,
						windowId: windowItem.id,
					}
				}));
			}
		}
	}, [movingInsidePosition, currentDraggingPageId]);
	if (!pages.length) {
		return null;
	}

	const onChange = (newActiveKey: string) => {
		setActiveKey(newActiveKey);
	};

	const onEdit = (
		targetKey: React.MouseEvent | React.KeyboardEvent | string,
		action: 'add' | 'remove',
	) => {
		if (action === 'add') {
			const newPageId = getId();
			windowControlStore.dispatch(addPage({
				windowId: windowItem.id,
				id: newPageId,
			}));
			setActiveKey(newPageId);
		} else {
			if (typeof targetKey === 'string') {
				windowControlStore.dispatch(closePage({
					pageId: targetKey,
					windowId: windowItem.id,
					containerId: container.id,
				}));
			}
		}
	};
	const onTabMouseDown = (pageId: string | null) => (mouseDownEvent: React.MouseEvent) => {
		if (pageId) {
			const onMove = (moveEvent: MouseEvent) => {
				setCurrentMoveTab(pageId);
				windowControlStore.dispatch(setCurrentDraggingPageId({
					pageId: pageId,
					windowId: windowItem.id,
					containerId: container.id,
					mousePosition: { x: moveEvent.pageX, y: moveEvent.pageY },
				}));
			}
			const onMouseUp = (e: MouseEvent) => {
				document.removeEventListener('mousemove', onMove);
				document.removeEventListener('mouseup', onMouseUp);
				setCurrentMoveTab(undefined);
				windowControlStore.dispatch(setCurrentDraggingPageId(undefined));
			}
			document.addEventListener('mousemove', onMove);
			document.addEventListener('mouseup', onMouseUp);
		}
	}
	const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
		const current = ref?.current;
		if (current && container.items.find(isWindowItem)) {
			const rect = current.getBoundingClientRect();
			const offsetY = e.pageY - rect.top;
			if (offsetY > 40) {
				const leftSplit = rect.left + rect.width / 4;
				const rightSplit = rect.left + rect.width * 3 / 4;
				const topSplit = rect.top + rect.height / 4;
				const bottomSplit = rect.top + rect.height * 3 / 4;
				const mousePosition: Number2 = { x: e.pageX, y: e.pageY };
				// 中间先筛，横竖四分之一
				if (
					(mousePosition.x < rightSplit && mousePosition.x > leftSplit) &&
					(mousePosition.y < bottomSplit && mousePosition.y > topSplit)
				) {
					setMovingInsidePosition(NewSplitWindowPosition.NONE);
				} else if (mousePosition.x < leftSplit) {
					setMovingInsidePosition(NewSplitWindowPosition.LEFT);
				} else if (mousePosition.x > rightSplit) {
					setMovingInsidePosition(NewSplitWindowPosition.RIGHT);
				} else if (mousePosition.y < topSplit) {
					setMovingInsidePosition(NewSplitWindowPosition.TOP);
				} else if (mousePosition.y > bottomSplit) {
					setMovingInsidePosition(NewSplitWindowPosition.BOTTOM);
				}
			}
		}
	}
	const onMouseOut: React.MouseEventHandler<HTMLDivElement> = (e) => {
		setMovingInsidePosition(undefined);
	}
	const onMoveBarMouseUp = (isBefore: boolean, toPageId: string | null) => () => {
		const fromWindowId = currentDraggingPageId?.windowId;
		const fromPageId = currentDraggingPageId?.pageId;
		if (fromWindowId && fromPageId && toPageId) {
			windowControlStore.dispatch(insertPage({
				fromWindowId,
				fromPageId,
				toWindowId: windowItem.id,
				toPageId,
				isBefore,
			}));
		}
	};
	const rootContainer = windowControlStore.getState().windowControl.container;
	const isOnlyPage = rootContainer.items.length === 1 && (rootContainer.items[0] as WindowItem)?.pages?.length === 1;
	return <Flex ref={ref} className={`hamster-note-window-item ${movingInsidePosition || ''}`} onMouseMove={currentDraggingPageId ? onMouseMove : undefined} onMouseOut={currentDraggingPageId ? onMouseOut : undefined} onMouseUp={onMouseUp} justify="center" align="center" style={{ height: '100%' }}>
		<Tabs
			className="hamster-note-window-item-tab"
			type="editable-card"
			removeIcon={isOnlyPage ? <span /> : <CloseOutlined />}
			onChange={onChange}
			activeKey={activeKey}
			onEdit={onEdit}
			renderTabBar={(tabProps, DefaultTabBar) => (
				<DefaultTabBar {...tabProps} className="hamster-note-window-item-tab-bar">
					{(node) => {
						return currentMoveTab === node.key ? <div /> : <div className="hamster-note-window-item-tab-bar-content" onMouseDown={onTabMouseDown(node.key)}>
							{currentDraggingPageId && <MovingBar onMouseUp={onMoveBarMouseUp(true, node.key)} className="hamster-note-window-item-tab-bar-content-before"/>}
							{node}
							{currentDraggingPageId && <MovingBar onMouseUp={onMoveBarMouseUp(false, node.key)} className="hamster-note-window-item-tab-bar-content-after"/>}
						</div>;
					}}
				</DefaultTabBar>
			)}
			items={windowItem.pages.map(item => {
				return {
					label: item.title,
					key: item.id,
					children: item.type === PageType.SHELF ? <Shelf key={item.id} /> : null,
				};
			})}
		/>
	</Flex>;
};
