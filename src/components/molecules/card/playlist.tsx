import Link from 'next/link';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Heading2 from '@components/atoms/heading2';
import Heading6 from '@components/atoms/heading6';
import { BaseColors } from '@lib/constants';
import { CardPlaylistFragment } from '@lib/generated/graphql';
import { makePlaylistDetailRoute } from '@lib/routes';
import useLanguageRoute from '@lib/useLanguageRoute';

import ListIcon from '../../../../public/img/icons/fa-list.svg';
import LikeActiveIcon from '../../../../public/img/icons/icon-like-active.svg';
import IconButton from '../iconButton';
import TeaseRecordingStack from '../teaseRecordingStack';
import TypeLockup from '../typeLockup';

import CardWithTheme from './base/withTheme';
import styles from './playlist.module.scss';

interface Props {
	playlist: CardPlaylistFragment;
}

export default function CardPlaylist({ playlist }: Props): JSX.Element {
	const languageRoute = useLanguageRoute();
	const { id, title, recordings } = playlist;
	const theme = 'playlistItem';
	return (
		<CardWithTheme {...{ theme }}>
			<Link href={makePlaylistDetailRoute(languageRoute, id)}>
				<a className={styles.container}>
					<div className={styles.stretch}>
						<TypeLockup
							Icon={ListIcon}
							iconColor={BaseColors.SALMON}
							label={
								<FormattedMessage
									id="cardPlaylist__typeLabel"
									defaultMessage="Playlist"
								/>
							}
							textColor={BaseColors.WHITE}
						/>
						<Heading2 className={styles.title}>{title}</Heading2>
					</div>
					<div className={styles.details}>
						<Heading6
							sans
							unpadded
							uppercase
							loose
							className={styles.teachingsLabel}
						>
							<FormattedMessage
								id="cardPerson_teachingsLabel"
								defaultMessage="{count} teachings"
								description="Card person teachings count label"
								values={{ count: recordings.aggregate?.count }}
							/>
						</Heading6>

						<IconButton
							Icon={LikeActiveIcon}
							onClick={() => void 0}
							color={BaseColors.SALMON}
							backgroundColor={BaseColors.PLAYLIST_H}
							className={styles.like}
						/>
					</div>
					<div className={styles.subRecordingsList}>
						<TeaseRecordingStack
							{...{ recordings: recordings.nodes || [], theme }}
							paddedSeparator
							isOptionalLink
						/>
					</div>
				</a>
			</Link>
		</CardWithTheme>
	);
}
