import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import SearchSequences, {
	SearchSequencesProps,
} from '@containers/search/sequences';
import { storeRequest } from '@lib/api/fetchApi';
import { getSearchResultsSequences } from '@lib/generated/graphql';
import { getPaginatedStaticProps } from '@lib/getPaginatedStaticProps';

export default SearchSequences;

export async function getServerSideProps({
	req,
	params,
	query,
}: GetServerSidePropsContext<{
	language: string;
	i: string;
}>): Promise<GetServerSidePropsResult<SearchSequencesProps>> {
	storeRequest(req);

	const { props } = await getPaginatedStaticProps(
		params as { language: string; i: string },
		(variables) =>
			getSearchResultsSequences({
				...variables,
				term: query?.q as string,
			}),
		(d) => d.sequences.nodes,
		(d) => d.sequences.aggregate?.count
	);
	return {
		props,
	};
}
