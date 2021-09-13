import { waitFor } from '@testing-library/react';
import { when } from 'jest-when';
import { useRouter } from 'next/router';

import {
	ENTRIES_PER_PAGE,
	LANGUAGES,
	LIST_PRERENDER_LIMIT,
} from '@lib/constants';
import {
	GetSermonListPagePathsDataDocument,
	GetSermonListStaticPropsDocument,
} from '@lib/generated/graphql';
import { buildStaticRenderer, mockedFetchApi } from '@lib/test/helpers';
import SermonList, {
	getStaticPaths,
	getStaticProps,
} from '@pages/[language]/teachings/all/page/[i]';

jest.mock('next/router');
jest.mock('next/head');
jest.mock('@lib/api/isPersonFavorited');

const renderPage = buildStaticRenderer(SermonList, getStaticProps, {
	language: 'en',
	i: '1',
});

export function loadSermonListPagePathsData(count: number): void {
	when(mockedFetchApi)
		.calledWith(GetSermonListPagePathsDataDocument, expect.anything())
		.mockResolvedValue({
			sermons: {
				aggregate: {
					count,
				},
			},
		});
}

export function loadSermonListData({
	nodes = undefined,
	count = undefined,
}: { nodes?: any[]; count?: number } = {}): void {
	mockedFetchApi.mockResolvedValue({
		sermons: {
			nodes: nodes || [
				{
					id: 'the_sermon_id',
					title: 'the_sermon_title',
					videoFiles: [],
				},
			],
			aggregate: {
				count: count || 1,
			},
		},
	});
}

