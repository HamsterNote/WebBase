import { createSlice, configureStore } from '@reduxjs/toolkit';
import { CardItem, NoteItem } from './types';

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
			relations: []
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
		},
		addCard: (state, { payload }: { payload: CardItem }) => {
			const noteId = state.currentNote;
			if (noteId) {
				const note = state.notes.find(note => note.id === noteId);
				if (note) {
					note.cards.push(payload);
					state.notes = [...state.notes];
				}
			}
		}
	},
});

export const { setCurrentNote, addCard } = noteSlice.actions;

export const store = configureStore({
	reducer: {
		note: noteSlice.reducer,
	},
})
