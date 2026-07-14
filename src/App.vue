<template>
  <router-view />
</template>

<style>
:root {
  --app-font: Inter, "Instrument Sans", ui-sans-serif, system-ui, sans-serif;
  --app-text: rgb(17, 20, 17);
  --app-heading-size: 24px;
  --app-heading-line-height: 25px;
  --app-heading-weight: 800;
}

html,
body,
#app {
  min-height: 100%;
}

html,
body,
button,
input,
textarea,
select {
  font-family: var(--app-font);
  color: var(--app-text);
}

body {
  margin: 0;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--app-font);
  font-weight: var(--app-heading-weight);
  color: var(--app-text);
}

h1,
h2 {
  font-size: var(--app-heading-size);
  line-height: var(--app-heading-line-height);
}
</style>
