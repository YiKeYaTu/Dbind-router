'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dbind = require('dbind');

var _dbind2 = _interopRequireDefault(_dbind);

var _dbindRouterBase = require('dbind-router-base');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _dbind2.default.createClass({
  willMount: function willMount() {
    var routeConfig = this.props.routeConfig;
    var rootPath = this.props.rootPath;
    if (!routeConfig) throw new TypeError('You should hava a routeConfig props for router to control route');
    if (!rootPath) throw new TypeError('');

    (0, _dbindRouterBase.setRootLocation)(rootPath);
    var Route = new _dbindRouterBase.Router();
    this.handlePath(routeConfig, Route, [], 0);
  },
  handlePath: function handlePath(routeConfig, Route, target, index) {
    var _this = this;

    var component = routeConfig.component;
    var path = routeConfig.path;
    var redirect = routeConfig.redirect;
    var onCb = routeConfig.on;
    var leaveCb = routeConfig.leave;
    Route = Route.route(routeConfig.path, function (next) {
      if (redirect) {
        redirect({}, redirect);
      } else {
        target[index] = component;
        onCb && onCb();
        if (!next()) {
          this.trackingUpdate({
            componentInf: this.arrayToTree(target, index)
          });
        }
      }
    }.bind(this));

    if (routeConfig.children) {
      routeConfig.children.forEach(function (children) {
        _this.handlePath(children, Route, target, index + 1);
      });
    }
  },
  arrayToTree: function arrayToTree(array, end) {
    var tree = {};
    var p = tree;
    for (var i = 0; i <= end; i++) {
      p.component = array[i];
      p.children = i !== end && array[i + 1] || null;
      p = p.children;
    }
    return tree;
  },

  data: {
    componentInf: {}
  },
  template: '\n    <component data-from="componentInf.component" children="{{ componentInf.children || {} }}"></component>\n  '
});