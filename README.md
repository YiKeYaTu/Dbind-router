# 简介

- Dbind前端路由组件

# 开始

- 建议使用webpack等打包工具进行项目构建

- npm i dbind
- npm i dbind-router

````html
    <body>
        <app></app>
    </body>
````

````javascript
    var Dbind = require('dbind');
    var DbindRouter = require('dbind-router');

    var App = Dbind.createClass({
      data: {
        rootPath: '...', // Your project root path
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
        router: DbindRouter
      }
    });

    Dbind.registerComponent('app', App);
    Dbind.watch(document.body);

````