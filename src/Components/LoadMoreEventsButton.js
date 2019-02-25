import React, { PureComponent } from 'react';
import { Typography, TableFooter, TableRow } from '@material-ui/core';
import WideButton from '../Styled_Components/WideButton';

export default class LoadMoreEventsButton extends PureComponent {
  render() {
    const {
      props: { action: loadMoreEvents, title }
    } = this;
    return (
      <TableFooter>
        <TableRow>
          <td colSpan={7}>
            <WideButton
              size="large"
              variant="outlined"
              color="secondary"
              onClick={loadMoreEvents}>
              <Typography variant="h6" color="textPrimary">
                {title}
              </Typography>
            </WideButton>
          </td>
        </TableRow>
      </TableFooter>
    );
  }
}
