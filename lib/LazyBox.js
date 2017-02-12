'use strict';

var _dbind = require('dbind');

var _dbind2 = _interopRequireDefault(_dbind);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import fetch from 'fetch';

var LazyBox = _dbind2.default.createClass({
  keepProps: ['loadingComponent', 'loadPath'],
  didMount: function didMount() {
    var loadPath = props.loadPath;
    if (!loadPath) throw new TypeError('You should set load-path props for this component');
    fetch(loadPath).then(function (res) {});
  },
  getPropsStr: function getPropsStr(props) {
    var propsStr = '';
    for (var key in props) {
      if (this.keepProps.indexOf(key) === -1) propsStr += key + '="' + props[key] + '" ';
    }
    return propsStr;
  },

  data: {
    component: null,
    props: null
  },
  template: function template() {
    var props = this.props;

    var loadingComponent = props.loadingComponent || null;

    this.data.component = loadingComponent;

    var propsStr = this.getPropsStr(props);

    return '<component data-from="component" ' + propsStr + '></component>';
  }
});