import { Router, Link } from '../src/index';
import Dbind from 'dbind';

const indexApp = Dbind.createClass({
  template: `
    <h1>hello index{{ ri }}</h1>
    <link to="/user" value="toUser"></link>
  `,
  components: {
    link: Link
  }
});

const userApp = Dbind.createClass({
  didMount() {
    
  },  
  template: `
    <h1 ref="sa">hello user {{ ri }}</h1>
    <link to="/index" value="toIndex"></link>
  `,
  components: {
    link: Link
  }
});

const rootApp = Dbind.createClass({
  didMount() {
    
  },
  willMount() {
  },
  willUpdate(prev, next) {
    
  },
  template: `
    <div ref="div">
      hello rootApp
      <link to="/index" value="toIndex"></link>
      <link to="/user" value="toUser"></link>
      and this is my son<component data-from="children.component" children=" {{ children.children }} " ri="{{ 1+1 }}" ></component>
    </div>
  `,
  components: {
    link: Link
  }
});

const App = Dbind.createClass({
  data: {
    rootPath: '/Dbind-router',
    routeConfig: {
      path: '/',
      component: rootApp,
      children: [{
        path: '/user',
        component: userApp
      }, {
        path: '/index',
        component: indexApp,
      }]
    }
  },
  template: `
    <router root-path="{{ rootPath }}" route-config="{{ routeConfig }}" ></router>
  `,
  components: {
    router: Router
  }
});

Dbind.registerComponent('app', App);
Dbind.watch(document.body);
