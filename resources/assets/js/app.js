
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

// Vue.component('example', require('./components/Example.vue'));
// Vue.component('hzfe-index', require('./components/Index.vue'));
// Vue.component('index-middle', require('./components/index/Middle.vue'));
// Vue.component('index-member', require('./components/index/Member.vue'));
Vue.component('hzfe-index-member-card', require('./components/MemberCard.vue'));
Vue.component('hzfe-index-about-us', require('./components/TheAboutUs.vue'));
Vue.component('hzfe-index-first-screen', require('./components/TheFirstScreen.vue'));
Vue.component('hzfe-index-footer', require('./components/TheFooter.vue'));
Vue.component('hzfe-index-member', require('./components/TheMember.vue'));
Vue.component('hzfe-index-works', require('./components/TheWorks.vue'));

const app = new Vue({
    el: '#app'
});
