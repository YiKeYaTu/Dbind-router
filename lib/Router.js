'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dbind = require('dbind');

var _dbind2 = _interopRequireDefault(_dbind);

var _dbindRouterBase = require('dbind-router-base');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _dbind2.default.createClass({
  keepProps: ['rootPath', 'routeConfig'],
  willMount: function willMount() {
    var _this = this;

    var routeConfig = this.props.routeConfig;
    var rootPath = this.props.rootPath;
    if (!routeConfig) throw new TypeError('You should hava a routeConfig props for router to control route');
    if (!rootPath) throw new TypeError('');

    (0, _dbindRouterBase.setRootLocation)(rootPath);
    var Route = new _dbindRouterBase.Router();
    if (Object.prototype.toString.call(routeConfig) === '[object Array]') {
      routeConfig.forEach(function (children) {
        _this.handlePath(children, Route, [], 0);
      });
    } else {
      this.handlePath(routeConfig, Route, [], 0);
    }
  },
  getPropsStr: function getPropsStr(props) {
    var propsStr = '';
    for (var key in props) {
      if (this.keepProps.indexOf(key) === -1) propsStr += key + '="' + props[key] + '" ';
    }
    return propsStr;
  },
  handlePath: function handlePath(routeConfig, Route, target, index) {
    var _this2 = this;

    var component = routeConfig.component;
    var path = routeConfig.path;
    var redirect = routeConfig.redirect;
    var enterCb = routeConfig.enter;
    var leaveCb = routeConfig.leave;

    Route = Route.route(path, function (next) {
      if (redirect) {
        redirect({}, redirect);
      } else {
        if (!target[index] || target[index].component !== component || target[index].component === component && target[index].path !== path) {
          target[index] = {
            path: path,
            component: component
          };
          component.cbFuncs.push({
            funcName: 'routeEnter',
            query: [path.replace(/(^\/)|(\/$)/g, '')]
          });
        }
        if (!next()) {
          this.trackingUpdate({
            componentInf: this.arrayToTree(target, index)
          });
        }
      }
    }.bind(this));

    if (routeConfig.children) {
      routeConfig.children.forEach(function (children) {
        _this2.handlePath(children, Route, target, index + 1);
      });
    }
  },
  arrayToTree: function arrayToTree(array, end) {
    var tree = {
      component: array[0].component
    };
    var prev = tree;
    for (var i = 1; i <= end; i++) {
      var temp = {
        component: array[i].component
      };
      prev.children = temp;
      prev = temp;
    }
    for (var _i = end + 1, len = array.length; _i < len; _i++) {
      array[_i] = null;
    }
    return tree;
  },
  data: function data() {
    return {
      componentInf: {}
    };
  },
  template: function template() {
    var propsStr = this.getPropsStr(this.props);
    return '\n      <component ' + propsStr + ' data-from="componentInf.component" children="{{ componentInf.children || {} }}"></component>\n    ';
  }
});