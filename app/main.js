import Vue from 'nativescript-vue'
import App from './components/App'



Vue.registerElement(
  'PullToRefresh',
  () => require('@nstudio/nativescript-pulltorefresh').PullToRefresh
);

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')


new Vue({
  
  render: h => h('frame', [h(App)])
}).$start()
