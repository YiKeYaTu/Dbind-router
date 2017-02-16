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
    this.handlePath(routeConfig, Route, [], 0);
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
    Route = Route.route(routeConfig.path, function(next) {
      if(redirect) {
        redirect({}, redirect);
      } else {
        target[index] = component;
        component.componentInf.enter = enterCb;
        if(!next()) {
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
      component: array[0]
    };
    let prev = tree;
    for (let i = 1; i <= end; i++) {
      let temp = {
        component: array[i]
      };
      prev.children = temp;
      prev = temp;
    }
    return tree;
  },
  data: {
    componentInf: { }
  },
  template () {
    let propsStr = this.getPropsStr(this.props);
    return `
      <component ${propsStr} data-from="componentInf.component" children="{{ componentInf.children || {} }}"></component>
    `
  }
});