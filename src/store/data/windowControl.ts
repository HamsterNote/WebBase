import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Number2 } from '../../types/Math';
import { getId } from '../../utils/getId';

export const SHELF_TITLE = '书架';

let cnt = 1;

export enum WindowSplitType {
	VERTICAL = 'vertical',
	HORIZONTAL = 'horizontal',
	NONE = 'none',
}

export enum NewSplitWindowPosition {
	LEFT = 'left',
	RIGHT = 'right',
	TOP = 'top',
	BOTTOM = 'bottom',
	NONE = 'none',
}

export interface WindowItem {
	id: string;
	pages: WindowPage[];
}

export enum PageType {
	SHELF = 'shelf',
	NOTE = 'note',
	READ = 'read',
}

export interface WindowPage {
	id: string;
	title: string;
	type: PageType;
}

export interface WindowContainer {
	id: string;
	items: Array<WindowItem | WindowContainer>;
	split: WindowSplitType;
}

export function isWindowItem(item: WindowItem | WindowContainer): item is WindowItem {
	return item.hasOwnProperty('pages');
}

const windowControlInitialState: () => { container: WindowContainer, currentDraggingPageId?: {
	pageId: string; windowId: string; containerId: string; mousePosition: Number2;
	}; } = () => ({
	container: {
		id: getId(),
		items: [{
			id: getId(),
			pages: [{
				id: getId(),
				title: SHELF_TITLE + `-${cnt++}`,
				type: PageType.SHELF,
			}],
		}],
		split: WindowSplitType.NONE,
	},
	currentDraggingPageId: undefined,
});

function getAllContainers(container: WindowContainer): WindowContainer[] {
	const tempContainers: Array<WindowItem | WindowContainer> = [container];
	const result: WindowContainer[] = [];
	while (tempContainers.length) {
		const shiftContainer = tempContainers.shift();
		if (shiftContainer && !isWindowItem(shiftContainer)) {
			result.push(shiftContainer);
			tempContainers.push(...shiftContainer.items);
		}
	}
	return result;
}

function getAllWindowItems(container: WindowContainer): WindowItem[] {
	const tempContainers: Array<WindowItem | WindowContainer> = [container];
	const result: WindowItem[] = [];
	while (tempContainers.length) {
		const shiftContainer = tempContainers.shift();
		if (shiftContainer) {
			if (isWindowItem(shiftContainer)) {
				result.push(shiftContainer);
			} else {
				tempContainers.push(...shiftContainer.items);
			}
		}
	}
	return result;
}

function getAllPages(container: WindowContainer) {
	const allWindowItems = getAllWindowItems(container);
	const result: WindowPage[] = [];
	for (const item of allWindowItems) {
		result.push(...item.pages);
	}
	return result;
}

export function findContainer(container: WindowContainer, containerId: string): WindowContainer | undefined {
	const allContainers = getAllContainers(container);
	return allContainers.find(container => container.id === containerId);
}

export function findWindowItem(container: WindowContainer, windowId: string): WindowItem | undefined {
	const allWindowItems = getAllWindowItems(container);
	return allWindowItems.find(window => window.id === windowId);
}

export function findPage(container: WindowContainer, pageId: string): WindowPage | undefined {
	const allPages = getAllPages(container);
	return allPages.find(page => page.id === pageId);
}

const closeContainerUtil = (container: WindowContainer, { containerId }: { containerId: string; }) => {
	const allContainers = getAllContainers(container);
	const close = (id: string) => {
		const parentContainer = allContainers.find(container => container.items.find(item => item.id === id));
		if (parentContainer) {
			parentContainer.items = parentContainer.items.filter(item => item.id !== id);
			if (parentContainer.items.length === 0) {
				close(parentContainer.id);
			}
		}
	};
	close(containerId);
}

const closeWindowItemUtil = (container: WindowContainer, { containerId, windowId }: { containerId?: string; windowId: string; }) => {
	const parentContainer = containerId ? findContainer(container, containerId) : getAllContainers(container).find(c => c.items.find(item => item.id === windowId));
	if (parentContainer) {
		parentContainer.items = parentContainer.items.filter(item => item.id !== windowId);
		if (parentContainer.items.length === 0) {
			closeContainerUtil(container, { containerId: parentContainer.id });
		}
	}
}

const closePageUtil = (container: WindowContainer, { containerId, windowId, pageId }: { containerId?: string; windowId?: string; pageId: string; }) => {
	const windowItem = windowId ? findWindowItem(container, windowId) : getAllWindowItems(container).find(wItem => wItem.pages.find(p => p.id === pageId));
	if (windowItem) {
		// const onlyPage = container.items.length === 1 && windowItem.pages.length === 1;
		windowItem.pages = windowItem.pages.filter(item => item.id !== pageId);
		if (windowItem.pages.length === 0) {
			closeWindowItemUtil(container, { containerId: containerId, windowId: windowItem.id });
		}
		// if (onlyPage) {
		// 	windowItem.pages.push({
		// 		id: getId(),
		// 		title: SHELF_TITLE + `-${cnt++}`,
		// 		type: PageType.SHELF,
		// 	});
		// }
	}
}

