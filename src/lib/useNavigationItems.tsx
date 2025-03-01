import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import { useIntl } from 'react-intl';

import DownloadAppButton from '@components/molecules/downloadAppButton';
import LanguageButton from '@components/molecules/languageButton';
import {
	makeAboutPage,
	makeAccountProfileRoute,
	makeAudiobookListRoute,
	makeBibleListRoute,
	makeBlogPostListRoute,
	makeConferenceListRoute,
	makeContactRoute,
	makeDiscoverCollectionsRoute,
	makeDiscoverRoute,
	makeDonateRoute,
	makeLibraryRoute,
	makeLogoutRoute,
	makePresenterListRoute,
	makeSongAlbumsListRoute,
	makeSponsorListRoute,
	makeStoryAlbumListPage,
	makeTestimoniesRoute,
	makeTestimonySubmitRoute,
} from '@lib/routes';
import useLanguageRoute from '@lib/useLanguageRoute';

export type INavigationItem = {
	key: string;
	href?: string;
	onClick?: (props: { popSubmenu: () => void }) => void;
	isDivider?: true;
	isTargetBlank?: true;
	Icon?: React.ComponentType;
	label: string;
	children?: INavigationItem[];
	childNode?: JSX.Element;
};

const iconMap = {
	icon_search: dynamic(() => import('@public/img/icons/icon-search.svg')),
	icon_books: dynamic(() => import('@public/img/icons/icon-books.svg')),
	fa_bookmark: dynamic(() => import('@public/img/icons/fa-bookmark.svg')),
	fa_stream: dynamic(() => import('@public/img/icons/fa-stream.svg')),
	fa_history: dynamic(() => import('@public/img/icons/fa-history.svg')),
	icon_bible: dynamic(() => import('@public/img/icons/icon-bible.svg')),
	icon_collections: dynamic(
		() => import('@public/img/icons/icon-collections.svg')
	),
	fa_list_alt: dynamic(() => import('@public/img/icons/fa-list-alt.svg')),
	fa_user_plus_heavy: dynamic(
		() => import('@public/img/icons/fa-user-plus-heavy.svg')
	),
	fa_calendar: dynamic(() => import('@public/img/icons/fa-calendar.svg')),
	fa_user_heavy: dynamic(() => import('@public/img/icons/fa-user-heavy.svg')),
	fa_feather: dynamic(() => import('@public/img/icons/fa-feather.svg')),
	fa_book: dynamic(() => import('@public/img/icons/fa-book.svg')),
	fa_music: dynamic(() => import('@public/img/icons/fa-music.svg')),
	icon_account: dynamic(() => import('@public/img/icons/icon-account.svg')),
	icon_our_story: dynamic(() => import('@public/img/icons/icon-our-story.svg')),
	fa_seedling: dynamic(() => import('@public/img/icons/fa-seedling.svg')),
	fa_users_heavy: dynamic(() => import('@public/img/icons/fa-users-heavy.svg')),
	fa_bullseye_heavy: dynamic(
		() => import('@public/img/icons/fa-bullseye-heavy.svg')
	),
	fa_fire_heavy: dynamic(() => import('@public/img/icons/fa-fire-heavy.svg')),
	fa_align_left: dynamic(() => import('@public/img/icons/fa-align-left.svg')),
	fa_comment_heavy: dynamic(
		() => import('@public/img/icons/fa-comment-heavy.svg')
	),
	fa_heart_heavy: dynamic(() => import('@public/img/icons/fa-heart-heavy.svg')),
	icon_contact: dynamic(() => import('@public/img/icons/icon-contact.svg')),
	fa_inbox: dynamic(() => import('@public/img/icons/fa-inbox.svg')),
	fa_facebook: dynamic(() => import('@public/img/icons/fa-facebook.svg')),
	fa_instagram: dynamic(() => import('@public/img/icons/fa-instagram.svg')),
	fa_twitter: dynamic(() => import('@public/img/icons/fa-twitter.svg')),
	fa_youtube: dynamic(() => import('@public/img/icons/fa-youtube.svg')),
	icon_more: dynamic(() => import('@public/img/icons/icon-more.svg')),
	fa_question_circle: dynamic(
		() => import('@public/img/icons/fa-question-circle.svg')
	),
	fa_link: dynamic(() => import('@public/img/icons/fa-link.svg')),
	fa_landmark_heavy: dynamic(
		() => import('@public/img/icons/fa-landmark-heavy.svg')
	),
	fa_lock_heavy: dynamic(() => import('@public/img/icons/fa-lock-heavy.svg')),
	fa_newspaper_heavy: dynamic(
		() => import('@public/img/icons/fa-newspaper-heavy.svg')
	),
	icon_sign_out: dynamic(() => import('@public/img/icons/icon-sign-out.svg')),
	fa_store: dynamic(() => import('@public/img/icons/fa-store.svg')),
};

