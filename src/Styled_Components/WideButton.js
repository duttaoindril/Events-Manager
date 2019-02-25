import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const WideButton = withStyles({
  root: {
    width: 'calc(100% - 40px)',
    margin: '20px 20px 6px 20px'
  }
})(Button);

export default WideButton;
