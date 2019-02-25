import React, { Component, Fragment } from 'react';
import { TableBody, TableRow, LinearProgress } from '@material-ui/core';
import Panel from './Panel';

export default class Accordion extends Component {
  state = { expanded: null };

  handleChange = panel => {
    this.setState(prevState => ({
      expanded: prevState.expanded === panel ? null : panel
    }));
  };

  render() {
    const {
      props: {
        data: { events, locations, attendance },
        loading,
        attendEvent,
        getEventDetails
      },
      state: { expanded },
      handleChange
    } = this;
    return (
      <TableBody>
        <Fragment>
          <TableRow style={{ height: 'auto' }}>
            <td colSpan={7}>
              <LinearProgress
                color="secondary"
                style={{ visibility: loading ? 'visible' : 'hidden' }}
              />
            </td>
          </TableRow>
          {Object.values(events)
            .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
            .map((x, i) => (
              <Panel
                data={{
                  ...x,
                  ...locations[x.id],
                  attendance: attendance[x.id]
                }}
                key={x.id}
                action={attendEvent}
                onOpen={getEventDetails}
                currentExpanded={expanded}
                handleExpand={panel => handleChange(panel)}
                hasLocationData={!!locations[x.id]}
              />
            ))}
        </Fragment>
      </TableBody>
    );
  }
}
