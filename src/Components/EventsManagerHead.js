import React, { PureComponent } from 'react';
import { TableHead, TableRow } from '@material-ui/core';
import CenteredTableCell from '../Styled_Components/CenteredTableCell';

export default class EventsManagerHead extends PureComponent {
  render() {
    const {
      props: { titles }
    } = this;
    return (
      <TableHead>
        <TableRow>
          {titles.map((x, i) => (
            <CenteredTableCell key={`${i}.${x}`}>{x}</CenteredTableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
}
