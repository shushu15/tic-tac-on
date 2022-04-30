<template>
  <header>
    <!-- img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" / -->

    <div class="wrapper">
    </div>
  </header>

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
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
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

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

}
</style>
