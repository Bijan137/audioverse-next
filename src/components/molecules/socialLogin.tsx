import Cookie from 'js-cookie';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import { useGoogleLogin } from 'react-google-login';
import { FormattedMessage } from 'react-intl';

import { FACEBOOK_APP_ID, GOOGLE_CLIENT_ID } from '@lib/constants';
import {
	useRegisterSocialMutation,
	UserSocialServiceName,
} from '@lib/generated/graphql';

export default function SocialLogin(): JSX.Element {
	const [errors, setErrors] = useState<string[]>([]);

	const {
		mutate: mutateSocial,
		data: dataSocial,
		isSuccess: isSuccessSocial,
	} = useRegisterSocialMutation();

	const { signIn } = useGoogleLogin({
		clientId: GOOGLE_CLIENT_ID,
		onFailure: (error) => {
			console.log('Google oAuth error');
			console.log(error);
			// TODO: Figure out error format and display it
		},
		onSuccess: (response) => {
			const socialId = _.get(response, 'googleId');
			const socialToken = _.get(response, 'accessToken');
			const givenName = _.get(response, 'profileObj.givenName');
			const surname = _.get(response, 'profileObj.familyName');

			mutateSocial({
				socialName: UserSocialServiceName.Google,
				socialId,
				socialToken,
				givenName,
				surname,
			});
		},
	});

	useEffect(() => {
		const errors = dataSocial?.loginSocial.errors || [];
		const token = dataSocial?.loginSocial.authenticatedUser?.sessionToken;

		if (errors.length) {
			setErrors(errors.map((e) => e.message));
		}

		if (token) {
			Cookie.set('avSession', token);
		}
	}, [dataSocial]);

	if (isSuccessSocial && !errors.length) {
		return (
			<p>
				<FormattedMessage
					id={'socialLogin__successMessage'}
					defaultMessage={'success'}
					description={'social login success message'}
				/>
			</p>
		);
	}

	return (
		<>
			<ul>
				{errors.map((e) => (
					<li key={e}>{e}</li>
				))}
			</ul>

			<FacebookLogin
				appId={FACEBOOK_APP_ID}
				textButton={'continue with Facebook'}
				callback={(response) => {
					const name = _.get(response, 'name', '');
					const [givenName, surname] = name.split(' ');
					const socialId = _.get(response, 'userID');
					const socialToken = _.get(response, 'accessToken');
					const status = _.get(response, 'status');

					if (!socialToken) {
						if (status) {
							setErrors([status]);
						}
						return;
					}

					mutateSocial({
						socialName: UserSocialServiceName.Facebook,
						socialId,
						socialToken,
						givenName,
						surname,
					});
				}}
			/>

			<button onClick={signIn}>continue with Google</button>
		</>
	);
}
