import { act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';
import Cookie from 'js-cookie';
import { __setFacebookResponse } from 'react-facebook-login/dist/facebook-login-render-props';

import { fetchApi } from '@lib/api/fetchApi';
import {
	RegisterDocument,
	RegisterSocialDocument,
} from '@lib/generated/graphql';
import { sleep } from '@lib/sleep';
import { buildRenderer } from '@lib/test/buildRenderer';
import Register from '@pages/[language]/account/register';

jest.mock('js-cookie');
jest.mock('react-google-login');

const renderPage = buildRenderer(Register);

const router = { push: () => jest.fn().mockResolvedValue(true) } as any;

describe('register page', () => {
	beforeEach(() => {
		Cookie.get = jest.fn().mockReturnValue({});
	});

	it('renders', async () => {
		await renderPage({ router });
	});

	it('renders email field', async () => {
		const { getByPlaceholderText } = await renderPage({ router });

		expect(getByPlaceholderText('jane@example.com')).toBeInTheDocument();
	});

	it('renders password field', async () => {
		const { getByPlaceholderText } = await renderPage({ router });

		expect(getByPlaceholderText('∗∗∗∗∗∗∗')).toBeInTheDocument();
	});

	it('renders sign up button', async () => {
		const { getByText } = await renderPage({ router });

		expect(getByText('Sign up')).toBeInTheDocument();
	});

	it('resets errors on click', async () => {
		const { getByText, getByPlaceholderText, queryByText } = await renderPage({
			router,
		});

		userEvent.click(getByText('Sign up'));

		userEvent.type(getByPlaceholderText('∗∗∗∗∗∗∗'), 'pass');

		userEvent.click(getByText('Sign up'));

		expect(queryByText('please type password twice')).not.toBeInTheDocument();
	});

	it('renders missing email error', async () => {
		const { getByText } = await renderPage({ router });

		userEvent.click(getByText('Sign up'));

		expect(getByText('email is required')).toBeInTheDocument();
	});

	it('registers user', async () => {
		const { getByText, getByPlaceholderText } = await renderPage({ router });

		userEvent.type(getByPlaceholderText('Jane'), 'Matthew');
		userEvent.type(getByPlaceholderText('Doe'), 'Leffler');
		userEvent.type(getByPlaceholderText('jane@example.com'), 'email');
		userEvent.type(getByPlaceholderText('∗∗∗∗∗∗∗'), 'pass');

		userEvent.click(getByText('Sign up'));

		await waitFor(() => {
			expect(fetchApi).toBeCalledWith(RegisterDocument, {
				variables: {
					email: 'email',
					password: 'pass',
					firstName: 'Matthew',
					lastName: 'Leffler',
				},
			});
		});
	});

	it('displays loading state', async () => {
		const { getByText, getByPlaceholderText } = await renderPage({ router });

		userEvent.type(getByPlaceholderText('jane@example.com'), 'email');
		userEvent.type(getByPlaceholderText('∗∗∗∗∗∗∗'), 'pass');

		userEvent.click(getByText('Sign up'));

		await waitFor(() => {
			expect(getByText('loading...')).toBeInTheDocument();
		});
	});

	it('displays returned errors', async () => {
		when(fetchApi)
			.calledWith(RegisterDocument, expect.anything())
			.mockResolvedValue({
				signup: {
					errors: [
						{
							message: 'the_error_message',
						},
					],
				},
			});

		const { getByText, getByPlaceholderText } = await renderPage({ router });

		userEvent.type(getByPlaceholderText('jane@example.com'), 'email');
		userEvent.type(getByPlaceholderText('∗∗∗∗∗∗∗'), 'pass');

		userEvent.click(getByText('Sign up'));

		await waitFor(() => {
			expect(getByText('the_error_message')).toBeInTheDocument();
		});
	});

	it('displays success message', async () => {
		const { getByText, getByPlaceholderText } = await renderPage({ router });

		userEvent.type(getByPlaceholderText('jane@example.com'), 'email');
		userEvent.type(getByPlaceholderText('∗∗∗∗∗∗∗'), 'pass');

		userEvent.click(getByText('Sign up'));

		await waitFor(() => {
			expect(getByText('loading...')).toBeInTheDocument();
		});
	});

	it('renders continue with Facebook', async () => {
		const { getByText } = await renderPage({ router });

		expect(getByText('Sign up with Facebook')).toBeInTheDocument();
	});

	it('renders continue with Google', async () => {
		const { getByText } = await renderPage({ router });

		expect(getByText('Sign up with Google')).toBeInTheDocument();
	});

	it('renders google signon errors', async () => {
		when(fetchApi)
			.calledWith(RegisterSocialDocument, expect.anything())
			.mockResolvedValue({
				loginSocial: {
					errors: [
						{
							message: 'the_error_message',
						},
					],
				},
			});

		const { getByText } = await renderPage({ router });

		userEvent.click(getByText('Sign up with Google'));

		await waitFor(() => {
			expect(getByText('the_error_message')).toBeInTheDocument();
		});
	});

	it('renders facebook signon errors', async () => {
		when(fetchApi)
			.calledWith(RegisterSocialDocument, expect.anything())
			.mockResolvedValue({
				loginSocial: {
					errors: [
						{
							message: 'the_error_message',
						},
					],
				},
			});

		const { getByText } = await renderPage({ router });

		userEvent.click(getByText('Sign up with Facebook'));

		await waitFor(() => {
			expect(getByText('the_error_message')).toBeInTheDocument();
		});
	});

	it('renders social login success', async () => {
		const { getByText } = await renderPage({ router });

		userEvent.click(getByText('Sign up with Facebook'));

		await waitFor(() => {
			expect(getByText('success')).toBeInTheDocument();
		});
	});

	it('hits api with facebook registration', async () => {
		const { getByText } = await renderPage({ router });

		userEvent.click(getByText('Sign up with Facebook'));

		await waitFor(() => {
			expect(fetchApi).toBeCalledWith(RegisterSocialDocument, {
				variables: {
					socialId: 'the_user_id',
					socialName: 'FACEBOOK',
					socialToken: 'the_access_token',
					givenName: 'First',
					surname: 'Last',
				},
			});
		});
	});

	it('saves facebook login session token', async () => {
		when(fetchApi)
			.calledWith(RegisterSocialDocument, expect.anything())
			.mockResolvedValue({
				loginSocial: {
					authenticatedUser: {
						sessionToken: 'the_token',
					},
				},
			});

		const { getByText } = await renderPage({ router });

		userEvent.click(getByText('Sign up with Facebook'));

		await waitFor(() => {
			expect(Cookie.set).toBeCalledWith('avSession', 'the_token', {
				expires: 14,
			});
		});
	});

	it('does not register failed login', async () => {
		await act(async () => {
			__setFacebookResponse({
				status: 300,
			});

			const { getByText } = await renderPage({ router });

			await waitFor(() => {
				expect(getByText('Sign up with Facebook')).toBeInTheDocument();
			});

			userEvent.click(getByText('Sign up with Facebook'));

			await sleep();

			expect(fetchApi).not.toBeCalledWith(
				RegisterSocialDocument,
				expect.anything()
			);
		});
	});

	it('displays facebook login error', async () => {
		__setFacebookResponse({
			status: 300,
			statusText: 'FAILED',
		});

		const { getByText } = await renderPage({ router });

		userEvent.click(getByText('Sign up with Facebook'));

		await waitFor(() => {
			expect(getByText('300: FAILED')).toBeInTheDocument();
		});
	});

	it('does not display form if user logged in', async () => {
		Cookie.get = jest.fn().mockReturnValue({ avSession: 'abc123' });

		const { queryByPlaceholderText } = await renderPage({ router });

		expect(queryByPlaceholderText('email')).not.toBeInTheDocument();
	});

	it('sends Google login data to API', async () => {
		const { getByText } = await renderPage({ router });

		userEvent.click(getByText('Sign up with Google'));

		await waitFor(() => {
			expect(fetchApi).toBeCalledWith(RegisterSocialDocument, {
				variables: {
					socialId: 'the_user_id',
					socialName: 'GOOGLE',
					socialToken: 'the_access_token',
					givenName: 'First',
					surname: 'Last',
				},
			});
		});
	});

	it('pops modal on guest info click', async () => {
		const { getByText, getByTestId } = await renderPage();

		userEvent.click(getByTestId('guest-info-button'));

		expect(getByText('Continue as guest?')).toBeInTheDocument();
	});
});

// link to login form on registration success
// doesn't attempt facebook login if login failed
// convert to dumb static page (not generated)
// display google client failure errors
