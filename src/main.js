import "primeflex/primeflex.css";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
// import BadgeDirective from 'primevue/badgedirective';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Badge from 'primevue/badge';
import Inplace from 'primevue/inplace';
  

const app = createApp(App);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);
// app.directive('badge', BadgeDirective);
app.component('Button', Button); // eslint-disable-line vue/multi-word-component-names
app.component('Dropdown', Dropdown); // eslint-disable-line vue/multi-word-component-names
app.component('Badge', Badge); // eslint-disable-line vue/multi-word-component-names
app.component('Inplace', Inplace); // eslint-disable-line vue/multi-word-component-names


app.mount('#app');
