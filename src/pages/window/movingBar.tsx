import React, { useState } from 'react';

interface Props {
	className: string;
	onMouseUp: () => void;
}

export const MovingBar: React.FC<Props> = (props) => {
	const [isHover, setIsHover] = useState<boolean>(false);
	const setIsHoverValue = (val: boolean) => () => {
		setIsHover(val);
	}
	return <div className={`${props.className} ${isHover ? 'active' : ''}`} onMouseUp={props.onMouseUp} onMouseOver={setIsHoverValue(true)} onMouseOut={setIsHoverValue(false)} />;
};
