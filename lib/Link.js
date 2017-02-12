'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dbind = require('dbind');

var _dbind2 = _interopRequireDefault(_dbind);

var _dbindRouterBase = require('dbind-router-base');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _dbind2.default.createClass({
  didMount: function didMount() {
    (0, _dbindRouterBase.capture)(this.refs.link);
  },

  template: '\n    <a ref="link" href="{{ to }}">\n      {{ value }}\n    </a>\n  '
});