export function useNavigationItems(): INavigationItem[] {
	const router = useRouter();
	const intl = useIntl();
	const languageRoute = useLanguageRoute();

	return [
		{
			key: 'discover',
			href: makeDiscoverRoute(languageRoute),
			Icon: iconMap.icon_search,
			label: intl.formatMessage({
				id: `header__navItemDiscover`,
				defaultMessage: 'Discover',
				description: `Header nav link name: Discover`,
			}),
		},
		{
			key: 'library',
			href: makeLibraryRoute(languageRoute),
			Icon: iconMap.icon_books,
			label: intl.formatMessage({
				id: `header__navItemLibrary`,
				defaultMessage: 'Library',
				description: `Header nav link name: Library`,
			}),
			children: [
				{
					key: 'saved',
					href: makeLibraryRoute(languageRoute),
					Icon: iconMap.fa_bookmark,
					label: intl.formatMessage({
						id: `header__navItemLibrary-saved`,
						defaultMessage: 'Saved',
					}),
				},
				{
					key: 'playlists',
					href: makeLibraryRoute(languageRoute, 'playlists'),
					Icon: iconMap.fa_stream,
					label: intl.formatMessage({
						id: `header__navItemLibrary-playlists`,
						defaultMessage: 'Playlists',
					}),
				},
				{
					key: 'history',
					href: makeLibraryRoute(languageRoute, 'history'),
					Icon: iconMap.fa_history,
					label: intl.formatMessage({
						id: `header__navItemLibrary-history`,
						defaultMessage: 'History',
					}),
				},
			],
		},
		...(languageRoute === 'en'
			? [
					{
						key: 'bibles',
						href: makeBibleListRoute(languageRoute),
						Icon: iconMap.icon_bible,
						label: intl.formatMessage({
							id: `header__navItemBible`,
							defaultMessage: 'Bible',
							description: `Header nav link name: Bible`,
						}),
					},
			  ]
			: []),
		{
			key: 'collections',
			href: makeDiscoverCollectionsRoute(languageRoute),
			Icon: iconMap.icon_collections,
			label: intl.formatMessage({
				id: `header__navItemCollections`,
				defaultMessage: 'Collections',
				description: `Header nav link name: Collections`,
			}),
			children: [
				{
					key: 'all',
					href: makeDiscoverCollectionsRoute(languageRoute),
					Icon: iconMap.fa_list_alt,
					label: intl.formatMessage({
						id: `header__navItemCollections-all`,
						defaultMessage: 'All Collections',
					}),
				},
				{
					key: 'sponsors',
					href: makeSponsorListRoute(languageRoute),
					Icon: iconMap.fa_user_plus_heavy,
					label: intl.formatMessage({
						id: `header__navItemCollections-sponsors`,
						defaultMessage: 'Sponsors',
					}),
				},
				{
					key: 'conferences',
					href: makeConferenceListRoute(languageRoute),
					Icon: iconMap.fa_calendar,
					label: intl.formatMessage({
						id: `header__navItemCollections-conferences`,
						defaultMessage: 'Conferences',
					}),
				},
				{
					key: 'presenter',
					href: makePresenterListRoute(languageRoute),
					Icon: iconMap.fa_user_heavy,
					label: intl.formatMessage({
						id: `header__navItemCollections-presenters`,
						defaultMessage: 'Presenters',
					}),
				},
				{
					key: 'stories',
					href: makeStoryAlbumListPage(languageRoute),
					Icon: iconMap.fa_feather,
					label: intl.formatMessage({
						id: `header__navItemCollections-stories`,
						defaultMessage: 'Stories',
					}),
				},
				{
					key: 'books',
					href: makeAudiobookListRoute(languageRoute),
					Icon: iconMap.fa_book,
					label: intl.formatMessage({
						id: `header__navItemCollections-books`,
						defaultMessage: 'Books',
					}),
				},
				{
					key: 'songs',
					href: makeSongAlbumsListRoute(languageRoute),
					Icon: iconMap.fa_music,
					label: intl.formatMessage({
						id: `header__navItemCollections-songs`,
						defaultMessage: 'Scripture Songs',
					}),
				},
			],
		},
		{
			key: 'presenters',
			href: makePresenterListRoute(languageRoute),
			Icon: iconMap.icon_account,
			label: intl.formatMessage({
				id: `header__navItemPresenters`,
				defaultMessage: 'Presenters',
			}),
		},
		{
			key: 'story',
			href: makeAboutPage(languageRoute, 1),
			Icon: iconMap.icon_our_story,
			label: intl.formatMessage({
				id: `header__navItemStory`,
				defaultMessage: 'Our Story',
			}),
			children: [
				{
					key: 'about',
					href: makeAboutPage(languageRoute, 1),
					Icon: iconMap.fa_seedling,
					label: intl.formatMessage({
						id: `header__navItemStory`,
						defaultMessage: 'Our Story',
					}),
				},
				{
					key: 'meettheteam',
					href: makeAboutPage(languageRoute, 13),
					Icon: iconMap.fa_users_heavy,
					label: intl.formatMessage({
						id: `header__navItemStory-team`,
						defaultMessage: 'The Team',
					}),
				},
				{
					key: 'purpose',
					href: makeAboutPage(languageRoute, 7),
					Icon: iconMap.fa_bullseye_heavy,
					label: intl.formatMessage({
						id: `header__navItemStory-purpose`,
						defaultMessage: 'Our Purpose',
					}),
				},
				{
					key: 'spiritofav',
					href: makeAboutPage(languageRoute, 12),
					Icon: iconMap.fa_fire_heavy,
					label: intl.formatMessage({
						id: `header__navItemStory-spiritOfAudioVerse`,
						defaultMessage: 'Spirit of AudioVerse',
					}),
				},
				{
					key: 'blog',
					href: makeBlogPostListRoute(languageRoute),
					Icon: iconMap.fa_align_left,
					label: intl.formatMessage({
						id: `header__navItemStory-blog`,
						defaultMessage: 'Blog',
					}),
				},
				{
					key: 'testimonials',
					href: makeTestimoniesRoute(languageRoute),
					Icon: iconMap.fa_comment_heavy,
					label: intl.formatMessage({
						id: `header__navItemStory-testimonials`,
						defaultMessage: 'Testimonials',
					}),
				},
				{
					key: 'donate',
					href: makeDonateRoute(languageRoute),
					Icon: iconMap.fa_heart_heavy,
					label: intl.formatMessage({
						id: `header__navItemStory-donate`,
						defaultMessage: 'Donate',
					}),
				},
			],
		},
		{
			key: 'contact',
			href: makeContactRoute(languageRoute),
			Icon: iconMap.icon_contact,
			label: intl.formatMessage({
				id: `header__navItemContact`,
				defaultMessage: 'Contact',
			}),
			children: [
				{
					key: 'general',
					href: makeContactRoute(languageRoute, '/general'),
					Icon: iconMap.fa_inbox,
					label: intl.formatMessage({
						id: `header__navItemContact-general`,
						defaultMessage: 'General Contact',
					}),
				},
				{
					key: 'support',
					href: makeContactRoute(languageRoute, '/support'),
					Icon: iconMap.fa_comment_heavy,
					label: intl.formatMessage({
						id: `header__navItemContact-support`,
						defaultMessage: 'Request Support',
					}),
				},
				{
					key: 'testimony',
					href: makeTestimonySubmitRoute(languageRoute),
					Icon: iconMap.fa_comment_heavy,
					label: intl.formatMessage({
						id: `header__navItemContact-testimonial`,
						defaultMessage: 'Share Testimonial',
					}),
				},
				{
					key: 'divider',
					label: '',
					isDivider: true,
				},
				{
					key: 'facebook',
					href: 'https://www.facebook.com/AudioVerse',
					Icon: iconMap.fa_facebook,
					label: intl.formatMessage({
						id: `header__navItemContact-facebook`,
						defaultMessage: 'Facebook',
					}),
					isTargetBlank: true,
				},
				{
					key: 'instagram',
					href: 'https://www.instagram.com/audioverse/',
					Icon: iconMap.fa_instagram,
					label: intl.formatMessage({
						id: `header__navItemContact-instagram`,
						defaultMessage: 'Instagram',
					}),
					isTargetBlank: true,
				},
				{
					key: 'twitter',
					href: 'https://www.twitter.com/audioverse/',
					Icon: iconMap.fa_twitter,
					label: intl.formatMessage({
						id: `header__navItemContact-twitter`,
						defaultMessage: 'Twitter',
					}),
					isTargetBlank: true,
				},
				{
					key: 'youtube',
					href: 'https://www.youtube.com/user/AudioVerseMinistry',
					Icon: iconMap.fa_youtube,
					label: intl.formatMessage({
						id: `header__navItemContact-youtube`,
						defaultMessage: 'YouTube',
					}),
					isTargetBlank: true,
				},
			],
		},
		{
			key: 'more',
			Icon: iconMap.icon_more,
			label: intl.formatMessage({
				id: `header__navItemMore`,
				defaultMessage: 'More',
				description: `Header nav link name: More`,
			}),
			children: [
				{
					key: 'help',
					href: 'https://help.audioverse.org/',
					isTargetBlank: true,
					Icon: iconMap.fa_question_circle,
					label: intl.formatMessage({
						id: `header__navItemMore-help`,
						defaultMessage: 'Get Help',
					}),
				},
				{
					key: 'store',
					href: 'https://audioversestore.org',
					isTargetBlank: true,
					Icon: iconMap.fa_store,
					label: intl.formatMessage({
						id: `header__navItemMore-store`,
						defaultMessage: 'AudioVerse Store',
					}),
				},
				{
					key: 'ju',
					href: 'https://journeysunscripted.com/',
					isTargetBlank: true,
					Icon: iconMap.fa_link,
					label: intl.formatMessage({
						id: `header__navItemMore-ju`,
						defaultMessage: 'Journeys Unscripted',
					}),
				},
				{
					key: 'swj',
					href: 'https://startingwithjesus.com/',
					isTargetBlank: true,
					Icon: iconMap.fa_link,
					label: intl.formatMessage({
						id: `header__navItemMore-swj`,
						defaultMessage: 'Starting With Jesus',
					}),
				},
				{
					key: 'legal',
					href: makeAboutPage(languageRoute, 3),
					Icon: iconMap.fa_landmark_heavy,
					label: intl.formatMessage({
						id: `header__navItemMore-legal`,
						defaultMessage: 'Legal',
					}),
				},
				{
					key: 'privacy',
					href: makeAboutPage(languageRoute, 4),
					Icon: iconMap.fa_lock_heavy,
					label: intl.formatMessage({
						id: `header__navItemMore-privacy`,
						defaultMessage: 'Privacy',
					}),
				},
				{
					key: 'terms',
					href: makeAboutPage(languageRoute, 5),
					Icon: iconMap.fa_newspaper_heavy,
					label: intl.formatMessage({
						id: `header__navItemMore-terms`,
						defaultMessage: 'Terms of Use',
					}),
				},
			],
			childNode: (
				<>
					<li>
						<LanguageButton
							buttonType="secondary"
							onClick={(url) => router.push(`/${url}/`)}
						/>
					</li>
					<li>
						<DownloadAppButton
							buttonType="secondary"
							menuAlignment="left"
							id="useNavigationItems-downloadApp"
						/>
					</li>
				</>
			),
		},
		{
			key: 'account',
			label: intl.formatMessage({
				id: `header__navItemUser`,
				defaultMessage: 'User Settings',
				description: `Header nav link name: User Settings`,
			}),
			children: [
				{
					key: 'profile',
					href: makeAccountProfileRoute(languageRoute),
					Icon: iconMap.fa_user_heavy,
					label: intl.formatMessage({
						id: `header__navItemUser-profile`,
						defaultMessage: 'Profile',
					}),
				},
				{
					key: 'logout',
					href: makeLogoutRoute(languageRoute),
					onClick: ({ popSubmenu }) => popSubmenu(),
					Icon: iconMap.icon_sign_out,
					label: intl.formatMessage({
						id: `header__navItemUser-logout`,
						defaultMessage: 'Log Out',
					}),
				},
			],
		},
	];
}
