import React from 'react';
import ReactTooltip from 'react-tooltip';

import { Person } from 'types';

export default function SpeakerName({
	person,
}: {
	person: Person;
}): JSX.Element {
	const { name, summary, imageWithFallback: image } = person;

	return (
		<>
			<a data-tip data-for={`${name}-speakerTip`}>
				{name}
			</a>
			<ReactTooltip
				id={`${name}-speakerTip`}
				uuid={`${name}-tooltipUuid`}
				effect={'solid'}
				clickable={true}
			>
				{image && <img alt={name} src={image.url} />}
				{summary}
			</ReactTooltip>
		</>
	);
}
