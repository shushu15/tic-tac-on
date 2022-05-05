import "primeflex/primeflex.css";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
// import BadgeDirective from 'primevue/badgedirective';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Badge from 'primevue/badge';
  

const app = createApp(App);
app.use(PrimeVue);
// app.directive('badge', BadgeDirective);
app.component('Button', Button); // eslint-disable-line vue/multi-word-component-names
app.component('Dropdown', Dropdown); // eslint-disable-line vue/multi-word-component-names
app.component('Badge', Badge); // eslint-disable-line vue/multi-word-component-names


app.mount('#app');
