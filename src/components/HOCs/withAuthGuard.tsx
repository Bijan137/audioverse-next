import React from 'react';

import Login from '@components/molecules/login';
import { getCurrentRequest } from '@lib/api';
import { getSessionToken } from '@lib/cookies';
import { useGetWithAuthGuardDataQuery } from '@lib/generated/graphql';

function withAuthGuard<P>(
	Component: React.ComponentType<P>,
	LoggedOutComponent: React.ComponentType = Login
): React.ComponentType<P> {
	return (props: P) => {
		const sessionToken = getSessionToken(getCurrentRequest());
		const { data, isLoading } = useGetWithAuthGuardDataQuery(
			{},
			{ retry: false }
		);
		const isUserLoggedIn = !!data?.me?.user.email;

		return (sessionToken && isLoading) || isUserLoggedIn ? (
			<Component {...props} />
		) : (
			<LoggedOutComponent />
		);
	};
}

export default withAuthGuard;
