import { when } from 'jest-when';

import {
	GetCollectionDetailPageDataDocument,
	GetCollectionDetailPathsDataDocument,
	SequenceContentType,
} from '@lib/generated/graphql';
import { buildStaticRenderer, mockedFetchApi } from '@lib/test/helpers';
import CollectionDetail, {
	getStaticPaths,
	getStaticProps,
} from '@pages/[language]/conferences/[id]/[[...slug]]';

const renderPage = buildStaticRenderer(CollectionDetail, getStaticProps, {
	language: 'en',
	id: 'the_collection_id',
});

function loadData() {
	when(mockedFetchApi)
		.calledWith(GetCollectionDetailPageDataDocument, expect.anything())
		.mockResolvedValue({
			collection: {
				id: 'the_collection_id',
				title: 'the_collection_title',
				startDate: '2007-12-19',
				endDate: '2007-12-23',
				sponsor: {
					id: 'the_sponsor_id',
					title: 'the_sponsor_title',
					canonicalPath: 'the_sponsor_path',
					imageWithFallback: {
						url: 'the_sponsor_image_url',
					},
				},
				persons: {
					aggregate: {
						count: 1,
					},
					nodes: [
						{
							id: 'the_person_id',
							name: 'the_person_name',
							canonicalPath: 'the_person_url',
							imageWithFallback: {
								url: 'the_person_image_url',
							},
							recordings: {
								aggregate: {
									count: 0,
								},
							},
						},
					],
				},
				sequences: {
					aggregate: {
						count: 1,
					},
					nodes: [
						{
							id: 'the_sequence_id',
							title: 'the_sequence_title',
							contentType: SequenceContentType.Series,
							canonicalPath: 'the_sequence_path',
							allRecordings: {
								aggregate: {
									count: 1,
								},
							},
							speakers: [],
						},
					],
				},
			},
		});
}

describe('collection detail page', () => {
	it('renders', async () => {
		await renderPage();

		expect(mockedFetchApi).toBeCalledWith(GetCollectionDetailPageDataDocument, {
			variables: {
				id: 'the_collection_id',
			},
		});
	});

	it('lists sequences', async () => {
		loadData();

		const { getByText } = await renderPage();

		expect(getByText('the_sequence_title')).toBeInTheDocument();
	});

	it('renders page title', async () => {
		loadData();

		const { getByText } = await renderPage();

		expect(getByText('the_collection_title')).toBeInTheDocument();
	});

	it('generates static paths', async () => {
		when(mockedFetchApi)
			.calledWith(GetCollectionDetailPathsDataDocument, expect.anything())
			.mockResolvedValue({
				collections: {
					nodes: [{ canonicalPath: '/the_collection_path' }],
				},
			});

		const { paths } = await getStaticPaths();

		expect(paths).toContain('/the_collection_path');
	});

	it('renders sponsor link', async () => {
		loadData();

		const { getAllByText } = await renderPage();

		expect(getAllByText('the_sponsor_title')[1]).toHaveAttribute(
			'href',
			'/the_sponsor_path'
		);
	});

	it('renders 404', async () => {
		when(mockedFetchApi)
			.calledWith(GetCollectionDetailPageDataDocument, expect.anything())
			.mockRejectedValue('oops');

		const { getByText } = await renderPage();

		expect(getByText('Sorry!')).toBeInTheDocument();
	});

	it('renders conference dates', async () => {
		loadData();

		const { getByText } = await renderPage();

		expect(getByText('Dec 19 – 23, 2007')).toBeInTheDocument();
	});

	it('links to RSS feed', async () => {
		loadData();

		const { getByText } = await renderPage();

		expect(getByText('Copy RSS Link')).toHaveAttribute(
			'href',
			'/en/conferences/the_collection_id/feed.xml'
		);
	});
});
