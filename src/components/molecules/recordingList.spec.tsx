import { render, RenderResult } from '@testing-library/react';
import React from 'react';

import RecordingList from '@components/molecules/recordingList';
import { loadQuery } from '@lib/test/helpers';

async function renderComponent(): Promise<RenderResult> {
	loadQuery({ language: 'en' });

	return render(
		<RecordingList
			sermons={[
				{
					imageWithFallback: {
						url: 'the_url',
					},
					title: 'the_title',
				} as any,
			]}
		/>
	);
}

describe('recording list', () => {
	it('renders', async () => {
		await renderComponent();
	});

	it('has image', async () => {
		const { getByRole } = await renderComponent();

		expect(getByRole('img')).toBeInTheDocument();
	});

	it('sets image src', async () => {
		const { getByRole } = await renderComponent();

		expect(getByRole('img')).toHaveAttribute('src', 'the_url');
	});

	it('sets alt', async () => {
		const { getByRole } = await renderComponent();

		expect(getByRole('img')).toHaveAttribute('alt', 'the_title');
	});
});
