import React, { Component, Fragment } from 'react';
import ListWrapper from '../Styled_Components/ListWrapper';
import Accordion from '../Components/Accordion';
import EventsManagerHead from '../Components/EventsManagerHead';
import LoadMoreEventsButton from '../Components/LoadMoreEventsButton';

export default class EventsManager extends Component {
  render() {
    const {
      props: {
        data,
        loading,
        moreToLoad,
        attendEvent,
        loadMoreEvents,
        getEventDetails
      }
    } = this;
    return (
      <Fragment>
        <EventsManagerHead
          titles={[
            'Name',
            'Start Date',
            'End Date',
            'Participants',
            'Open Invite',
            'Official',
            'Status'
          ]}
          loading={loading}
        />
        <ListWrapper>
          <Accordion
            data={data}
            attendEvent={attendEvent}
            getEventDetails={getEventDetails}
          />
          {moreToLoad && (
            <LoadMoreEventsButton
              title={`Load More Events`}
              action={loadMoreEvents}
            />
          )}
        </ListWrapper>
      </Fragment>
    );
  }
}
