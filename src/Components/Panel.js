import React, { PureComponent, Fragment } from 'react';
import { Collapse, TableRow, Divider, Button, Paper } from '@material-ui/core';
import CenteredTableCell from '../Styled_Components/CenteredTableCell';

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
      props: { handleExpand, onOpen }
    } = this;
    await onOpen(id);
    handleExpand(`panel${id}`);
  };
  render() {
    const {
      props: {
        data: {
          id,
          name,
          city,
          state,
          status,
          country,
          address1,
          address2,
          official,
          latitude,
          longitude,
          attendance,
          postal_code,
          description,
          host_given_name,
          spaces_remaining,
          end_date: endDate,
          contact_given_name,
          start_date: startDate,
          number_spaces_remaining,
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
      <Fragment>
        <TableRow
          hover
          style={{ cursor: 'pointer' }}
          onClick={() => opening(id)}>
          <CenteredTableCell>{capt(name)}</CenteredTableCell>
          <CenteredTableCell>{dateToDate(startDate)}</CenteredTableCell>
          <CenteredTableCell>{dateToDate(endDate)}</CenteredTableCell>
          <CenteredTableCell>{parseInt(participants)}</CenteredTableCell>
          <CenteredTableCell>
            {capt(openInvite ? 'yes' : 'no')}
          </CenteredTableCell>
          <CenteredTableCell>{capt(official ? 'yes' : 'no')}</CenteredTableCell>
          <CenteredTableCell>{capt(status)}</CenteredTableCell>
        </TableRow>
        <TableRow
          style={{
            display: `panel${id}` === currentExpanded ? 'table-row' : 'none'
          }}>
          <td colSpan={7}>
            <Collapse
              in={`panel${id}` === currentExpanded}
              collapsedHeight={'0px'}
              timeout={'auto'}
              unmountOnExit>
              <Paper
                style={{
                  margin: '20px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                {(host_given_name || contact_given_name) && (
                  <p>{`Hosted by ${capt(
                    host_given_name || contact_given_name
                  )}`}</p>
                )}
                <p>Description: {capt(description)}</p>
                <p>Start Date and Time: {dateToDateTime(startDate)}</p>
                <p>End Date and Time: {dateToDateTime(endDate)}</p>
                <p>Created Date and Time: {dateToDate(createdDate)}</p>
                <p>Last Modified Date and Time: {dateToTime(lastEditedDate)}</p>
                <p>
                  Empty Spots Left:
                  {spaces_remaining
                    ? ` Yes${
                        number_spaces_remaining
                          ? `, around ${number_spaces_remaining} spots left.`
                          : ''
                      }`
                    : ` No`}
                </p>
                <p>
                  Address:
                  {` ${address1}, ${address2} ${city}, ${state}, ${postal_code}, ${country}`}
                </p>
                {latitude && longitude && (
                  <Fragment>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://www.google.com/maps/@${latitude},${longitude},17.5z`}>
                      Google Maps Link to Address
                    </a>
                    <br />
                    <br />
                  </Fragment>
                )}
                <Divider />
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleExpand(null)}>
                  Cancel
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  disabled={!spaces_remaining || attendance}
                  onClick={() => action(id)}>
                  {attendance ? 'Attending' : 'Attend'}
                </Button>
              </Paper>
            </Collapse>
          </td>
        </TableRow>
      </Fragment>
    );
  }
}
