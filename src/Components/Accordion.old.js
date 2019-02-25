import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Panel from './Panel';

export default class Accordion extends Component {
  state = { expanded: null };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };

  render() {
    const {
      props: {
        data: { events, locations },
        attendEvent,
        getEventDetails
      },
      state: { expanded },
      handleChange
    } = this;
    return Object.values(events).map((x, i) => (
      <Panel
        data={{
          ...x,
          ...locations[x.id]
        }}
        key={x.id}
        action={attendEvent}
        onOpen={getEventDetails}
        currentExpanded={expanded}
        handleExpand={handleChange}
        hasLocationData={!!locations[x.id]}
      />
    ));
  }
}
