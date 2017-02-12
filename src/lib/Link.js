import Dbind from 'dbind';
import { capture } from 'dbind-router-base';

export default Dbind.createClass({
  didMount() {
    capture(this.refs.link);
  },
  template: `
    <a ref="link" href="{{ to }}">
      {{ value }}
    </a>
  `
});