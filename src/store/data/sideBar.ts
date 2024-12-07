import { configureStore, createSlice } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

export enum SideBarPosition {
	LEFT = 'left',
	RIGHT = 'right',
	BOTTOM = 'bottom',
}

export type SideBarItem = {
	icon: ReactNode;
	title: string;
	selectable: boolean;
	position: SideBarPosition;
	tag: string;
	exclusive?: boolean;
	children?: Omit<SideBarItem, 'children'>;
	onClick?: () => void;
};

const sideBarInitState = (): { items: SideBarItem[] } => ({
	items: [],
});

// 两侧侧栏还有底栏
const sideBar = createSlice({
	name: 'sideBar',
	initialState: sideBarInitState(),
	reducers: {
		addItem(state, { payload }: { payload: SideBarItem }) {
			state.items.push(payload);
		},
		addItems(state, { payload }: { payload: SideBarItem[] }) {
			state.items.push(...payload);
		},
		deleteByTag(state, { payload }: { payload: string } ) {
			state.items = state.items.filter(item => item.tag !== payload);
		},
		deleteByPosition(state, { payload }: { payload: SideBarPosition }) {
			state.items = state.items.filter(item => item.position !== payload);
		}
	},
});

export const { addItem, addItems, deleteByTag, deleteByPosition } = sideBar.actions;

export const sideBarStore = configureStore({
	reducer: {
		sideBar: sideBar.reducer,
	},
});
