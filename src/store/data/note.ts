import { configureStore, createSlice } from '@reduxjs/toolkit';
import { CardData, CardType, NoteData } from './types';
import { Number2 } from '../../types/Math';
import { cloneDeep } from 'lodash';
import { getId } from '../../utils/getId';

export interface CardItem extends CardData {
	children: CardItem[];
	note: NoteItem;
	parent?: CardItem;
}

export interface NoteItem extends NoteData {
	cards: CardItem[];
}

export function transformNoteData(notes: NoteData[], cards: CardData[]) {
	// 无情地将元数据转换为UI友好的数据，notes数据从noteData到noteUI一定是单向的
	return notes.map(noteData => {
		// 先克隆，保证引用不重复
		const clonedNoteData = cloneDeep(noteData);
		const noteItem: NoteItem = {
			...clonedNoteData,
			// 先留空，因为 要先创建cardItem
			cards: [],
		};
		const cardItems: CardItem[] = cards.map(cardData => {
			return {
				...cardData,
				note: noteItem,
				// 父子关系先留空
				children: [],
				parent: undefined,
			};
		});
		// 处理cardItems的父子关系
		for (const cardItem of cardItems) {
			for (const childId of cardItem.childrenIds) {
				const childCardItem = cardItems.find(cardItem => cardItem.id === childId);
				if (childCardItem) {
					childCardItem.parent = cardItem;
					cardItem.children.push(childCardItem);
				}
			}
		}
		// 使用顶层卡片，也就是没有parent的
		noteItem.cards = cardItems.filter(cardItem => !cardItem.parent);
		return noteItem;
	});
}

const noteDataInitialState: () => { notesData: NoteData[]; cardsData: CardData[]; currentNote?: string; } = () => ({
	notesData: [],
	cardsData: [],
	currentNote: undefined,
});

type MoveCardPayload = { from: undefined; to: string; fromPosition: Number2; cardId: string; } | { from: string; to: undefined; toPosition: Number2; cardId: string; } | { from: string; to: string; cardId: string; };

// 管理原始数据，做操作在这里
const noteData = createSlice({
	name: 'noteData',
	initialState: noteDataInitialState(),
	reducers: {
		addNote: (state, { payload }: { payload: Omit<NoteData, 'id' | 'cardIds'> }) => {
			const newNote: NoteData = {
				...payload,
				id: getId(),
				cardIds: [],
			}
			state.notesData.push(newNote);
		},
		deleteNote: (state, { payload }: { payload: string }) => {
			state.notesData = state.notesData.filter(note => note.id !== payload);
			state.cardsData = state.cardsData.filter(card => card.noteId !== payload);
		},
		clear: () => noteDataInitialState(),
		addCard: (state, { payload }: { payload: Omit<CardData, 'id' | 'childrenIds' | 'type'> }) => {
			const newCard: CardData = {
				...payload,
				id: getId(),
				childrenIds: [],
				type: CardType.MIND_MAP,
			}
			state.cardsData.push(newCard);
			const relatedNote = state.notesData.find(note => note.id === payload.noteId);
			relatedNote?.cardIds.push(newCard.id);
		},
		deleteCard: (state, { payload }: { payload: string }) => {
			const deleteCardList: string[] = [payload];
			while(deleteCardList.length) {
				const cardId = deleteCardList.shift();
				const card = state.cardsData.find(card => card.id === cardId);
				if (card) {
					deleteCardList.push(...card.childrenIds);
					state.cardsData = state.cardsData.filter(card => card.id !== cardId);
				}
			}
		},
		moveCard: (state, { payload }: { payload: MoveCardPayload }) => {
			if (!payload.from) {
				// 从野生到一个卡片下面
				const toCard = state.cardsData.find(card => card.id === payload.to);
				if (toCard) {
					toCard.childrenIds.push(payload.cardId);
				}
			} else if (!payload.to) {
				// 从一个卡片下面到野生
				const fromCard = state.cardsData.find(card => card.id === payload.cardId);
				if (fromCard) {
					fromCard.childrenIds = fromCard.childrenIds.filter(childId => childId !== payload.from);
				}
			} else {
				// 从一个卡片下面到另一个卡片下面
				const fromCard = state.cardsData.find(card => card.id === payload.from);
				const toCard = state.cardsData.find(card => card.id === payload.to);
				if (fromCard && toCard) {
					fromCard.childrenIds = fromCard.childrenIds.filter(childId => childId !== payload.cardId);
					toCard.childrenIds.push(payload.cardId);
				}
			}
		},
		setCardPosition: (state, { payload }: { payload: { id: string; position: Number2 } }) => {
			const card = state.cardsData.find(card => card.id === payload.id);
			if (card) {
				card.position = payload.position;
			}
		},
		setCurrentNote: (state, { payload }: { payload: string | undefined }) => {
			state.currentNote = payload;
		},
		setNotes: (state, { payload }: { payload: NoteData[] }) => {
			state.notesData = payload;
		}
	},
});

export const { addCard, moveCard, addNote, setCardPosition, setCurrentNote, setNotes } = noteData.actions;

export const noteDataStore = configureStore({
	reducer: {
		note: noteData.reducer,
	},
});
