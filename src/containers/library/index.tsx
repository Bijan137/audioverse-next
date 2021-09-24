import React from 'react';
import { FormattedMessage } from 'react-intl';

import LineHeading from '@components/atoms/lineHeading';
import withAuthGuard from '@components/HOCs/withAuthGuard';
import CardFavorite from '@components/molecules/card/favorite';
import CardMasonry from '@components/molecules/cardMasonry';
import LibraryNav from '@components/organisms/libraryNav';
import {
	GetLibraryDataQueryVariables,
	Language,
	useGetLibraryDataQuery,
} from '@lib/generated/graphql';

import baseStyles from './base.module.scss';
import LibraryLoggedOut from './loggedOut';

export const getLibraryDataDefaultVariables = (
	language: Language
): GetLibraryDataQueryVariables => {
	return {
		language,
		first: 25,
		offset: 0,
		groupSequences: true,
		types: null,
		viewerPlaybackStatus: null,
	};
};

type Props = {
	language: Language;
};

function Library({ language }: Props): JSX.Element {
	const { data } = useGetLibraryDataQuery(
		getLibraryDataDefaultVariables(language)
	);

	return (
		<div className={baseStyles.wrapper}>
			<LibraryNav currentNavHref="" />
			<LineHeading>
				<FormattedMessage
					id="library__startedHeading"
					defaultMessage="Started"
				/>
			</LineHeading>

			<CardMasonry
				items={data?.me?.user.favorites.nodes || []}
				render={({ data }) => <CardFavorite favorite={data} />}
			/>
		</div>
	);
}

export default withAuthGuard(Library, LibraryLoggedOut);
