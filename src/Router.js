import Dbind from 'dbind';
import { Router, setRootLocation, redirect } from 'dbind-router-base';

export default Dbind.createClass({
  keepProps: ['rootPath', 'routeConfig'],
  willMount() {
    const routeConfig = this.props.routeConfig;
    const rootPath = this.props.rootPath;
    if(!routeConfig) throw new TypeError('You should hava a routeConfig props for router to control route');
    if(!rootPath) throw new TypeError('');

    setRootLocation(rootPath);
    const Route = new Router();
    if(Object.prototype.toString.call(routeConfig) === '[object Array]') {
      routeConfig.forEach((children) => {
        this.handlePath(children, Route, [], 0);
      });
    } else {
      this.handlePath(routeConfig, Route, [], 0);
    }
  },
  getPropsStr(props) {
    let propsStr = '';
    for (let key in props) {
      if (this.keepProps.indexOf(key) === -1)
        propsStr += `${key}="${props[key]}" `;
    }
    return propsStr;
  },
  handlePath(routeConfig, Route, target, index) {
    const component = routeConfig.component;
    const path = routeConfig.path;
    const redirect = routeConfig.redirect;
    const enterCb = routeConfig.enter;
    const leaveCb = routeConfig.leave;

    Route = Route.route(path, function(next) {
      if(redirect) {
        redirect({}, redirect);
      } else {
        if(
          !target[index] || 
            ( target[index].component !== component || 
              target[index].component === component && target[index].path !== path
            )
          ) {
          target[index] = {
            path,
            component
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

    if(routeConfig.children) {
      routeConfig.children.forEach((children) => {
        this.handlePath(children, Route, target, index + 1);
      });
    }
  },
  arrayToTree(array, end) {
    let tree = {
      component: array[0].component
    };
    let prev = tree;
    for (let i = 1; i <= end; i++) {
      let temp = {
        component: array[i].component
      };
      prev.children = temp;
      prev = temp;
    }
    for (let i = end + 1, len = array.length; i < len; i ++) {
      array[i] = null;
    }
    return tree;
  },
  data() {
    return {
      componentInf: { }
      }
  },
  template () {
    let propsStr = this.getPropsStr(this.props);
    return `
      <component ${propsStr} data-from="componentInf.component" children="{{ componentInf.children || {} }}"></component>
    `
  }
});