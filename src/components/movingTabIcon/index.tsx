import React, { useEffect, useState } from 'react';
import { windowControlStore } from '../../store/data/windowControl';
import { Number2 } from '../../types/Math';
import './index.scss';

export const MovingTabIcon: React.FC = () => {
	const [position, setPosition] = useState<Number2>();
	useEffect(() => {
		const unsubscribe = windowControlStore.subscribe(() => {
			setPosition(windowControlStore.getState().windowControl.currentDraggingPageId?.mousePosition);
		});
		return () => {
			unsubscribe();
		}
	}, []);
	if (!position) {
		return null;
	}
	return <div className="hamster-note-moving-tab-icon" style={{ top: `${position?.y}px`, left: `${position?.x}px` }}/>;
}