describe('sermons list page', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('can be rendered', async () => {
		loadSermonListData();

		await renderPage();
	});

	it('generates static paths', async () => {
		loadSermonListPagePathsData(1);

		const result = await getStaticPaths();

		expect(result.paths).toContain('/en/teachings/all/page/1');
	});

	it('generates in all languages', async () => {
		loadSermonListPagePathsData(1);

		const result = await getStaticPaths();

		expect(result.paths).toContain('/es/teachings/all/page/1');
	});

	it('sets proper fallback strategy', async () => {
		const { fallback } = await getStaticPaths();

		expect(fallback).toBe(true);
	});

	it('generates all pages in language', async () => {
		loadSermonListPagePathsData(LIST_PRERENDER_LIMIT * ENTRIES_PER_PAGE);

		const result = await getStaticPaths();

		const expected = LIST_PRERENDER_LIMIT * Object.keys(LANGUAGES).length;
		expect(result.paths.length).toBe(expected);
	});

	it('uses language codes to get sermon counts', async () => {
		await getStaticPaths();

		expect(mockedFetchApi).toBeCalledWith(GetSermonListPagePathsDataDocument, {
			variables: { language: 'ENGLISH', hasVideo: null },
		});
	});

	it('gets sermons for list page', async () => {
		loadSermonListData();

		await getStaticProps({ params: { i: '2', language: 'en' } });

		await waitFor(() =>
			expect(mockedFetchApi).toBeCalledWith(GetSermonListStaticPropsDocument, {
				variables: {
					language: 'ENGLISH',
					hasVideo: null,
					offset: ENTRIES_PER_PAGE,
					first: ENTRIES_PER_PAGE,
				},
			})
		);
	});

	it('displays sermons list', async () => {
		loadSermonListData();

		const { getByText } = await renderPage();

		expect(getByText('the_sermon_title')).toBeInTheDocument();
	});

	it('renders 404 on api error', async () => {
		(useRouter as jest.Mock).mockReturnValue({ isFallback: false });
		when(mockedFetchApi)
			.calledWith(GetSermonListStaticPropsDocument, expect.anything())
			.mockRejectedValue('oops');

		const { getByText } = await renderPage();

		expect(getByText('404')).toBeInTheDocument();
	});

	it('returns 404 on empty data', async () => {
		(useRouter as jest.Mock).mockReturnValue({ isFallback: false });
		loadSermonListData({ nodes: [] });

		const { getByText } = await renderPage();

		expect(getByText('404')).toBeInTheDocument();
	});

	it('includes pagination', async () => {
		loadSermonListData();

		const { getByText } = await renderPage();

		expect(getByText('1')).toBeInTheDocument();
	});

	it('links to last pagination page', async () => {
		loadSermonListData({ count: 75 });

		const { getByText } = await renderPage();

		expect(getByText('3')).toBeInTheDocument();
	});

	it('calculates pages using items per page', async () => {
		loadSermonListData({ count: 36 });

		const { getByText } = await renderPage({
			params: { i: '3', language: 'en' },
		});

		expect(() => getByText('4')).toThrow();
	});

	it('handles string page index', async () => {
		loadSermonListData();

		await renderPage({ params: { i: '3', language: 'en' } });
	});

	it('links pagination properly', async () => {
		loadSermonListData();

		const { getByText } = await renderPage(),
			link = getByText('1') as HTMLAnchorElement;

		expect(link.href).toContain('/en/teachings/all/page/1');
	});

	it('revalidates static pages', async () => {
		loadSermonListData();

		const props = await getStaticProps({ params: { i: '2', language: 'en' } });

		expect(props.revalidate).toBe(10);
	});

	it('links All button', async () => {
		loadSermonListData();

		const { getByRole } = await renderPage();

		expect(getByRole('link', { name: 'All' })).toHaveAttribute(
			'href',
			'/en/teachings/all/page/1'
		);
	});

	it('links All button using lang', async () => {
		loadSermonListData();

		const { getByRole } = await renderPage({ params: { language: 'es' } });

		expect(getByRole('link', { name: 'All' })).toHaveAttribute(
			'href',
			'/es/teachings/all/page/1'
		);
	});

	it('links Video button', async () => {
		loadSermonListData();

		const { getByRole } = await renderPage();

		expect(getByRole('link', { name: 'Video' })).toHaveAttribute(
			'href',
			'/en/teachings/video/page/1'
		);
	});

	it('links Audio button', async () => {
		loadSermonListData();

		const { getByRole } = await renderPage();

		expect(getByRole('link', { name: 'Audio' })).toHaveAttribute(
			'href',
			'/en/teachings/audio/page/1'
		);
	});

	it('does not include video paths', async () => {
		const result = await getStaticPaths();

		expect(result.paths).not.toContain('/en/teachings/video/page/1');
	});

	it('targets blank', async () => {
		loadSermonListData();

		const { getByRole } = await renderPage();

		expect(getByRole('link', { name: 'RSS' })).toHaveAttribute(
			'target',
			'_blank'
		);
	});

	it('localizes pagination', async () => {
		loadSermonListData();

		const { getByText } = await renderPage({ params: { language: 'es' } }),
			link = getByText('1') as HTMLAnchorElement;

		expect(link.href).toContain('/es/teachings/all/page/1');
	});

	it('sets rss head link', async () => {
		loadSermonListData();

		const { getByTestId } = await renderPage();

		const head = getByTestId('head');

		expect(head.innerHTML).toContain('/en/teachings/all.xml');
	});

	it('includes format indicators', async () => {
		mockedFetchApi.mockResolvedValue({
			sermons: {
				nodes: [
					{
						id: 'the_sermon_id',
						title: 'the_sermon_title',
						audioFiles: [{}],
					},
				],
			},
		});

		const { getAllByText } = await renderPage();

		expect(getAllByText('Audio').length).toEqual(2);
	});

	it('includes video format indicator', async () => {
		mockedFetchApi.mockResolvedValue({
			sermons: {
				nodes: [
					{
						id: 'the_sermon_id',
						title: 'the_sermon_title',
						hasVideo: true,
					},
				],
			},
		});

		const { getAllByText } = await renderPage();

		expect(getAllByText('Video').length).toEqual(2);
	});

	it('includes speaker name', async () => {
		mockedFetchApi.mockResolvedValue({
			sermons: {
				nodes: [
					{
						id: 'the_sermon_id',
						title: 'the_sermon_title',
						persons: [
							{
								id: 'the_id',
								name: 'the_name',
								canonicalPath: 'the_path',
								imageWithFallback: {
									url: 'the_image_url',
								},
							},
						],
					},
				],
			},
		});

		const { getByText } = await renderPage();

		expect(getByText('the_name')).toBeInTheDocument();
	});
});
