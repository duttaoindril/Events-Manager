import React, { PureComponent } from 'react';
import {
  Button,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions,
  TableRow,
  Table,
  TableBody
} from '@material-ui/core';
import LiteTableCell from '../Styled_Components/LiteTableCell';

export default class Panel extends PureComponent {
  capt = str => str[0].toUpperCase() + str.slice(1);
  dateToDate = str =>
    new Date(str)
      .toDateString()
      .split(' ')
      .slice(0, -1)
      .join(' ');
  dateToTime = str => new Date(str).toLocaleTimeString();
  dateToDateTime = str => new Date(str).toLocaleString();
  opening = async id => {
    const {
      props: { handleExpand }
    } = this;
    console.log(id);
    // await onOpen(id);
    handleExpand(`panel${id}`);
  };
  render() {
    const {
      props: {
        data: {
          id,
          name,
          status,
          official,
          description,
          end_date: endDate,
          start_date: startDate,
          created_date: createdDate,
          modified_date: lastEditedDate,
          participant_count: participants,
          guests_can_invite_others: openInvite
        },
        action,
        handleExpand,
        currentExpanded
      },
      capt,
      opening,
      dateToDate,
      dateToTime,
      dateToDateTime
    } = this;
    return (
      <ExpansionPanel
        expanded={`panel${id}` === currentExpanded}
        onChange={() => opening(id)}>
        <ExpansionPanelSummary>
          <Table>
            <TableBody>
              <TableRow>
                <LiteTableCell>{capt(name)}</LiteTableCell>
                <LiteTableCell>{dateToDate(startDate)}</LiteTableCell>
                <LiteTableCell>{dateToDate(endDate)}</LiteTableCell>
                <LiteTableCell>{parseInt(participants)}</LiteTableCell>
                <LiteTableCell>{capt(openInvite ? 'yes' : 'no')}</LiteTableCell>
                <LiteTableCell>{capt(official ? 'yes' : 'no')}</LiteTableCell>
                <LiteTableCell>{capt(status)}</LiteTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Table>
            <TableBody>
              <TableRow>
                <LiteTableCell>Description: {capt(description)}</LiteTableCell>
                <LiteTableCell>
                  Start Date and Time: {dateToDateTime(startDate)}
                </LiteTableCell>
                <LiteTableCell>
                  End Date and Time: {dateToDateTime(endDate)}
                </LiteTableCell>
                <LiteTableCell>
                  Created Date and Time: {dateToDate(createdDate)}
                </LiteTableCell>
                <LiteTableCell>
                  Last Modified Date and Time: {dateToTime(lastEditedDate)}
                </LiteTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Button
            size="small"
            color="primary"
            onClick={() => handleExpand(null)}>
            Cancel
          </Button>
          <Button size="small" color="secondary" onClick={() => action(id)}>
            Attend
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}
