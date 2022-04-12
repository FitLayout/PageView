import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';
import router from './router';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';          


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
import ToastService from 'primevue/toastservice';
import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css";

import 'vue-prism-editor/dist/prismeditor.min.css'; // import the editor base styles
import 'prismjs/themes/prism.css'; // import syntax highlighting styles

import 'rdf-storage-browsing-web-interface/dist/style.css'
import install from 'rdf-storage-browsing-web-interface'
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const app = createApp(App);
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);
app.use(router);

app.use(install);
app.component("Toast", Toast);
app.component("Dialog", Dialog);

app.directive('tooltip', Tooltip);

app.mount('#app');
