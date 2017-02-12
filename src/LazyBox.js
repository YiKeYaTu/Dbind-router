import Dbind from 'dbind';
// import fetch from 'fetch';

const LazyBox = Dbind.createClass({
  keepProps: [
    'loadingComponent',
    'loadPath'
  ],
  didMount() {
    const loadPath = props.loadPath;
    if(!loadPath)
      throw new TypeError('You should set load-path props for this component');
    fetch(loadPath)
      .then((res) => {

      });
  },
  getPropsStr(props) {
    let propsStr = '';
    for (let key in props) {
      if (this.keepProps.indexOf(key) === -1)
        propsStr += `${key}="${props[key]}" `;
    }
    return propsStr;
  },
  data: {
    component: null,
    props: null
  },
  template() {
    const props = this.props;

    const loadingComponent = props.loadingComponent || null;

    this.data.component = loadingComponent;

    let propsStr = this.getPropsStr(props);

    return `<component data-from="component" ${propsStr}></component>`;
  }
});