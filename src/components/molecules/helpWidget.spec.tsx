import { act, screen, waitFor } from '@testing-library/react';
import { when } from 'jest-when';
import { __loadRouter } from 'next/router';
import Script from 'next/script';

import HelpWidget from '@components/molecules/helpWidget';
import { fetchApi } from '@lib/api/fetchApi';
import { GetHelpWidgetDataDocument } from '@lib/generated/graphql';
import getBeacon from '@lib/getBeacon';
import { buildRenderer } from '@lib/test/buildRenderer';

jest.mock('next/script');

const renderComponent = buildRenderer(HelpWidget);

const mockGetBeacon = getBeacon as jest.Mock;
const mockBeacon = jest.fn() as jest.Mock;

function loadData() {
	when(fetchApi)
		.calledWith(GetHelpWidgetDataDocument, expect.anything())
		.mockResolvedValue({
			me: {
				user: {
					name: 'the_name',
					email: 'the_email',
					image: {
						url: 'the_image_url',
					},
				},
			},
		});
}

describe('help widget', () => {
	beforeEach(() => {
		mockGetBeacon.mockReturnValue(mockBeacon);
	});

	it('opens widget on click', async () => {
		await renderComponent();

		const button = await screen.findByRole('button');

		button.click();

		await waitFor(() => {
			expect(mockBeacon).toBeCalledWith('open');
		});
	});

	it('closes widget on second click', async () => {
		await renderComponent();

		const button = screen.getByRole('button');
		button.click();
		button.click();

		expect(mockBeacon).toBeCalledWith('close');
	});

	it('catches widget close event', async () => {
		await renderComponent();

		const button = screen.getByRole('button');
		button.click();

		await waitFor(() => {
			expect(mockBeacon).toBeCalledWith('on', 'close', expect.any(Function));
		});

		await act(async () => {
			mockBeacon.mock.calls[0][2]();
		});

		button.click();

		expect(mockBeacon).not.toBeCalledWith('close');
	});

	it('unsubscribes using specific callback', async () => {
		const { unmount } = await renderComponent();

		unmount();

		expect(mockBeacon).toBeCalledWith('off', 'close', expect.any(Function));
	});

	it('identifies user', async () => {
		loadData();

		await renderComponent();

		await waitFor(() => {
			expect(mockBeacon).toBeCalledWith('identify', {
				name: 'the_name',
				email: 'the_email',
			});
		});
	});

	it('registers page views with beacon', async () => {
		const router = __loadRouter();

		await renderComponent();

		const calls = (router.events.on as jest.Mock).mock.calls;

		await waitFor(() => {
			expect(router.events.on).toBeCalled();
		});

		const callback = calls[0][1];

		window.document.title = 'the_title';

		callback('the_url');

		expect(mockBeacon).toBeCalledWith('event', {
			type: 'page-viewed',
			url: 'the_url',
			title: 'the_title',
		});
	});

	it('unregisters route change listener on unmount', async () => {
		const router = __loadRouter();

		await renderComponent();

		await waitFor(() => {
			expect(router.events.on).toBeCalled();
		});

		const { unmount } = await renderComponent();

		unmount();

		expect(router.events.off).toBeCalledWith(
			'routeChangeComplete',
			expect.any(Function)
		);
	});

	it('handles unset beacon', async () => {
		mockGetBeacon.mockReturnValue(undefined);

		await expect(renderComponent()).resolves.not.toThrow();
	});

	it('renders script to load beacon', async () => {
		mockGetBeacon.mockReturnValue(undefined);

		await renderComponent();

		expect(Script).toBeCalledWith(
			expect.objectContaining({
				id: 'beaconOnLoad',
			}),
			expect.anything()
		);
	});
});
