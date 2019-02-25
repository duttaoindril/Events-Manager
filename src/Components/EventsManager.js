import React, { Component } from 'react';
import { Table } from '@material-ui/core';
import Accordion from '../Components/Accordion';
import ListWrapper from '../Styled_Components/ListWrapper';
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
      <ListWrapper>
        <Table>
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
          />
          <Accordion
            data={data}
            loading={loading}
            attendEvent={attendEvent}
            getEventDetails={getEventDetails}
          />
          {moreToLoad && (
            <LoadMoreEventsButton
              title={`Load More Events`}
              action={loadMoreEvents}
            />
          )}
        </Table>
      </ListWrapper>
    );
  }
}
