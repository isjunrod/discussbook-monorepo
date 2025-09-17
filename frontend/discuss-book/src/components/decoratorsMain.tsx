import React from 'react';
import SVG from './svg';

export default function DecoratorsMain() {
	return Array.from({ length: 2 }).map((_, i) => (
		<div
			key={i}
			className={`z-[-1] absolute w-[45rem] h-[40rem] 
    ${
		i === 1
			? 'transform scale-y-[-1] scale-x-[-1] bottom-[-4rem] right-[20rem]'
			: 'left-[20rem] top-[-3rem]'
	}`}
		>
			<SVG type="painting" color="var(--neutral500)" />
		</div>
	));
}
