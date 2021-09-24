import { when } from 'jest-when';

import {
	GetStoryDetailDataDocument,
	GetStoryDetailStaticPathsDocument,
	RecordingContentType,
} from '@lib/generated/graphql';
import { buildStaticRenderer, mockedFetchApi } from '@lib/test/helpers';
import Story, {
	getStaticPaths,
	getStaticProps,
} from '@pages/[language]/stories/[id]/[[...slugs]]';

const renderPage = buildStaticRenderer(Story, getStaticProps, {
	language: 'en',
	id: 'the_story_id',
});

function loadData() {
	when(mockedFetchApi)
		.calledWith(GetStoryDetailDataDocument, expect.anything())
		.mockResolvedValue({
			story: {
				id: 'the_story_id',
				title: 'the_story_title',
				contentType: RecordingContentType.Story,
				speakers: [],
				attachments: [],
			},
		});
}

describe('story detail page', () => {
	it('renders', async () => {
		loadData();

		await renderPage();

		expect(mockedFetchApi).toBeCalledWith(GetStoryDetailDataDocument, {
			variables: { id: 'the_story_id' },
		});
	});

	it('includes story title', async () => {
		loadData();

		const { getByText } = await renderPage();

		expect(getByText('the_story_title')).toBeInTheDocument();
	});

	it('generates paths', async () => {
		when(mockedFetchApi)
			.calledWith(GetStoryDetailStaticPathsDocument, expect.anything())
			.mockResolvedValue({
				stories: {
					nodes: [
						{
							id: 'the_story_id',
						},
					],
				},
			});

		const { paths } = await getStaticPaths();

		expect(paths).toContain('/en/stories/the_story_id');
	});

	it('catches fetch error and renders 404', async () => {
		when(mockedFetchApi)
			.calledWith(GetStoryDetailDataDocument, expect.anything())
			.mockRejectedValue('Oops!');

		const { getByText } = await renderPage();

		expect(getByText('404')).toBeInTheDocument();
	});
});
