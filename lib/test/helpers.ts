import { ParsedUrlQuery } from 'querystring';

import * as router from 'next/router';
import { NextRouter } from 'next/router';

import * as api from '@lib/api';

export function loadTestimonies(nodes: Testimony[] | null = null): void {
	jest.spyOn(api, 'getTestimonies').mockResolvedValue({
		nodes: nodes || [
			{
				author: 'the_testimony_author',
				body: 'the_testimony_body',
				writtenDate: 'the_testimony_date',
			},
		],
		aggregate: {
			count: 1,
		},
	});
}

export function loadQuery(query: ParsedUrlQuery = {}): void {
	jest.spyOn(router, 'useRouter').mockReturnValue(({
		query,
	} as Partial<NextRouter>) as any);
}
