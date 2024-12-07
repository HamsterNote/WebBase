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
	return <div className="hamster-note-moving-tab-icon" style={position ? { top: `${position?.y}px`, left: `${position?.x}px` } : undefined}/>;
}
