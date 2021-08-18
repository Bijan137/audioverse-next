import CardPost from '@components/molecules/cardPost';
import { buildRenderer } from '@lib/test/helpers';

const renderComponent = buildRenderer(CardPost);

describe('card post', () => {
	it('does not display zero rounded down duration', async () => {
		const { queryByText } = await renderComponent({
			props: {
				post: {
					readingDuration: 10,
					canonicalPath: 'the_path',
				},
			},
		});

		expect(queryByText('0m')).not.toBeInTheDocument();
	});

	it('links hero', async () => {
		const { getByAltText } = await renderComponent({
			props: {
				post: {
					title: 'the_title',
					canonicalPath: 'the_path',
					image: {
						url: 'the_image_url',
					},
				},
			},
		});

		expect(getByAltText('the_title').parentElement).toHaveAttribute(
			'href',
			'/the_path'
		);
	});
});
