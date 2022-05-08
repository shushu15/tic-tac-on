<template>
  <main>
    <TicBoard />
  </main>
</template>

<script>
import TicBoard from './components/TicBoard.vue'
export default {
  name: "App",
  components: {
    TicBoard,
  },
};
</script>
<style>
@import './assets/base.css';

 body {
    display: flex;
    place-items: center;
  }
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0;

  font-weight: normal;
}


a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}
/*
@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

}
*/
</style>
