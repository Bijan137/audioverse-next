import React from 'react';

import Pagination from '@components/molecules/pagination';
import RecordingList from '@components/molecules/recordingList';
import withFailStates from '@components/templates/withFailStates';

function SermonList({ sermons, pagination }) {
	return (
		<div>
			<RecordingList sermons={sermons} />
			<Pagination current={pagination.current} total={pagination.total} base={'/en/sermons'} />
		</div>
	);
}

const should404 = (props) => !props.sermons?.length;

export default withFailStates(SermonList, should404);
