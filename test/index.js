/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _index = __webpack_require__(1);

	var _dbind = __webpack_require__(3);

	var _dbind2 = _interopRequireDefault(_dbind);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var indexApp = _dbind2.default.createClass({
	  template: '\n    <h1>hello index{{ ri }}</h1>\n    <link to="/user" value="toUser"></link>\n  ',
	  components: {
	    link: _index.Link
	  }
	});

	var userApp = _dbind2.default.createClass({
	  didMount: function didMount() {},

	  template: '\n    <h1 ref="sa">hello user {{ ri }}</h1>\n    <link to="/index" value="toIndex"></link>\n  ',
	  components: {
	    link: _index.Link
	  }
	});

	var rootApp = _dbind2.default.createClass({
	  didMount: function didMount() {},
	  willMount: function willMount() {},
	  willUpdate: function willUpdate(prev, next) {},

	  template: '\n    <div ref="div">\n      hello rootApp\n      <link to="/index" value="toIndex"></link>\n      <link to="/user" value="toUser"></link>\n      and this is my son<component data-from="children.component" children=" {{ children.children }} " ri="{{ 1+1 }}" ></component>\n    </div>\n  ',
	  components: {
	    link: _index.Link
	  }
	});

	var App = _dbind2.default.createClass({
	  data: {
	    rootPath: '/Dbind-router/test',
	    routeConfig: {
	      path: '/',
	      component: rootApp,
	      children: [{
	        path: '/user',
	        component: userApp
	      }, {
	        path: '/index',
	        component: indexApp
	      }]
	    }
	  },
	  template: '\n    <router root-path="{{ rootPath }}" route-config="{{ routeConfig }}" ></router>\n  ',
	  components: {
	    router: _index.Router
	  }
	});

	_dbind2.default.registerComponent('app', App);
	_dbind2.default.watch(document.body);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Router = __webpack_require__(2);
	var LazyBox = __webpack_require__(25);
	var Link = __webpack_require__(26);

	module.exports = {
		Router: Router.default,
		LazyBox: LazyBox.default,
		Link: Link.default
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _dbind = __webpack_require__(3);

	var _dbind2 = _interopRequireDefault(_dbind);

	var _dbindRouterBase = __webpack_require__(23);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	exports.default = _dbind2.default.createClass({
	  keepProps: ['rootPath', 'routeConfig'],
	  willMount: function willMount() {
	    var routeConfig = this.props.routeConfig;
	    var rootPath = this.props.rootPath;
	    if (!routeConfig) throw new TypeError('You should hava a routeConfig props for router to control route');
	    if (!rootPath) throw new TypeError('');

	    (0, _dbindRouterBase.setRootLocation)(rootPath);
	    var Route = new _dbindRouterBase.Router();
	    this.handlePath(routeConfig, Route, [], 0);
	  },
	  getPropsStr: function getPropsStr(props) {
	    var propsStr = '';
	    for (var key in props) {
	      if (this.keepProps.indexOf(key) === -1) propsStr += key + '="' + props[key] + '" ';
	    }
	    return propsStr;
	  },
	  handlePath: function handlePath(routeConfig, Route, target, index) {
	    var _this = this;

	    var component = routeConfig.component;
	    var path = routeConfig.path;
	    var redirect = routeConfig.redirect;
	    var enterCb = routeConfig.enter;
	    var leaveCb = routeConfig.leave;
	    Route = Route.route(routeConfig.path, function (next) {
	      if (redirect) {
	        redirect({}, redirect);
	      } else {
	        if (target[index] !== component) {
	          target[index] = component;
	          component.cbFuncs.push({
	            funcName: 'routeEnter',
	            query: [routeConfig.path.replace(/(^\/)|(\/$)/g, '')]
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
	        _this.handlePath(children, Route, target, index + 1);
	      });
	    }
	  },
	  arrayToTree: function arrayToTree(array, end) {
	    var tree = {
	      component: array[0]
	    };
	    var prev = tree;
	    for (var i = 1; i <= end; i++) {
	      var temp = {
	        component: array[i]
	      };
	      prev.children = temp;
	      prev = temp;
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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(4);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Component = __webpack_require__(5);

	var _Component2 = _interopRequireDefault(_Component);

	var _watch2 = __webpack_require__(7);

	var _watch3 = _interopRequireDefault(_watch2);

	var _registerComponent2 = __webpack_require__(22);

	var _registerComponent3 = _interopRequireDefault(_registerComponent2);

	var _ComponentManager = __webpack_require__(16);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	exports.default = {
	  createClass: function createClass(componentInf) {
	    return (0, _ComponentManager.createComponentManager)(componentInf);
	  },
	  registerComponent: function registerComponent(key, component) {
	    return (0, _registerComponent3.default)(key, component);
	  },
	  watch: function watch(element, data) {
	    return new (Function.prototype.bind.apply(_watch3.default, [null].concat(Array.prototype.slice.call(arguments))))();
	  }
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ComponentLifecycle = undefined;

	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();

	var _utilityFunc = __webpack_require__(6);

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	var ComponentLifecycle = exports.ComponentLifecycle = ['didMount', 'willMount', 'willUpdate', 'shouldUpdate'];

	var Component = function () {
	  function Component() {
	    _classCallCheck(this, Component);

	    this.watcher = null;
	    this.element = null;
	    this.refs = null;
	    this.template = null;
	    this.props = null;
	    this.data = null;
	    this.propTypes = null;
	  }

	  _createClass(Component, [{
	    key: 'init',
	    value: function init(watcher, props) {
	      this.watcher = watcher;
	      this.props = props;
	    }
	  }, {
	    key: 'setDOMElement',
	    value: function setDOMElement(element) {
	      this.element = element;
	      this.__setRefs();
	    }
	  }, {
	    key: 'trackingUpdate',
	    value: function trackingUpdate(data) {
	      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

	      var prevData = (0, _utilityFunc.objectAssign)({}, this.data);
	      for (var key in data) {
	        this.data[key] = data[key];
	      }
	      this.watcher.obwatcher.reset(cb, prevData, this.data);
	    }
	  }, {
	    key: 'setProps',
	    value: function setProps(props) {
	      this.props = props;
	    }
	  }, {
	    key: '__setRefs',
	    value: function __setRefs() {
	      var refs = {};
	      (0, _utilityFunc.walkElement)(this.element, function (element) {
	        var ref = element.getAttribute && element.getAttribute('ref');
	        ref && (refs[ref] = element);
	      });
	      this.refs = refs;
	    }
	  }, {
	    key: 'didMount',
	    value: function didMount() {}
	  }, {
	    key: 'willMount',
	    value: function willMount() {}
	  }, {
	    key: 'willUpdate',
	    value: function willUpdate() {}
	  }, {
	    key: 'shouldUpdate',
	    value: function shouldUpdate() {
	      return true;
	    }
	  }]);

	  return Component;
	}();

	exports.default = Component;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.toArray = toArray;
	exports.delay = delay;
	exports.clearDelay = clearDelay;
	exports.is = is;
	exports.deepClone = deepClone;
	exports.randomId = randomId;
	exports.objectAssign = objectAssign;
	exports.walkElement = walkElement;
	exports.toHump = toHump;
	exports.toHumpBack = toHumpBack;
	function toArray(arrayLike) {
	  return [].slice.call(arrayLike);
	}
	function delay(fn) {
	  var t = Date.now();
	  return setTimeout(function () {
	    fn(Date.now() - t);
	  });
	}
	function clearDelay(delay) {
	  clearTimeout(delay);
	}
	function is(target, type) {
	  return Object.prototype.toString.call(target).toLowerCase() === '[object ' + type.toLowerCase() + ']';
	}
	function deepClone(t) {
	  if (is(t, 'array')) {
	    return t.map(function (item) {
	      return deepClone(item);
	    });
	  } else if (is(t, 'object')) {
	    var nt = {};
	    for (var key in t) {
	      if (t.hasOwnProperty(key)) nt[key] = deepClone(t[key]);
	    }
	    nt.__proto__ = t.__proto__;
	    return nt;
	  } else {
	    return t;
	  }
	}
	function randomId() {
	  return Date.now() + Math.random();
	}
	function objectAssign() {
	  var arg = [].slice.call(arguments, 1);
	  var target = arguments[0];
	  arg.forEach(function (item) {
	    for (var key in item) {
	      target[key] = item[key];
	    }
	  });
	  return target;
	}
	function walkElement(dom, cb) {
	  if (is(dom, 'array')) {
	    dom.forEach(function (item) {
	      while (item) {
	        cb(item);
	        walkElement(item.firstElementChild, cb);
	        item = item.nextElementSibling;
	      }
	    });
	  } else {
	    while (dom) {
	      cb(dom);
	      walkElement(dom.firstElementChild, cb);
	      dom = dom.nextElementSibling;
	    }
	  }
	}
	function toHump(str) {
	  return str.replace(/-(.)/, function (a, b) {
	    return String.fromCharCode(b.charCodeAt(0) - 32);
	  });
	}

	function toHumpBack(str) {
	  var strArr = str.split('');
	  strArr = strArr.map(function (item) {
	    var code = item.charCodeAt(0);
	    if (code >= 65 && code <= 90) {
	      return '-' + String.fromCharCode(code + 32);
	    }
	    return item;
	  });
	  return strArr.join('');
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();

	var _BaseWatcher = __webpack_require__(8);

	var _BaseWatcher2 = _interopRequireDefault(_BaseWatcher);

	var _utilityFunc = __webpack_require__(6);

	var _modelSettlement = __webpack_require__(10);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	var Watch = function () {
	  function Watch(DOM, data) {
	    _classCallCheck(this, Watch);

	    this.DOM = DOM;
	    this.data = data;
	    this.modelId = (0, _utilityFunc.randomId)();
	    this.init();
	  }

	  _createClass(Watch, [{
	    key: 'init',
	    value: function init() {
	      this.watcher = new _BaseWatcher2.default(this.DOM, this.data, null, null, this.modelId);
	    }
	  }]);

	  return Watch;
	}();

	exports.default = Watch;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
	};

	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();

	var _utilityFunc = __webpack_require__(6);

	var _ManagerWatcher = __webpack_require__(9);

	var _ManagerWatcher2 = _interopRequireDefault(_ManagerWatcher);

	var _ElementWatcher = __webpack_require__(12);

	var _ElementWatcher2 = _interopRequireDefault(_ElementWatcher);

	var _ComponentWatcher = __webpack_require__(15);

	var _ComponentWatcher2 = _interopRequireDefault(_ComponentWatcher);

	var _TextWatcher = __webpack_require__(18);

	var _TextWatcher2 = _interopRequireDefault(_TextWatcher);

	var _modelExtract2 = __webpack_require__(20);

	var _modelExtract3 = _interopRequireDefault(_modelExtract2);

	var _runResetWatcher2 = __webpack_require__(21);

	var _runResetWatcher3 = _interopRequireDefault(_runResetWatcher2);

	var _statementExtract2 = __webpack_require__(14);

	var _statementExtract3 = _interopRequireDefault(_statementExtract2);

	var _modelSettlement = __webpack_require__(10);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	var BaseWatcher = function () {
	  function BaseWatcher(element, obdata) {
	    var previous = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	    var forceWatcherType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
	    var modelExtractId = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
	    var components = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
	    var parentWatcher = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
	    var obId = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;

	    _classCallCheck(this, BaseWatcher);

	    this.obId = obId;
	    this.element = element;
	    this.components = components;
	    this.parentWatcher = parentWatcher;
	    this.obdata = obdata;
	    this.previous = previous;
	    this.rendering = null;
	    this.hasDelete = false;
	    this.modelExtractId = modelExtractId;
	    this.pastDOMInformation = this.__getPastDOMInformation();
	    this.obtype = this.__getType(forceWatcherType);
	    this.obwatcher = this.__getWatcher();
	    this.__hangonModel(this.modelExtractId);

	    this.render();
	  }

	  _createClass(BaseWatcher, [{
	    key: 'destructor',
	    value: function destructor() {
	      this.hasDelete = true;
	      this.obwatcher.destructor();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.obwatcher.render();
	    }
	  }, {
	    key: 'reset',
	    value: function reset(data) {
	      var _this = this;

	      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

	      if (this.rendering !== null) {
	        clearTimeout(this.rendering);
	      }
	      var prevData = (0, _utilityFunc.objectAssign)({}, this.obdata);
	      var nextData = (0, _utilityFunc.objectAssign)({}, this.obdata);
	      if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
	        throw new TypeError('data is not a object');
	      } else {
	        for (var key in data) {
	          nextData[key] = data[key];
	        }
	      }
	      this.obdata = nextData;
	      this.rendering = (0, _utilityFunc.delay)(function (time) {
	        if (!_this.hasDelete) {
	          _this.obwatcher.reset(cb, prevData, nextData);
	        }
	        _this.rendering = null;
	        cb();
	      });
	    }
	  }, {
	    key: 'trackingUpdate',
	    value: function trackingUpdate(data) {
	      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

	      var resetWatcherList = [];
	      for (var key in data) {
	        if (data.hasOwnProperty(key)) {
	          resetWatcherList.push((0, _modelSettlement.get)(this.modelExtractId, key));
	        }
	      }
	      this.runResetWatcher(resetWatcherList, data, cb);
	    }
	  }, {
	    key: 'runResetWatcher',
	    value: function runResetWatcher(resetWatcherList, data, cb) {
	      (0, _runResetWatcher3.default)(resetWatcherList, data, cb);
	    }
	  }, {
	    key: '__getWatcher',
	    value: function __getWatcher() {
	      var watcherClass = null;
	      switch (this.obtype) {
	        case BaseWatcher.ManagerWatcher:
	          watcherClass = _ManagerWatcher2.default;
	          break;
	        case BaseWatcher.ElementWatcher:
	          watcherClass = _ElementWatcher2.default;
	          break;
	        case BaseWatcher.TextWatcher:
	          watcherClass = _TextWatcher2.default;
	          break;
	        case BaseWatcher.ComponentWatcher:
	          watcherClass = _ComponentWatcher2.default;
	          break;
	      }
	      return new watcherClass(this, BaseWatcher);
	    }
	  }, {
	    key: '__getType',
	    value: function __getType(forceWatcherType) {
	      if (forceWatcherType !== null) {
	        return forceWatcherType;
	      }
	      var NODE_TYPE = this.element.nodeType,
	          NODE_NAME = this.element.nodeName.toLowerCase();
	      if (NODE_TYPE === 3) {
	        return BaseWatcher.TextWatcher;
	      } else if (NODE_TYPE === 1) {
	        var attr = this.pastDOMInformation.attr;
	        var isManagerWatcher = false;
	        for (var i = 0, len = attr.length; i < len; i++) {
	          if (attr[i].name === _ManagerWatcher2.default.instructions[0]) {
	            isManagerWatcher = true;
	            break;
	          }
	        }
	        if (isManagerWatcher) {
	          return BaseWatcher.ManagerWatcher;
	        } else if (_ComponentWatcher2.default.nodeName === NODE_NAME || _ComponentWatcher2.default.components[NODE_NAME] || this.components && this.components[NODE_NAME]) {
	          return BaseWatcher.ComponentWatcher;
	        } else {
	          return BaseWatcher.ElementWatcher;
	        }
	      } else {
	        throw 'watcher只能接受元素节点或者文本节点';
	      }
	    }
	  }, {
	    key: '__getPastDOMInformation',
	    value: function __getPastDOMInformation() {
	      return {
	        parentNode: this.element.parentNode,
	        nextSibling: this.element.nextSibling,
	        textContent: this.element.textContent,
	        innerHTML: this.element.innerHTML,
	        nodeType: this.element.nodeType,
	        nodeName: this.element.nodeName,
	        attr: this.__getAttr(),
	        display: this.__getDisplay()
	      };
	    }
	  }, {
	    key: '__getDisplay',
	    value: function __getDisplay() {
	      return this.element.nodeType !== BaseWatcher.TextWatcher && getComputedStyle(this.element).display;
	    }
	  }, {
	    key: '__getAttr',
	    value: function __getAttr() {
	      return this.element.attributes ? (0, _utilityFunc.toArray)(this.element.attributes) : [];
	    }
	  }, {
	    key: '__getWatcherType',
	    value: function __getWatcherType(watcher) {
	      return watcher.type;
	    }
	  }, {
	    key: '__filterAttr',
	    value: function __filterAttr() {
	      var keeplist = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	      return this.pastDOMInformation.attr.filter(function (item) {
	        return type ? keeplist.indexOf(item.name) > -1 : keeplist.indexOf(item.name) === -1;
	      });
	    }
	  }, {
	    key: '__hangonModel',
	    value: function __hangonModel() {
	      var _this2 = this;

	      var model = this.obwatcher.model;
	      if (model) {
	        model.forEach(function (item) {
	          (0, _modelSettlement.set)(_this2.modelExtractId, item, _this2);
	        });
	      }
	    }
	  }, {
	    key: 'getChildId',
	    value: function getChildId(i) {
	      return this.obId + '.' + i;
	    }
	  }, {
	    key: 'removeAttr',
	    value: function removeAttr(name) {
	      this.element.removeAttribute(name);
	    }
	  }, {
	    key: 'modelExtract',
	    value: function modelExtract(str) {
	      return (0, _modelExtract3.default)(str);
	    }
	  }, {
	    key: 'traversalPrevious',
	    value: function traversalPrevious(cb) {
	      var previousWatcher = this.previous;
	      while (previousWatcher) {
	        if (cb(previousWatcher) === false) break;
	        previousWatcher = previousWatcher.previous;
	      }
	    }
	  }, {
	    key: 'statementExtract',
	    value: function statementExtract(str) {
	      return (0, _statementExtract3.default)(str);
	    }
	  }, {
	    key: 'execStatement',
	    value: function execStatement(statement) {
	      return new Function('data', 'with(data) { return ' + statement + ';}')(this.obdata);
	    }
	  }]);

	  return BaseWatcher;
	}();

	BaseWatcher.ManagerWatcher = 1;
	BaseWatcher.ElementWatcher = 2;
	BaseWatcher.TextWatcher = 3;
	BaseWatcher.ComponentWatcher = 4;
	exports.default = BaseWatcher;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();

	var _utilityFunc = __webpack_require__(6);

	var _modelSettlement = __webpack_require__(10);

	var _traversalVector = __webpack_require__(11);

	var _traversalVector2 = _interopRequireDefault(_traversalVector);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	function _toConsumableArray(arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }return arr2;
	  } else {
	    return Array.from(arr);
	  }
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	var ManagerWatcher = function () {
	  function ManagerWatcher(base, BaseWatcher) {
	    _classCallCheck(this, ManagerWatcher);

	    this.base = base;
	    this.BaseWatcher = BaseWatcher;
	    this.instruction = this.__getInstruction();
	    this.vector = null;
	    this.model = this.__getModel();
	    this.parameter = this.__getParameter();
	    this.childWacther = null;
	    this.__check();
	    this.__removeRootElement();
	  }

	  _createClass(ManagerWatcher, [{
	    key: 'render',
	    value: function render() {
	      var childIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

	      this.__setChildWatcher(childIndex);
	      this.__appendChildWatcherToDOM(childIndex);
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
	      var prevData = arguments[1];
	      var nextData = arguments[2];

	      var prevLen = prevData[this.vector].length;
	      var nextLen = nextData[this.vector].length;
	      if (prevLen < nextLen) {
	        this.render(prevLen);
	      } else if (prevLen > nextLen) {
	        for (var i = nextLen; i < prevLen; i++) {
	          this.childWacther[i].destructor();
	        }
	        this.childWacther = this.childWacther.slice(0, nextLen);
	      }
	    }
	  }, {
	    key: '__appendChildWatcherToDOM',
	    value: function __appendChildWatcherToDOM(childIndex) {
	      var frg = document.createDocumentFragment(),
	          next = this.base.pastDOMInformation.nextSibling;
	      for (var i = childIndex, len = this.childWacther.length; i < len; i++) {
	        frg.appendChild(this.childWacther[i][0]);
	      }
	      if (next) {
	        next.parentNode.insertBefore(frg, next);
	      } else {
	        this.base.pastDOMInformation.parentNode.appendChild(frg);
	      }
	      for (var _i = childIndex, _len = this.childWacther.length; _i < _len; _i++) {
	        this.childWacther[_i] = new (Function.prototype.bind.apply(this.BaseWatcher, [null].concat(_toConsumableArray(this.childWacther[_i]))))();
	      }
	    }
	  }, {
	    key: '__check',
	    value: function __check() {
	      var res = /[a-zA-Z_$][a-zA-Z_$0-9]*(\s*,\s*[a-zA-Z_$][a-zA-Z_$0-9]*){0,2}\s*in\s*/.test(this.instruction.value);
	      if (!res) {
	        throw '';
	      }
	    }
	  }, {
	    key: '__setChildWatcher',
	    value: function __setChildWatcher(childIndex) {
	      var _this = this;

	      var vector = new Function('data', 'with(data) { return ' + this.vector + ' }')(this.base.obdata).slice(childIndex);
	      var child = [];
	      (0, _traversalVector2.default)(vector, function (key, count) {
	        if ((0, _utilityFunc.is)(vector, 'array')) {
	          key += childIndex;
	        }
	        count += childIndex;
	        var obdata = (0, _utilityFunc.objectAssign)({}, _this.base.obdata);
	        obdata[_this.parameter[0]] = key;
	        _this.parameter[1] && (obdata[_this.parameter[1]] = count);
	        child.push([_this.__cloneElement(_this.base.element.innerHTML), obdata, _this.base.previous, null, _this.base.modelExtractId, _this.base.components, _this.base, _this.base.getChildId(count)]);
	      });
	      if (childIndex > 0) {
	        for (var i = 0, len = child.length; i < len; i++) {
	          this.childWacther.push(child[i]);
	        }
	      } else {
	        this.childWacther = child;
	      }
	    }
	  }, {
	    key: '__removeRootElement',
	    value: function __removeRootElement() {
	      var element = this.base.element;
	      element.parentNode.removeChild(element);
	    }
	  }, {
	    key: '__cloneElement',
	    value: function __cloneElement() {
	      var innerHTML = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

	      var cloneNode = this.base.element.cloneNode();
	      cloneNode.innerHTML = innerHTML;
	      cloneNode.removeAttribute(ManagerWatcher.instructions[0]);
	      return cloneNode;
	    }
	  }, {
	    key: '__getModel',
	    value: function __getModel() {
	      var _this2 = this;

	      var res = [];
	      var flag = false;
	      this.base.modelExtract(this.instruction.value).forEach(function (item) {
	        flag && res.push(item.value);
	        if (item.value === ManagerWatcher.eachSplitInstructionChar) {
	          flag = true;
	          _this2.vector = _this2.instruction.value.slice(item.index + ManagerWatcher.eachSplitInstructionChar.length).replace(/\s/g, '');
	        };
	      });
	      return res.length > 0 ? res : null;
	    }
	  }, {
	    key: '__getParameter',
	    value: function __getParameter() {
	      var res = [];
	      var flag = false;
	      this.base.modelExtract(this.instruction.value).forEach(function (item) {
	        if (item.value === ManagerWatcher.eachSplitInstructionChar) flag = true;
	        !flag && res.push(item.value);
	      });
	      return res;
	    }
	  }, {
	    key: '__getInstruction',
	    value: function __getInstruction() {
	      return this.base.__filterAttr(ManagerWatcher.instructions, true)[0];
	    }
	  }]);

	  return ManagerWatcher;
	}();

	ManagerWatcher.instructions = ['data-each'];
	ManagerWatcher.eachSplitInstructionChar = 'in';
	exports.default = ManagerWatcher;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.set = set;
	exports.get = get;
	exports.all = all;
	exports.deleteOne = deleteOne;
	exports.deleteAll = deleteAll;

	var _BaseWatcher = __webpack_require__(8);

	var _BaseWatcher2 = _interopRequireDefault(_BaseWatcher);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
	  } else {
	    obj[key] = value;
	  }return obj;
	}

	var modelSettlement = {};

	function set(modelExtractId, key, watcher) {
	  if (!(watcher instanceof _BaseWatcher2.default)) throw new TypeError('watcher must extends from BaseWatcher');
	  if (!modelSettlement[modelExtractId]) {
	    modelSettlement[modelExtractId] = {};
	  }
	  var target = modelSettlement[modelExtractId];
	  if (target[key]) {
	    target[key][watcher.obId] = watcher;
	  } else {
	    target[key] = _defineProperty({}, watcher.obId, watcher);
	  }
	}
	function get(modelExtractId, key) {
	  return modelSettlement[modelExtractId] && modelSettlement[modelExtractId][key] || null;
	}
	function all(modelExtractId) {
	  return modelSettlement[modelExtractId];
	}
	function deleteOne(modelExtractId, key) {
	  delete modelSettlement[modelExtractId][key];
	}
	function deleteAll(modelExtractId) {
	  modelSettlement[modelExtractId] = null;
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = traversalVector;

	var _utilityFunc = __webpack_require__(6);

	function traversalVector(vector, cb) {
	  if (!(0, _utilityFunc.is)(cb, 'function')) {
	    throw new TypeError('cb is not a function');
	  }
	  if ((0, _utilityFunc.is)(vector, 'array')) {
	    vector.forEach(function (item, index) {
	      cb(index, index);
	    });
	  } else if ((0, _utilityFunc.is)(vector, 'object')) {
	    var count = 0;
	    for (var key in vector) {
	      if (vector.hasOwnProperty(key)) {
	        cb(key, count++);
	      }
	    }
	  }
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _ElementWatcher$instr;

	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();

	var _Event = __webpack_require__(13);

	var _utilityFunc = __webpack_require__(6);

	var _statementExtract = __webpack_require__(14);

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
	  } else {
	    obj[key] = value;
	  }return obj;
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	var ElementWatcher = function () {
	  function ElementWatcher(base, BaseWatcher) {
	    _classCallCheck(this, ElementWatcher);

	    this.base = base;
	    this.BaseWatcher = BaseWatcher;
	    this.__setObIdAttr();
	    this.instructions = this.__getInstructions();
	    this.instructionsList = this.instructions.map(function (item) {
	      return item.name;
	    });
	    this.instructionsModel = null;
	    this.events = this.__getEvents();
	    this.attrs = this.__getAttrs();
	    this.model = this.__getModel();

	    this.renderCount = 0;

	    this.rendering = false;
	    this.resolvedInstructions = null;
	    this.renderInf = null;
	    this.childWatchers = null;
	  }

	  _createClass(ElementWatcher, [{
	    key: 'destructor',
	    value: function destructor() {
	      var node = this.base.element;
	      node.parentNode.removeChild(node);
	      this.__destructorChild();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

	      this.resolvedInstructions = this.__execInstructions();
	      this.renderInf = this.__handleResolvedInstructions();
	      if (this.renderInf.shouldRender || this.renderInf.shouldRender === null) {
	        if (this.renderInf.shouldRender) {
	          this.__setBaseElementDisplay(this.base.pastDOMInformation.display);
	        }
	        this.__bindAttrs();
	        if (this.renderInf.shouldInit) {
	          this.__bindEvents();
	        }
	        if (!this.childWatchers) {
	          this.__setChildWatcher();
	        }
	      } else {
	        if (this.childWatchers) {
	          this.__destructorChild();
	          this.base.element.innerHTML = this.base.pastDOMInformation.innerHTML;
	        }
	        this.__setBaseElementDisplay('none');
	      }
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
	      var prevData = arguments[1];
	      var nextData = arguments[2];

	      if (prevData !== nextData) {
	        this.render(cb);
	      }
	    }
	  }, {
	    key: '__destructorChild',
	    value: function __destructorChild() {
	      this.childWatchers && this.childWatchers.forEach(function (item) {
	        return item.destructor();
	      });
	      this.childWatchers = null;
	    }
	  }, {
	    key: '__setChildWatcher',
	    value: function __setChildWatcher() {
	      var _this = this;

	      if (ElementWatcher.escapeNode.indexOf(this.base.pastDOMInformation.nodeName.toLowerCase()) > -1) return;
	      if (this.renderInf.shouldRenderHtml) {
	        this.childWatchers = [new this.BaseWatcher(this.base.element, (0, _utilityFunc.objectAssign)({}, this.base.obdata), null, this.BaseWatcher.TextWatcher, this.base.modelExtractId, this.base.components, this.base)];
	      } else {
	        (function () {
	          var previousWatcher = null;
	          _this.childWatchers = (0, _utilityFunc.toArray)(_this.base.element.childNodes).map(function (item, index) {
	            var childWatcher = new _this.BaseWatcher(item, (0, _utilityFunc.objectAssign)({}, _this.base.obdata), previousWatcher, null, _this.base.modelExtractId, _this.base.components, _this.base, _this.base.getChildId(index));
	            previousWatcher = childWatcher;
	            return childWatcher;
	          });
	        })();
	      }
	    }
	  }, {
	    key: '__setBaseElementDisplay',
	    value: function __setBaseElementDisplay(display) {
	      this.base.element.style.display = display;
	    }
	  }, {
	    key: '__setObIdAttr',
	    value: function __setObIdAttr() {
	      this.base.element.setAttribute('data-ob-id', this.base.obId);
	    }
	  }, {
	    key: '__getInstructionsModel',
	    value: function __getInstructionsModel() {
	      var _this2 = this;

	      var res = [];
	      this.instructionsModel = {};
	      this.instructions.forEach(function (instruction) {
	        _this2.base.modelExtract(instruction.value).forEach(function (item) {
	          res.push(item.value);
	          _this2.instructionsModel[instruction.name] = item.value;
	        });
	      });
	      if (this.hasElseInstruction()) {
	        res = res.concat(this.__getPrevIfInstructionModel());
	      }
	      return res;
	    }
	  }, {
	    key: '__getPrevIfInstructionModel',
	    value: function __getPrevIfInstructionModel() {
	      var _this3 = this;

	      var model = null;
	      this.base.traversalPrevious(function (previousWatcher) {
	        if (previousWatcher.obtype === _this3.BaseWatcher.TextWatcher) return true;
	        if (previousWatcher.obtype === _this3.BaseWatcher.ManagerWatcher) return false;
	        if (previousWatcher.obwatcher.hasElseIfInstruction()) {
	          model = previousWatcher.obwatcher.instructionsModel[ElementWatcher.instructions[2]];
	          return false;
	        }
	        if (previousWatcher.obwatcher.hasIfInstruction()) {
	          model = previousWatcher.obwatcher.instructionsModel[ElementWatcher.instructions[1]];
	          return false;
	        }
	      });
	      return model;
	    }
	  }, {
	    key: '__getModel',
	    value: function __getModel() {
	      var instructionsModel = this.__getInstructionsModel(),
	          attrsModel = this.__getAttrsModel();
	      return instructionsModel.concat(attrsModel);
	    }
	  }, {
	    key: '__getAttrsModel',
	    value: function __getAttrsModel() {
	      var _this4 = this;

	      var res = [];
	      this.attrs.obattrs.forEach(function (attr) {
	        attr.value.forEach(function (item) {
	          if (item.type === _statementExtract.NOR_STATEMENT_TYPE) {
	            _this4.base.modelExtract(item.value).forEach(function (model) {
	              res.push(model.value);
	            });
	          }
	        });
	      });
	      return res;
	    }
	  }, {
	    key: 'hasIfInstruction',
	    value: function hasIfInstruction() {
	      return this.instructionsList.indexOf(ElementWatcher.instructions[0]) > -1;
	    }
	  }, {
	    key: 'hasElseInstruction',
	    value: function hasElseInstruction() {
	      return this.instructionsList.indexOf(ElementWatcher.instructions[1]) > -1;
	    }
	  }, {
	    key: 'hasElseIfInstruction',
	    value: function hasElseIfInstruction() {
	      return this.instructionsList.indexOf(ElementWatcher.instructions[2]) > -1;
	    }
	  }, {
	    key: 'hasHtmlInstruction',
	    value: function hasHtmlInstruction() {
	      return this.instructionsList.indexOf(ElementWatcher.instructions[3]) > -1;
	    }
	  }, {
	    key: '__getInstructions',
	    value: function __getInstructions() {
	      var _this5 = this;

	      return this.base.__filterAttr(ElementWatcher.instructions, true).map(function (item) {
	        _this5.base.removeAttr(item.name);
	        return { name: item.name, value: item.value };
	      });
	    }
	  }, {
	    key: '__getAttrs',
	    value: function __getAttrs() {
	      var _this6 = this;

	      var attrs = this.base.__filterAttr(_Event.events.concat(ElementWatcher.instructions), false);
	      var obattrs = [],
	          normalAttrs = [];
	      attrs.forEach(function (attr) {
	        var parsed = _this6.base.statementExtract(attr.value);
	        var type = null,
	            ob = false;
	        var obj = {};
	        obj.name = attr.name;
	        obj.value = parsed.map(function (item) {
	          if (item.type === _statementExtract.NOR_STATEMENT_TYPE || item.type === _statementExtract.ONCE_STATEMENT_TYPE) {
	            ob = true;
	          }
	          return item;
	        });
	        if (ob === true) {
	          obattrs.push(obj);
	        } else {
	          normalAttrs.push(obj);
	        }
	      });
	      return { obattrs: obattrs, normalAttrs: normalAttrs };
	    }
	  }, {
	    key: '__getEvents',
	    value: function __getEvents() {
	      var _this7 = this;

	      var eventAttrs = this.base.__filterAttr(_Event.events);
	      var obEvents = [],
	          onceEvents = [],
	          normalEvents = [];
	      eventAttrs.forEach(function (item) {
	        var parsed = _this7.base.statementExtract(item.value);
	        var obj = {};
	        obj.name = item.name;
	        obj.value = parsed[0].value;
	        if (parsed.length > 1) {
	          throw '';
	        } else {
	          if (parsed[0].type === _statementExtract.NOR_STATEMENT_TYPE) {
	            obEvents.push(obj);
	          } else if (parsed[0].type === _statementExtract.ONCE_STATEMENT_TYPE) {
	            onceEvents.push(obj);
	          } else {
	            normalEvents.push(obj);
	          }
	        }
	      });
	      return { obEvents: obEvents, onceEvents: onceEvents, normalEvents: normalEvents };
	    }
	  }, {
	    key: '__bindEvents',
	    value: function __bindEvents() {
	      var _this8 = this;

	      var events = [this.events.obEvents, this.events.onceEvents];
	      events.forEach(function (item, index) {
	        if (item.length === 0) return;
	        var obdata = index === 1 ? (0, _utilityFunc.deepClone)(_this8.base.obdata) : _this8.base.obdata;
	        item.forEach(function (item) {
	          _this8.base.element[item.name] = null;
	          _this8.base.removeAttr(item.name);
	          (0, _Event.on)(_this8.base.element, item.name.substring(2), function ($event) {
	            new Function('data, $event', 'with(data) { ' + item.value + ' }')(obdata, $event);
	          });
	        });
	      });
	    }
	  }, {
	    key: '__bindAttrs',
	    value: function __bindAttrs() {
	      var _this9 = this;

	      this.attrs.obattrs.forEach(function (attr) {
	        var str = '';
	        attr.value.forEach(function (item) {
	          if (item.type === _statementExtract.NOR_STATEMENT_TYPE || item.type === _statementExtract.ONCE_STATEMENT_TYPE) {
	            str += _this9.__toString(_this9.base.execStatement(item.value));
	          } else {
	            str += item.value;
	          }
	        });
	        _this9.base.element.setAttribute(attr.name, str);
	      });
	    }
	  }, {
	    key: '__toString',
	    value: function __toString(val) {
	      if ((0, _utilityFunc.is)(val, 'object')) {
	        var str = '';
	        for (var key in val) {
	          str += (0, _utilityFunc.toHumpBack)(key) + ':' + val[key] + ';';
	        }
	        return str;
	      } else {
	        return val;
	      }
	    }
	  }, {
	    key: '__execInstructions',
	    value: function __execInstructions() {
	      var _this10 = this;

	      var resolved = {};
	      this.instructions.forEach(function (item) {
	        resolved[item.name] = _this10.base.execStatement(item.value);
	      });
	      return resolved;
	    }
	  }, {
	    key: '__handleResolvedInstructions',
	    value: function __handleResolvedInstructions() {
	      var renderInf = {
	        shouldRender: null,
	        shouldRenderHtml: false,
	        shouldInit: null
	      };
	      for (var key in this.resolvedInstructions) {
	        var resolvedInstruction = this.resolvedInstructions[key];
	        this[ElementWatcher.instructionsHandle[key]](resolvedInstruction, renderInf);
	      }
	      renderInf.shouldInit = (renderInf.shouldRender === true || renderInf.shouldRender === null) && this.renderCount === 0;
	      if (this.renderCount === 0 && renderInf.shouldRender === false) {
	        this.renderCount--;
	      };
	      this.renderCount++;
	      return renderInf;
	    }
	  }, {
	    key: '__handleIfInstruction',
	    value: function __handleIfInstruction(resolvedInstruction, renderInf) {
	      return renderInf.shouldRender = !!resolvedInstruction;
	    }
	  }, {
	    key: '__handleElseIfInstruction',
	    value: function __handleElseIfInstruction(resolvedInstruction, renderInf) {
	      var ifFlag = this.__handleIfInstruction(resolvedInstruction, renderInf),
	          elseFlag = this.__handleElseInstruction(resolvedInstruction, renderInf);
	      return renderInf.shouldRender = ifFlag && elseFlag;
	    }
	  }, {
	    key: '__handleElseInstruction',
	    value: function __handleElseInstruction(resolvedInstruction, renderInf) {
	      var _this11 = this;

	      var noError = false,
	          shouldRender = true;
	      this.base.traversalPrevious(function (previousWatcher) {
	        if (previousWatcher.obtype === _this11.BaseWatcher.TextWatcher) return true;
	        if (previousWatcher.obtype === _this11.BaseWatcher.ManagerWatcher) return false;
	        if (previousWatcher.obwatcher.hasElseInstruction()) return false;
	        if (previousWatcher.obwatcher.renderInf.shouldRender === null) return false;
	        if (previousWatcher.obwatcher.renderInf.shouldRender === true) shouldRender = false;
	        if (previousWatcher.obwatcher.hasIfInstruction()) {
	          noError = true;
	          return false;
	        }
	      });
	      if (!noError) throw new SyntaxError('Unexpected else');
	      renderInf.shouldRender = shouldRender;
	      return shouldRender;
	    }
	  }, {
	    key: '__handleHtmlInstruction',
	    value: function __handleHtmlInstruction(resolvedInstruction, renderInf) {
	      renderInf.shouldRenderHtml = true;
	    }
	  }]);

	  return ElementWatcher;
	}();

	ElementWatcher.instructions = ['data-if', 'data-else', 'data-else-if', 'data-html'];
	ElementWatcher.escapeNode = ['script'];
	ElementWatcher.instructionsHandle = (_ElementWatcher$instr = {}, _defineProperty(_ElementWatcher$instr, ElementWatcher.instructions[0], '__handleIfInstruction'), _defineProperty(_ElementWatcher$instr, ElementWatcher.instructions[1], '__handleElseInstruction'), _defineProperty(_ElementWatcher$instr, ElementWatcher.instructions[2], '__handleElseIfInstruction'), _defineProperty(_ElementWatcher$instr, ElementWatcher.instructions[3], '__handleHtmlInstruction'), _ElementWatcher$instr);
	exports.default = ElementWatcher;

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.on = on;

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
	  } else {
	    obj[key] = value;
	  }return obj;
	}

	var events = exports.events = ['onafterprint', 'onbeforeprint', 'onbeforeunload', 'onerror', 'onhaschange', 'onload', 'onmessage', 'onoffline', 'ononline', 'onpagehide', 'onpageshow', 'onpopstate', 'onredo', 'onresize', 'onstorage', 'onundo', 'onunload', 'onblur', 'onchange', 'oncontextmenu', 'onfocus', 'onformchange', 'onforminput', 'oninvalid', 'onreset', 'onselect', 'onsubmit', 'onkeydown', 'onkeypress', 'onkeyup', 'onclick', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onscroll', 'onabort', 'oncanplay', 'oncanplaythrough', 'ondurationchange', 'onemptied', 'onended', 'onerror', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onpause', 'onplay', 'onplaying', 'onprogress', 'onratechange', 'onreadystatechange', 'onseeked', 'onseeking', 'onstalled', 'onsuspend', 'ontimeupdate', 'onvolumechange', 'onwaiting'];

	var noBubblesEvents = exports.noBubblesEvents = ['abort', 'blur'];

	var eventPool = {};

	var _loop = function _loop(i, len) {
	  var eventName = events[i].slice(2);
	  bindEvent(document, eventName, function (event) {
	    var dom = event.target;
	    var obId = getObId(dom);
	    var eventHandles = eventPool[obId] && eventPool[obId][eventName];
	    eventHandles && eventHandles.map(function (eventHandle) {
	      return eventHandle(event);
	    });
	  });
	};

	for (var i = 0, len = events.length; i < len; i++) {
	  _loop(i, len);
	}

	function bindEvent(dom, eventType, eventHandle) {
	  if (dom.addEventListener) {
	    dom.addEventListener(eventType, eventHandle);
	  } else if (dom.attachEvent) {
	    dom.attachEvent('on' + eventType, eventHandle);
	  } else {
	    dom['on' + eventType] = eventHandle;
	  }
	}

	function getObId(dom) {
	  return dom.dataset && dom.dataset.obId;;
	}

	function on(dom, eventType, eventHandle) {
	  var obId = getObId(dom);
	  if (!eventPool[obId]) {
	    eventPool[obId] = _defineProperty({}, eventType, [eventHandle]);
	  } else {
	    if (eventPool[obId][eventType]) {
	      eventPool[obId][eventType].push(eventHandle);
	    } else {
	      eventPool[obId][eventType] = [eventHandle];
	    }
	  }
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.resetStatementSyb = resetStatementSyb;
	exports.default = statementExtract;
	var NOR_STATEMENT = {
	  start: '{{',
	  end: '}}'
	};
	var ONCE_STATEMENT = {
	  start: '{{{',
	  end: '}}}'
	};
	var MARKS = /['"]/;

	var NOR_STATEMENT_TYPE = exports.NOR_STATEMENT_TYPE = 'normalStatement';
	var ONCE_STATEMENT_TYPE = exports.ONCE_STATEMENT_TYPE = 'onceStatement';
	var CONST_STRING = exports.CONST_STRING = 'constString';

	var checkNorStart = checkStatement(NOR_STATEMENT.start);
	var checkNorEnd = checkStatement(NOR_STATEMENT.end);
	var checkOnceStart = checkStatement(ONCE_STATEMENT.start);
	var checkOnceEnd = checkStatement(ONCE_STATEMENT.end);

	function checkStatement(statementSyb) {
	  return function (str, index) {
	    var i = 0,
	        len = statementSyb.length;
	    for (; i < len; i++, index++) {
	      if (str[index] !== statementSyb[i]) return -1;
	    }
	    return i - 1;
	  };
	}

	function resetStatementSyb(type, sybObj) {
	  if (type === NOR_STATEMENT_TYPE) {
	    target = NOR_STATEMENT;
	  } else if (type === ONCE_STATEMENT_TYPE) {
	    target = ONCE_STATEMENT;
	  } else {
	    throw new TypeError('type need to be normalStatement or onceStatement');
	  }
	  target.start = sybObj.start;
	  target.end = sybObj.end;
	}

	function statementExtract(str) {
	  var len = str.length;
	  var res = [];
	  var stmStack = [];
	  var mrkStack = [];

	  var i = -1,
	      p = 0;

	  while (++i < len) {
	    var char = str[i];
	    var mrkLen = mrkStack.length;
	    var stmLen = stmStack.length;
	    if (mrkLen === 0) {
	      var norStart = checkNorStart(str, i);
	      var onceStart = checkOnceStart(str, i);
	      var norEnd = checkNorEnd(str, i);
	      var onceEnd = checkOnceEnd(str, i);

	      if (norStart > -1 && onceStart === -1) {
	        stmStack.push(NOR_STATEMENT_TYPE);
	        if (stmLen === 0) i += norStart;
	      } else if (onceStart > -1) {
	        stmStack.push(ONCE_STATEMENT_TYPE);
	        if (stmLen === 0) i += onceStart;
	      }
	      if (norStart > -1 || onceStart > -1) {
	        if (stmLen === 0) {
	          res[p] && p++;
	        } else {
	          res[p].value += str.slice(i, i += norStart > -1 ? norStart : onceStart);
	        }
	        continue;
	      }

	      if (norEnd > -1 && stmStack[stmLen - 1] === NOR_STATEMENT_TYPE || onceEnd > -1 && stmStack[stmLen - 1] === ONCE_STATEMENT_TYPE) {
	        stmStack.pop();
	        if (stmLen === 1) {
	          if (onceEnd > -1) {
	            i += onceEnd;
	          } else if (norEnd > -1) {
	            i += norEnd;
	          }
	          p++;
	        } else {
	          res[p].value += str.slice(i, i += norEnd > -1 ? norEnd : onceEnd);
	        }
	        continue;
	      }
	    }

	    if (!res[p]) {
	      res[p] = {
	        type: stmLen === 0 ? CONST_STRING : stmStack[0],
	        value: ''
	      };
	    }
	    if (MARKS.test(char) && stmLen.length > 0) {
	      if (mrkLen > 0) {
	        if (str[i - 1] !== '\\') {
	          mrkStack.pop();
	        }
	      } else {
	        mrkStack.push(char);
	      }
	    }
	    res[p].value += char;
	  }

	  if (mrkStack.length !== 0) {
	    throw new SyntaxError('Unexpected ' + mrkStack.pop());
	  }
	  return res;
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();

	var _Component = __webpack_require__(5);

	var _Component2 = _interopRequireDefault(_Component);

	var _ComponentManager = __webpack_require__(16);

	var _utilityFunc = __webpack_require__(6);

	var _statementExtract = __webpack_require__(14);

	var _modelSettlement = __webpack_require__(10);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	var ComponentWatcher = function () {
	  function ComponentWatcher(base, BaseWatcher) {
	    _classCallCheck(this, ComponentWatcher);

	    this.base = base;
	    this.BaseWatcher = BaseWatcher;
	    this.modelExtractId = (0, _utilityFunc.randomId)();
	    this.instructions = this.__getInstructions();
	    this.props = this.__getProps();
	    this.model = this.__getModel();
	    this.componentManager = this.__getComponentManager();
	    this.component = this.componentManager && this.componentManager.createComponent();
	    this.__removeRootNode();
	  }

	  _createClass(ComponentWatcher, [{
	    key: 'destructor',
	    value: function destructor() {
	      this.childWatcher && this.childWatcher.forEach(function (item) {
	        item.destructor();
	      });
	      (0, _modelSettlement.deleteAll)(this.modelExtractId);
	      this.childWatcher = [];
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

	      if (!this.componentManager) return;
	      this.resolvedProps = this.__bindProps();
	      this.component.init(this.base, this.resolvedProps);
	      this.child = this.__renderComponent();
	      this.component.setDOMElement(this.child);
	      this.component.willMount();
	      this.data = (0, _utilityFunc.objectAssign)({}, this.component.props, this.component.data);
	      this.childWatcher = this.__setChildWatcher();
	      this.component.didMount();
	      cb();
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
	      var prevData = arguments[1];
	      var nextData = arguments[2];

	      var componentManager = this.__getComponentManager();
	      if (componentManager && (!this.componentManager || componentManager.id !== this.componentManager.id)) {
	        this.componentManager = componentManager;
	        this.component = this.componentManager.createComponent();
	        this.destructor();
	        this.render(cb);
	      } else if (!componentManager) {
	        this.destructor();
	      } else {
	        var oldProps = this.resolvedProps;
	        var resetWatcherList = [];
	        this.resolvedProps = this.__bindProps();
	        if (!this.component.shouldUpdate(oldProps, this.resolvedProps)) {
	          return;
	        }
	        this.component.setProps(this.resolvedProps);
	        this.component.willUpdate(oldProps, this.resolvedProps);
	        for (var key in oldProps) {
	          if (oldProps[key] !== this.component.props[key]) {
	            var _cb = (0, _modelSettlement.get)(this.modelExtractId, key);
	            this.data[key] = this.component.props[key];
	            _cb && resetWatcherList.push(_cb);
	          }
	        }
	        for (var _key in this.component.data) {
	          if (this.component.data[_key] !== this.data[_key]) {
	            var _cb2 = (0, _modelSettlement.get)(this.modelExtractId, _key);
	            this.data[_key] = this.component.data[_key];
	            _cb2 && resetWatcherList.push(_cb2);
	          }
	        }
	        this.base.runResetWatcher(resetWatcherList, this.data, cb);
	      }
	    }
	  }, {
	    key: '__removeRootNode',
	    value: function __removeRootNode() {
	      var element = this.base.element;
	      element.parentNode.removeChild(element);
	    }
	  }, {
	    key: '__setChildWatcher',
	    value: function __setChildWatcher() {
	      var _this = this;

	      var previous = null;
	      return this.child.map(function (item, index) {
	        return new _this.BaseWatcher(item, (0, _utilityFunc.objectAssign)({}, _this.data), previous, null, _this.modelExtractId, _this.component.components, _this.base, _this.base.getChildId(index));
	        previous = item;
	      });
	    }
	  }, {
	    key: '__bindProps',
	    value: function __bindProps() {
	      var _this2 = this;

	      var props = {};
	      this.props.normalProps.forEach(function (item) {
	        props[item.name] = item.value[0].value;
	      });
	      this.props.obProps.forEach(function (prop) {
	        var str = null;
	        prop.value.forEach(function (item) {
	          if (item.type === _statementExtract.NOR_STATEMENT_TYPE || item.type === _statementExtract.ONCE_STATEMENT_TYPE) {
	            var val = _this2.base.execStatement(item.value);
	            if (str === null) {
	              str = val;
	            } else {
	              str += val;
	            }
	          } else {
	            if (str === null) {
	              str = item.value;
	            } else {
	              str += item.value;
	            }
	          }
	        });
	        props[prop.name] = str;
	      });
	      return props;
	    }
	  }, {
	    key: '__renderComponent',
	    value: function __renderComponent() {
	      if (!this.component) return;
	      var frg = document.createDocumentFragment();
	      var template = document.createElement('div');
	      var parent = this.base.pastDOMInformation.parentNode;
	      if (typeof this.component.template === 'string') {
	        template.innerHTML = this.component.template;
	      } else if (typeof this.component.template === 'function') {
	        template.innerHTML = this.component.template();
	      }
	      var child = (0, _utilityFunc.toArray)(template.childNodes);
	      while (template.childNodes[0]) {
	        frg.appendChild(template.childNodes[0]);
	      }
	      parent.insertBefore(frg, this.base.pastDOMInformation.nextSibling);
	      return child;
	    }
	  }, {
	    key: '__getComponentManager',
	    value: function __getComponentManager() {
	      var componentDataFrom = this.base.execStatement(this.instructions[ComponentWatcher.instructions[0]]);
	      var componentName = this.base.pastDOMInformation.nodeName.toLowerCase();
	      var componentManager = null;

	      if (componentName === ComponentWatcher.nodeName) {
	        if (typeof componentDataFrom === 'string') {
	          if (this.base.components && this.base.components[componentDataFrom]) {
	            componentManager = this.base.components[componentDataFrom];
	          } else if (ComponentWatcher.components[componentDataFrom]) {
	            componentManager = ComponentWatcher.components[componentDataFrom];
	          }
	        } else if (componentDataFrom instanceof _ComponentManager.ComponentManager) {
	          componentManager = componentDataFrom;
	        }
	      } else {
	        if (this.base.components && this.base.components[componentName]) {
	          componentManager = this.base.components[componentName];
	        } else if (ComponentWatcher.components[componentName]) {
	          componentManager = ComponentWatcher.components[componentName];
	        }
	      }

	      return componentManager;
	    }
	  }, {
	    key: '__getInstructions',
	    value: function __getInstructions() {
	      var ins = {};
	      this.base.__filterAttr(ComponentWatcher.instructions, true).forEach(function (item) {
	        ins[item.name] = item.value;
	      });
	      return ins;
	    }
	  }, {
	    key: '__getProps',
	    value: function __getProps() {
	      var _this3 = this;

	      var props = this.base.__filterAttr(ComponentWatcher.instructions, false);
	      var obProps = [],
	          normalProps = [];
	      props.forEach(function (prop) {
	        var parsed = _this3.base.statementExtract(prop.value);
	        var type = null,
	            ob = false;
	        var obj = {};
	        obj.name = (0, _utilityFunc.toHump)(prop.name);
	        obj.value = parsed.map(function (item) {
	          if (item.type === _statementExtract.NOR_STATEMENT_TYPE || item.type === _statementExtract.ONCE_STATEMENT_TYPE) {
	            ob = true;
	          }
	          return item;
	        });
	        if (ob === true) {
	          obProps.push(obj);
	        } else {
	          normalProps.push(obj);
	        }
	      });
	      return { obProps: obProps, normalProps: normalProps };
	    }
	  }, {
	    key: '__getModel',
	    value: function __getModel() {
	      var instructionModel = this.__getInstructionsModel(),
	          propsModel = this.__getPropsModel();
	      return instructionModel.concat(propsModel);
	    }
	  }, {
	    key: '__getInstructionsModel',
	    value: function __getInstructionsModel() {
	      var res = [];
	      for (var key in this.instructions) {
	        this.base.modelExtract(this.instructions[key]).forEach(function (item) {
	          res.push(item.value);
	        });
	      }
	      return res;
	    }
	  }, {
	    key: '__getPropsModel',
	    value: function __getPropsModel() {
	      var _this4 = this;

	      var res = [];
	      this.props.obProps.forEach(function (prop) {
	        prop.value.forEach(function (item) {
	          if (item.type === _statementExtract.NOR_STATEMENT_TYPE) {
	            _this4.base.modelExtract(item.value).forEach(function (model) {
	              res.push(model.value);
	            });
	          }
	        });
	      });
	      return res;
	    }
	  }]);

	  return ComponentWatcher;
	}();

	ComponentWatcher.nodeName = 'component';
	ComponentWatcher.instructions = ['data-from', 'data-props'];
	ComponentWatcher.components = {};
	exports.default = ComponentWatcher;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ComponentManager = undefined;

	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();

	exports.createComponentManager = createComponentManager;

	var _Component = __webpack_require__(5);

	var _Component2 = _interopRequireDefault(_Component);

	var _checkComponentName = __webpack_require__(17);

	var _checkComponentName2 = _interopRequireDefault(_checkComponentName);

	var _utilityFunc = __webpack_require__(6);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	var ComponentManager = exports.ComponentManager = function () {
	  function ComponentManager(id, componentInf) {
	    _classCallCheck(this, ComponentManager);

	    this.id = id;
	    this.componentInf = componentInf;
	    this.trackingUpdate = null;
	  }

	  _createClass(ComponentManager, [{
	    key: 'createComponent',
	    value: function createComponent() {
	      var component = new _Component2.default();
	      component = (0, _utilityFunc.objectAssign)(component, (0, _utilityFunc.deepClone)(this.componentInf));
	      component.components = this.componentInf.components;
	      var scope = createScope(component);
	      bindComponentFunc(component.data, scope);
	      checkComponentsName(component.components);
	      return component;
	    }
	  }]);

	  return ComponentManager;
	}();

	function createScope(component) {
	  return {
	    data: component.data,
	    trackingUpdate: component.trackingUpdate.bind(component)
	  };
	}

	function bindComponentFunc(data, scope) {
	  for (var key in data) {
	    if ((0, _utilityFunc.is)(data[key], 'function')) {
	      data[key] = data[key].bind(scope);
	    }
	  }
	}

	function checkComponentsName(components) {
	  for (var key in components) {
	    (0, _checkComponentName2.default)(key);
	  }
	}

	function createComponentManager(componentInf) {
	  return new ComponentManager((0, _utilityFunc.randomId)(), componentInf);
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = checkComponentName;

	var _utilityFunc = __webpack_require__(6);

	function checkComponentName(componentName) {
	  for (var i = 0, len = componentName.length; i < len; i++) {
	    var code = componentName.charCodeAt(i);
	    if (code >= 65 && code <= 90) throw new SyntaxError('Unexpected token ' + componentName + ', You should not use an uppercase component name');
	  }
	  var dom = document.createElement(componentName);
	  // if(!is(dom, 'HTMLUnknownElement')) {
	  //   throw new SyntaxError(`Unexpected token ${componentName}, You should not use the tag name that already exists in HTML`);
	  // }
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();

	var _statementToString = __webpack_require__(19);

	var _statementToString2 = _interopRequireDefault(_statementToString);

	var _statementExtract = __webpack_require__(14);

	var _utilityFunc = __webpack_require__(6);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	var TextWatcher = function () {
	  function TextWatcher(base) {
	    _classCallCheck(this, TextWatcher);

	    this.base = base;
	    this.watcherType = this.base.pastDOMInformation.nodeType;
	    this.vm = this.__getViewModel();
	    this.model = this.__parseModel();
	    this.view = null;
	  }

	  _createClass(TextWatcher, [{
	    key: 'destructor',
	    value: function destructor() {
	      var node = this.base.element;
	      node.parentNode.removeChild(node);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

	      this.view = this.__parseView();
	      if (this.watcherType === TextWatcher.textNodeWatcher) {
	        this.base.element.textContent = this.view;
	      } else {
	        this.base.element.innerHTML = this.view;
	      }
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
	      var prevData = arguments[1];
	      var nextData = arguments[2];

	      if (prevData !== nextData) {
	        this.render(cb);
	      }
	    }
	  }, {
	    key: '__getViewModel',
	    value: function __getViewModel() {
	      var isTextNode = this.watcherType === TextWatcher.textNodeWatcher;
	      var content = isTextNode ? this.base.pastDOMInformation.textContent : this.base.pastDOMInformation.innerHTML;
	      return this.__replaceOnceStatement(this.base.statementExtract(content));
	    }
	  }, {
	    key: '__replaceOnceStatement',
	    value: function __replaceOnceStatement(statementList) {
	      var _this = this;

	      return statementList.map(function (item) {
	        if (item.type === _statementExtract.ONCE_STATEMENT_TYPE) {
	          item.type = _statementExtract.CONST_STRING;
	          item.value = _this.base.execStatement(item.value);
	        }
	        return item;
	      });
	    }
	  }, {
	    key: '__parseView',
	    value: function __parseView() {
	      var _this2 = this;

	      var view = '';
	      this.vm.forEach(function (item) {
	        if (item.type === _statementExtract.NOR_STATEMENT_TYPE) {
	          view += _this2.__toString(_this2.base.execStatement(item.value));
	        } else {
	          view += _this2.__toString(item.value);
	        }
	      });
	      return view;
	    }
	  }, {
	    key: '__toString',
	    value: function __toString(val) {
	      return (0, _statementToString2.default)(val);
	    }
	  }, {
	    key: '__parseModel',
	    value: function __parseModel() {
	      var _this3 = this;

	      var res = [];
	      this.vm.forEach(function (item) {
	        if (item.type === _statementExtract.NOR_STATEMENT_TYPE) {
	          _this3.base.modelExtract(item.value).forEach(function (model) {
	            res.push(model.value);
	          });
	        }
	      });
	      return res;
	    }
	  }]);

	  return TextWatcher;
	}();

	TextWatcher.textNodeWatcher = 3;
	TextWatcher.innerHTMLWatcher = 1;
	exports.default = TextWatcher;

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (val) {
	    if (val instanceof HTMLElement) {
	        return handleDOMValue(val);
	    } else {
	        return handleTextValue(val);
	    }
	};

	function handleDOMValue(DOM) {
	    var nodeName = DOM.nodeName.toLowerCase();
	    var attrs = toArray(DOM.attributes).map(function (item) {
	        return item.name + '=\'' + item.value + '\'';
	    }).join('\s');
	    return '<' + nodeName + ' ' + attrs + '>' + DOM.innerHTML + '</' + nodeName + '>';
	}
	function handleTextValue(text) {
	    return text;
	}

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var VAR_START = /[a-zA-Z_$]/;
	var VAR_AFTER = /[a-zA-Z_$0-9]/;

	var MARKS = /['"]/;
	var POINT = /\./;
	var BRK_START = /\[/;
	var BRK_END = /\]/;
	var BRC_START = /\{/;
	var BRC_END = /\}/;
	var TH_START = /\(/;
	var TH_END = /\)/;
	var COMMA = /,/;
	var COLON = /:/;
	var SPACE = /\s/;
	var BAK_SLANT = /\\/;

	var UN_EXPECT_CHAR = {
	  'function': true
	};

	/**
	 * 
	 * 
	 * @param {string} str
	 * @returns {array}
	 * 该函数返回javascript表达式之中所使用的变量
	 * 表达式之中不能含有函数作用域
	 */
	function modelExtract(str) {
	  var len = str.length;
	  var res = [];
	  var sybStk = [];
	  var brkStk = [];
	  var modelHashTable = {};

	  var i = -1,
	      p = -1;
	  while (++i < len) {
	    var char = str[i];
	    var brkTop = brkStk[brkStk.length - 1];
	    var sybTop = sybStk[sybStk.length - 1];

	    if (SPACE.test(char)) continue;
	    /**
	     * 捕获变量
	     */
	    if (char.match(VAR_START)) {
	      if (sybTop && POINT.test(sybTop) || brkTop && BRC_START.test(brkTop) && !COLON.test(sybTop)) {
	        while (++i < len && VAR_AFTER.test(str[i])) {}
	      } else {
	        res[++p] = { index: i, value: char };
	        while (++i < len && VAR_AFTER.test(str[i])) {
	          res[p].value += str[i];
	        }
	        if (modelHashTable[res[p].value]) {
	          p--;
	          res.pop();
	        } else {
	          modelHashTable[res[p].value] = true;
	        }
	        if (UN_EXPECT_CHAR[res[p].value] === true) {
	          throw new SyntaxError('Unexpected function, in Observer statement you can\'t use function');
	        }
	      }
	      i--;sybStk.pop();
	    } else if (MARKS.test(char)) {
	      while (++i < len && (str[i] !== char || BAK_SLANT.test(str[i - 1]))) {}
	      sybStk.pop();
	    } else if (BRC_START.test(char) || BRK_START.test(char) || TH_START.test(char)) {
	      sybStk.pop();
	      brkStk.push(char);
	    } else if (BRC_END.test(char) || BRK_END.test(char) || TH_END.test(char)) {
	      brkStk.pop();
	    } else if (COLON.test(char) || POINT.test(char)) {
	      sybStk.push(char);
	    } else {
	      sybStk.pop();
	    }
	  }
	  return res;
	}
	exports.default = modelExtract;

/***/ },
/* 21 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (resetWatcherList, data, cb) {
	  var count = 0,
	      len = 0;
	  resetWatcherList.forEach(function (watcherPool) {
	    if (watcherPool) {
	      for (var id in watcherPool) {
	        len++;
	        watcherPool[id].reset(data, function () {
	          count++;
	          count === len && cb();
	        });
	      }
	    }
	  });
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = registerComponent;

	var _ComponentWatcher = __webpack_require__(15);

	var _ComponentWatcher2 = _interopRequireDefault(_ComponentWatcher);

	var _checkComponentName = __webpack_require__(17);

	var _checkComponentName2 = _interopRequireDefault(_checkComponentName);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	function registerComponent(key, componentWatcher) {
	  (0, _checkComponentName2.default)(key);
	  _ComponentWatcher2.default.components[key] = componentWatcher;
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	;(function () {
	    //  根路径 (必须有)
	    var rootLocation = setRootLocation('');
	    var prvLocation = null;
	    var nowLocation = window.location.href;
	    var contextMiddleware = [];

	    var variables = {};

	    /*
	    *   context 中间件
	    */
	    function use(middleware) {
	        contextMiddleware.push(middleware);
	    }
	    /*
	    *   set设置相关的变量将挂载到app上作为变量
	    */
	    function set(key, val) {
	        variables[key] = val;
	    }
	    /*
	    *   get获取set设置的变量
	    */
	    function get(key) {
	        return variables[key];
	    }
	    // 获取跟路径
	    function getRootLocation() {
	        return rootLocation;
	    }
	    // 设置跟路径
	    function setRootLocation(location) {
	        rootLocation = window.location.protocol + '//' + window.location.host + resolveLocationPath(location);
	        return rootLocation;
	    }
	    /*
	    *   兼容Promise   
	    */
	    if (typeof Promise != 'function') {
	        var resolve = function resolve(data) {
	            var fn;
	            while (fn = this.callbackArr.shift()) {
	                try {
	                    data = fn(data);
	                } catch (e) {
	                    this.catchFn && this.catchFn(e);
	                    continue;
	                }
	                if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && data.constructor === _Promise) {
	                    var timer = setInterval(function () {
	                        if (data.PromiseStatus === 'resolved') {
	                            clearInterval(timer);
	                            resolve.call(this, data.PromiseValue);
	                        }
	                    }.bind(this));
	                    return;
	                }
	            }
	            this.PromiseStatus = 'resolved';
	            this.PromiseValue = data;
	        };
	        var reject = function reject(err) {
	            throw err;
	        };
	        var _Promise = function _Promise(fn) {
	            this.callbackArr = [];
	            this.catchFn = null;
	            this.PromiseStatus = 'pending';
	            fn(resolve.bind(this), reject.bind(this));
	        };
	        _Promise.prototype.then = function (fn) {
	            this.callbackArr.push(fn);
	            return this;
	        };
	        _Promise.prototype.catch = function (fn) {
	            this.catchFn = fn;
	        };
	    }
	    /*
	    *   Object.assign 兼容
	    */
	    function assign(target, obj) {
	        if (Object.assign) return Object.assign(target, obj);
	        if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object' || (typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
	            throw 'arguments should be object';
	        }
	        for (var key in obj) {
	            if (!target[key]) {
	                target[key] = obj[key];
	            }
	        }
	        return target;
	    }
	    /*
	    *   此函数将路径做一个强制转化
	    *   最后是此形式 /index
	    *   将会在开头填上 / 结尾去掉 / 并且字符串中不允许带有 .
	    */
	    function resolveRoutePath(path) {
	        if (typeof path !== 'string') throw 'path should be a string';
	        if (path.indexOf('.') !== -1) throw 'path should not have .';
	        if (path.replace(/\//g) === '') return '';
	        if (path[0] !== '/') path = '/' + path;
	        if (path[path.length - 1] === '/') path = path.slice(0, -1);
	        return path;
	    }
	    function resolveLocationPath(path) {
	        if (path[path.length - 1] === '/') {
	            path = path.slice(0, -1);
	        }
	        if (path === '/') path = '/';
	        return path;
	    }
	    function toArray(target) {
	        return [].slice.call(target);
	    }
	    /*
	    *   Router 路由核心类
	    *   此类可以接受一个 (前置路径)
	    *   此类有一个route方法用于添加路由
	    */
	    function Router(previousPath) {
	        if (previousPath instanceof Router) {
	            previousPath = previousPath.getRoutePath();
	        }
	        this.previousPath = previousPath ? resolveRoutePath(previousPath) : null;
	        this.routePath;
	    }
	    Router.prototype.route = function (path, callback) {
	        path = resolveRoutePath(path);
	        this.routePath = (this.previousPath || '') + path;
	        controllers.add(this.previousPath, this.routePath, callback);
	        return new Router(this.routePath);
	    };
	    Router.prototype.getRoutePath = function () {
	        return this.routePath;
	    };
	    /*
	    *   History类 提供基本页面操控
	    */
	    function History(historyType, isExtends) {
	        this.routePoor = {};
	        this.nowMatchRoute = null;
	        this.callbackArr = [];
	        this.isRunningCallback = false;
	        if (isExtends) return this;
	        if (historyType === 'hash') {} else {
	            return new BrowserHistory();
	        }
	    }
	    History.prototype._createRouteObj = function (routePath, callback, previousRouteObj) {
	        return {
	            routePath: routePath,
	            previousRouteObj: previousRouteObj,
	            routeExp: this._routePath2routeExp(routePath),
	            callback: callback
	        };
	    };
	    History.prototype._routePath2routeExp = function (routePath) {
	        if (!rootLocation) throw 'rootLocation is undefined';
	        var exp = rootLocation + routePath;
	        exp = '/^' + exp.replace(/\//g, '\\/') + '(\\?.+?=.+?)?(\\/)?$/';
	        return eval(exp);
	    };
	    History.prototype._createContext = function (routeObj) {
	        var context = new Context({
	            nowLocation: window.location.href,
	            routeObj: routeObj
	        });
	        contextMiddleware.forEach(function (item) {
	            item(context);
	        });
	        return context;
	    };
	    History.prototype._findSameRoute = function (prv, nex) {
	        var i = 0;
	        var str = '';
	        while (prv[i] || nex[i]) {
	            if (prv[i] !== nex[i]) break;
	            str += prv[i] || nex[i];
	            i++;
	        }
	        return str.replace(/(.+\/)(.+)$/, function ($1, $2) {
	            return $2;
	        });
	    };
	    History.prototype._next = function () {
	        var routeObj = this.callbackArr.pop();
	        var context = this._createContext(routeObj);
	        if ((typeof routeObj === 'undefined' ? 'undefined' : _typeof(routeObj)) === 'object' && typeof routeObj.callback === 'function') {
	            this.isRunningCallback = true;
	            routeObj.callback.call(context, this._next.bind(this));
	            return true;
	        } else {
	            this.isRunningCallback = false;
	            return false;
	        }
	    };
	    History.prototype._match = function (previousLocation) {
	        var location = window.location.href;
	        var callbackArr = [];
	        var prvMatchRoute = this.nowMatchRoute;
	        var shouldCallDesFn = true;
	        var same = this._findSameRoute(location, previousLocation || '');
	        var temp;
	        var matchFlag;
	        for (var key in this.routePoor) {
	            temp = this.routePoor[key];
	            if (temp.routeExp.test(location)) {
	                matchFlag = true;
	                this.nowMatchRoute = temp;
	                callbackArr.push(temp);
	                while (temp = temp.previousRouteObj) {
	                    if (temp === prvMatchRoute) shouldCallDesFn = false;
	                    if (!temp.routeExp.test(same) && temp.callback) {
	                        callbackArr.push(temp);
	                    } else {
	                        break;
	                    }
	                }
	            }
	        }
	        if (!matchFlag) {
	            this.nowMatchRoute = null;
	        }
	        if (shouldCallDesFn && prvMatchRoute && prvMatchRoute.shouldDoDesFn) {
	            prvMatchRoute.desFn && prvMatchRoute.desFn();
	        }
	        this.callbackArr = callbackArr;
	        !this.isRunningCallback && this._next(previousLocation);
	    };
	    History.prototype.add = function (previousPath, routePath, callback) {
	        if (this.routePoor[routePath]) {
	            this.routePoor[routePath].callback = callback;
	        }
	        this.routePoor[routePath] = this._createRouteObj(routePath, callback, this.routePoor[previousPath]);
	    };
	    /*
	    *   BrowserHistory继承History类
	    *   提供详细的页面操控(基于html5)
	    */
	    function BrowserHistory() {
	        this.history = window.history;
	    }
	    BrowserHistory.prototype = new History('', 1);
	    BrowserHistory.prototype.push = function (data, href) {
	        href = rootLocation.replace(/^https?:\/\/.+?\//, '/') + resolveRoutePath(href);
	        prvLocation = window.location.href;
	        if (nowLocation.replace(/^https?:\/\/.+?\//, '/') === href) return;
	        this.history.pushState(data, '', href);
	        this._match(prvLocation);
	        nowLocation = window.location.href;
	    };
	    BrowserHistory.prototype.addClickEvent = function (target, fn) {
	        var push = this.push.bind(this);
	        target.addEventListener('click', function (e) {
	            e.preventDefault();
	            if (!fn || fn.call(this, e)) {
	                push(target.getAttribute('data-history-json'), target.getAttribute('href'));
	            }
	        });
	    };
	    BrowserHistory.prototype.capture = function () {
	        if (arguments[0].nodeName) {
	            this.addClickEvent(arguments[0], arguments[1]);
	        } else if (arguments[0].length) {
	            for (var i = 0, len = arguments[0].length; i < len; i++) {
	                this.addClickEvent(arguments[0][i], arguments[1]);
	            }
	        }
	    };
	    /*
	    *   上下文对象 context
	    *   此对象主要包含了一些能在路由下执行方法
	    */
	    function Context(conf) {
	        this.previousLocation = conf.previousLocation;
	        this.nowLocation = conf.nowLocation;
	        this.routeObj = conf.routeObj;
	        this.rootLocation = rootLocation;
	    }
	    Context.prototype.isFrom = function (location) {
	        if (location instanceof Router) location = location.getRoutePath();
	        location = rootLocation + resolveRoutePath(location);
	        return prvLocation === location;
	    };
	    Context.prototype.set = set;
	    Context.prototype.get = get;
	    /*
	    *   Loader 类 包含加载方法
	    */
	    function Loader() {}
	    Loader.prototype.loadCache = {};
	    Loader.prototype.load = function (path) {
	        var that = this;
	        if (that.loadCache[path]) return new Promise(function (resolve, reject) {
	            resolve(that.loadCache[path]);
	        });
	        var xhr = new XMLHttpRequest();
	        var xhrPromise;
	        xhr.open('GET', path, true);
	        xhr.send(null);
	        xhrPromise = new Promise(function (resolve, reject) {
	            xhr.onload = function () {
	                if (xhr.status >= 200 && xhr.status <= 304) {
	                    that.loadCache[path] = xhr.responseText;
	                    resolve(xhr.responseText);
	                }
	            };
	        });
	        return xhrPromise;
	    };

	    Loader.prototype._getHead = function (html, path) {
	        var frag = document.createDocumentFragment();
	        var childNodes = toArray(html.getElementsByTagName('head')[0].children);
	        childNodes = childNodes.map(function (item) {
	            return this._normalizeTag(item, path);
	        }.bind(this));
	        return childNodes;
	    };
	    Loader.prototype._getCompont = function (html, path) {
	        var compont = html.getElementsByTagName('Compont')[0];
	        if (!compont) compont = html.getElementsByTagName('body')[0];
	        var childNodes = toArray(compont.childNodes);
	        childNodes = childNodes.map(function (item) {
	            return this._normalizeTag(item, path);
	        }.bind(this));
	        return childNodes;
	    };
	    /*
	    *   保持script标签的活性
	    */
	    Loader.prototype._normalizeTag = function (tag, path) {
	        var src, href;
	        if (tag.nodeType === 1) {
	            if (tag.nodeName === 'SCRIPT' && !tag.src) {
	                var scriptTag = document.createElement('script');
	                var scriptData = tag.innerHTML;
	                scriptTag.innerHTML = scriptData;
	                return scriptTag;
	            }
	            src = this._normalizeUri(tag.getAttribute('src') || '', path), href = this._normalizeUri(tag.getAttribute('href') || '', path);
	            if (tag.src) tag.src = src;
	            if (tag.href) tag.href = href;
	        }
	        return tag;
	    };
	    Loader.prototype._normalizeUri = function (uri, path) {
	        if (path[path.length - 1] !== '/') path += '/';
	        if (uri[0] === '.') uri = path + uri;
	        return uri;
	    };
	    /*
	    *   整合Context原型
	    */
	    assign(Context.prototype, Loader.prototype);
	    /*
	    *   此对象为路由池
	    *   以及一些相关的操作
	    */
	    var controllers = new History('', 0);
	    var timer = setTimeout(function () {
	        controllers._match();
	    });
	    /*
	    *   监听历史记录的修改
	    *   并且执行回调函数
	    */
	    window.onpopstate = function () {
	        controllers._match(nowLocation);
	        nowLocation = window.location.href;
	    };
	    // 设置不可访问
	    function setRestrictingAccess(obj, key, val) {
	        Object.defineProperty(obj, key, {
	            value: val,
	            writeable: false,
	            enumerable: false,
	            configurable: false
	        });
	    }
	    /*
	    *   判断当前环境 如果是amd环境的话 暴露接口
	    */
	    (function (factory) {
	        var app = {
	            Router: Router,
	            use: use,
	            capture: controllers.capture.bind(controllers),
	            redirect: controllers.push.bind(controllers),
	            getRootLocation: getRootLocation,
	            setRootLocation: setRootLocation
	        };
	        for (var key in app) {
	            setRestrictingAccess(app, key, app[key]);
	        }
	        factory(app);
	    })(function (app) {
	        if (( false ? 'undefined' : _typeof(module)) === 'object' && module.exports && exports) {
	            module.exports = app;
	        } else {
	            window.app = app;
	        }
	    });
	})(window);
	// console.log(indexRouter);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(24)(module)))

/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (module) {
		if (!module.webpackPolyfill) {
			module.deprecate = function () {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _dbind = __webpack_require__(3);

	var _dbind2 = _interopRequireDefault(_dbind);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

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
	  data: function data() {
	    return {
	      component: null,
	      props: null
	    };
	  },
	  template: function template() {
	    var props = this.props;

	    var loadingComponent = props.loadingComponent || null;

	    this.data.component = loadingComponent;

	    var propsStr = this.getPropsStr(props);

	    return '<component data-from="component" ' + propsStr + '></component>';
	  }
	});

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _dbind = __webpack_require__(3);

	var _dbind2 = _interopRequireDefault(_dbind);

	var _dbindRouterBase = __webpack_require__(23);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	exports.default = _dbind2.default.createClass({
	  didMount: function didMount() {
	    (0, _dbindRouterBase.capture)(this.refs.link);
	  },

	  template: '\n    <a ref="link" href="{{ to }}">\n      <component data-from="children"></component>\n    </a>\n  '
	});

/***/ }
/******/ ]);