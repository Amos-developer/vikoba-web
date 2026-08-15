import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/management-pages.css";
import { initializeTablePagination, paginate } from "./directives/paginate.js";
import { initializeLocalization } from "./i18n/index.js";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.directive("paginate", paginate);

app.mount("#app");
initializeTablePagination();
initializeLocalization();
