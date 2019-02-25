import React, { PureComponent } from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

export default class AppToolBar extends PureComponent {
  render() {
    const {
      props: { title }
    } = this;
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}