// 窗口管理
const windowControl = createSlice({
	name: 'windowControl',
	initialState: windowControlInitialState(),
	reducers: {
		addPage: (state, { payload }: { payload: { windowId: string; id?: string; } }) => {
			const windowItem = findWindowItem(state.container, payload.windowId);
			if (windowItem) {
				const page: WindowPage = {
					id: payload.id || getId(),
					title: SHELF_TITLE + `-${cnt++}`,
					type: PageType.SHELF,
				};
				windowItem.pages.push(page);
			}
		},
		closePage: (state, { payload }: { payload: { containerId: string; windowId: string; pageId: string; } }) => {
			closePageUtil(state.container, payload);
		},
		closeWindowItem: (state, { payload }: { payload: { containerId: string; windowId: string; } }) => {
			closeWindowItemUtil(state.container, payload);
		},
		closeContainer: (state, { payload }: { payload: { containerId: string; } }) => {
			closeContainerUtil(state.container, payload)
		},
		split: (state, { payload }: { payload: { windowId: string; split: WindowSplitType; newPosition: NewSplitWindowPosition; source?: { containerId: string; windowId: string; pageId: string; } } }) => {
			const parentContainer = getAllContainers(state.container).find(container => container.items.find(item => item.id === payload.windowId));
			if (parentContainer) {
				const oldWindowItem: WindowItem = parentContainer.items.find(item => item.id === payload.windowId) as WindowItem;
				const newContainer: WindowContainer = {
					id: getId(),
					items: [],
					split: payload.split,
				};
				const { containerId, windowId, pageId } = payload.source || {};
				const newPage = pageId ? findPage(state.container, pageId) : { id: getId(), title: SHELF_TITLE + `-${cnt++}` , type: PageType.SHELF };
				if (newPage) {
					if (pageId && windowId && containerId) {
						closePageUtil(state.container, { pageId });
					}
					const newWindowItem: WindowItem = {
						id: getId(),
						pages: [newPage],
					};
					const isInsertFront = payload.newPosition === NewSplitWindowPosition.LEFT || payload.newPosition === NewSplitWindowPosition.TOP;
					if (isInsertFront) {
						newContainer.items.push(newWindowItem, oldWindowItem);
					} else {
						newContainer.items.push(oldWindowItem, newWindowItem);
					}
					parentContainer.items.splice(parentContainer.items.indexOf(oldWindowItem), 1, newContainer);
				}
			}
		},
		movePage: (state, { payload }: { payload: { fromWindowId: string; toWindowId: string; pageId: string; } }) => {
			const fromWindowItem = findWindowItem(state.container, payload.fromWindowId);
			const toWindowItem = findWindowItem(state.container, payload.toWindowId);
			if (fromWindowItem && toWindowItem) {
				const page = fromWindowItem.pages.find(p => p.id === payload.pageId);
				if (page) {
					toWindowItem.pages.push(page);
					fromWindowItem.pages = fromWindowItem.pages.filter(p => p.id !== payload.pageId);
					if (fromWindowItem.pages.length === 0) {
						closeWindowItemUtil(state.container, { windowId: fromWindowItem.id });
					}
				}
			}
		},
		insertPage: (state, { payload }: { payload: { fromWindowId: string; toWindowId: string; fromPageId: string; toPageId: string; isBefore: boolean; } }) => {
			const fromWindowItem = findWindowItem(state.container, payload.fromWindowId);
			const toWindowItem = findWindowItem(state.container, payload.toWindowId);
			if (fromWindowItem && toWindowItem) {
				const fromPage = fromWindowItem.pages.find(p => p.id === payload.fromPageId);
				const toPage = toWindowItem.pages.find(p => p.id === payload.toPageId);
				if (fromPage && toPage) {
					closePageUtil(state.container, { windowId: payload.fromWindowId, pageId: payload.fromPageId });
					toWindowItem.pages.splice(toWindowItem.pages.indexOf(toPage) + (payload.isBefore ? 0 : 1), 0, fromPage);
				}
			}
		},
		setCurrentDraggingPageId: (state, { payload }: { payload: { pageId: string; windowId: string; containerId: string; mousePosition: Number2; } | undefined }) => {
			state.currentDraggingPageId = payload;
		}
	},
});

export const { addPage, closePage, closeWindowItem, closeContainer, setCurrentDraggingPageId, split, movePage, insertPage } = windowControl.actions;

export const windowControlStore = configureStore({
	reducer: {
		windowControl: windowControl.reducer,
	},
});
