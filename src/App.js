import React, { Component, Fragment } from 'react';
import AppToolBar from './Components/AppToolBar';
import EventsManager from './Components/EventsManager';
import './App.css';

export default class App extends Component {
  state = {
    title: 'Events Nearby',
    itemCount: 10,
    nextPage: 1,
    maxPages: 1,
    moreToLoad: true,
    baseURL: '',
    loading: false,
    data: {
      events: {},
      eventPages: {},
      locations: {},
      attendance: {}
    }
  };

  makeNetworkRequest = async url => {
    const {
      state: { baseURL }
    } = this;
    this.setState({
      loading: true
    });
    const response = await fetch(`${baseURL}${url}`);
    const json = await response.json();
    return json;
  };

  cacheLocation = async id => {
    const { makeNetworkRequest } = this;
    const json = await makeNetworkRequest(`/locations/${id}`);
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        locations: {
          ...prevState.data.locations,
          [id]: json.data
        }
      },
      loading: false
    }));
  };

  cacheEvent = async id => {
    const { makeNetworkRequest } = this;
    const json = await makeNetworkRequest(`/events/${id}`);
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        events: {
          ...prevState.data.events,
          [id]: {
            ...json.data,
            page: prevState.data.events[id].page
          }
        }
      },
      loading: false
    }));
  };

  cacheEventPage = async page => {
    const {
      state: { itemCount },
      makeNetworkRequest
    } = this;
    const json = await makeNetworkRequest(
      `/events?limit=${itemCount}&page=${page}`
    );
    const events = json.data.reduce((accumulator, current) => {
      current.page = page;
      accumulator[current.id] = current;
      return accumulator;
    }, {});
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        events: {
          ...prevState.data.events,
          ...events
        },
        eventPages: {
          ...prevState.data.eventPages,
          [page]: true
        }
      },
      maxPages: json.maxPages,
      loading: false
    }));
  };

  getNextPageOfEvents = async (e, ...others) => {
    const {
      state: { nextPage },
      cacheEventPage
    } = this;
    if (this.state.data.eventPages[nextPage]) return;
    await cacheEventPage(nextPage);
    this.setState(prevState => ({
      nextPage: prevState.maxPages > nextPage ? nextPage + 1 : nextPage,
      moreToLoad: prevState.maxPages > nextPage
    }));
  };

  getEventLocation = async id => {
    const {
      state: {
        data: { locations }
      },
      cacheLocation
    } = this;
    if (locations[id]) return;
    await cacheLocation(id);
  };

  postAttendanceOfEvent = async id => {
    const { cacheEvent, cacheLocation, makeNetworkRequest } = this;
    const json = await makeNetworkRequest(`/events/attend/${id}`);
    console.log(json);
    if (json.success) {
      await cacheEvent(id);
      await cacheLocation(id);
      this.setState(prevState => ({
        data: {
          ...prevState.data,
          attendance: {
            ...prevState.data.attendance,
            [id]: true
          }
        },
        loading: false
      }));
    } else {
      this.setState({
        loading: false
      });
    }
  };

  async componentDidMount() {
    await this.getNextPageOfEvents();
  }

  render() {
    const {
      state: { title, moreToLoad, itemCount, data, loading },
      postAttendanceOfEvent,
      getNextPageOfEvents,
      getEventLocation
    } = this;
    return (
      <Fragment>
        <AppToolBar title={title} />
        <EventsManager
          data={data}
          limit={itemCount}
          loading={loading}
          moreToLoad={moreToLoad}
          getEventDetails={getEventLocation}
          attendEvent={postAttendanceOfEvent}
          loadMoreEvents={getNextPageOfEvents}
        />
      </Fragment>
    );
  }
}
