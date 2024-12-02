import { configureStore, createSlice } from '@reduxjs/toolkit';
import { CardItem, CardType, NoteItem } from './types';
import { Number2 } from '../../types/Math';

const initialState: { notes: NoteItem[]; currentNote?: string; } = {
	notes: [{
		id: 'note1',
		relationDocument: 'doc1',
		cards: [{
			id: 'card1',
			title: 'test',
			content: 'test',
			isOCR: false,
			image: '',
			selections: [],
			children: [],
			type: CardType.MIND_MAP
		}]
	}],
	currentNote: 'note1',
}

const noteSlice = createSlice({
	name: 'note',
	initialState,
	reducers: {
		setCurrentNote: (state, { payload }: { payload: string }) => {
			state.currentNote = payload;
			return state;
		},
		addCard: (state, { payload }: { payload: CardItem }) => {
			const noteId = state.currentNote;
			if (noteId) {
				const notes = state.notes;
				const note = notes.find(note => note.id === noteId);
				if (note) {
					note.cards.push(payload);
				}
			}
		},
		moveCard: (state, { payload }: { payload: { id: string; position: Number2 } }) => {
			const noteId = state.currentNote;
			if (noteId) {
				const notes = state.notes;
				const note = notes.find(note => note.id === noteId);
				if (note) {
					const card = note.cards.find(card => card.id === payload.id);
					if (card) {
						card.position = payload.position;
					}
				}
			}
		}
	},
});

export const { setCurrentNote, addCard, moveCard } = noteSlice.actions;

export const store = configureStore({
	reducer: {
		note: noteSlice.reducer,
	},
})
