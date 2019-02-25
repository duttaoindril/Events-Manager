import { withStyles } from '@material-ui/core/styles';
import { TableCell } from '@material-ui/core';

const CenteredTableCell = withStyles({
  root: {
    textAlign: 'center'
  }
})(TableCell);

export default CenteredTableCell;
