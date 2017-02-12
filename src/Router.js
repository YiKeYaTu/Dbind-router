import Dbind from 'dbind';
import { Router, setRootLocation, redirect } from 'dbind-router-base';

export default Dbind.createClass({
  willMount() {
    const routeConfig = this.props.routeConfig;
    const rootPath = this.props.rootPath;
    if(!routeConfig) throw new TypeError('You should hava a routeConfig props for router to control route');
    if(!rootPath) throw new TypeError('');

    setRootLocation(rootPath);
    const Route = new Router();
    this.handlePath(routeConfig, Route, [], 0);
  },
  handlePath(routeConfig, Route, target, index) {
    const component = routeConfig.component;
    const path = routeConfig.path;
    const redirect = routeConfig.redirect;
    const onCb = routeConfig.on;
    const leaveCb = routeConfig.leave;
    Route = Route.route(routeConfig.path, function(next) {
      if(redirect) {
        redirect({}, redirect);
      } else {
        target[index] = component;
          onCb && onCb();
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
    const tree = {};
    let p = tree;
    for(let i = 0; i <= end; i ++) {
      p.component = array[i];
      p.children = (i !== end && array[i + 1]) || null;
      p = p.children;
    }
    return tree;
  },
  data: {
    componentInf: { }
  },
  template: `
    <component data-from="componentInf.component" children="{{ componentInf.children || {} }}"></component>
  `
});