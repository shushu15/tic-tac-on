<template>
  <div class="acell" :name="label" :class="this.glow? 'addwinner': ''">
    <img alt="X" class="xo" src="./../assets/fa-x.svg"  v-if="valX(value)" />
    <img alt="O" class="xo" src="./../assets/fa-o.svg" v-if="valO(value)" />
  </div>
</template>

<script> 
import * as tconst from "@/lib/const.js"

  export default {
    props: {
      label: String,
      value: {
        type: String,
        default: tconst.EMPTY_CELL,
      }, 
      glow: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
    valX (val) {
        return val === tconst.X;
    },
    valO (val) {
        return val === tconst.O;
    },
    /* isFinished() {
        console.log(`isFinished ${this.winner}`)
        return this.winner;
    },*/
    }
    
  };
</script>

<style scoped>
  .acell {
    border: none;
    width: 20vmin;
    height: 20vmin;
    background: none;
    color: inherit;
  }
@media (max-width: 576px), (max-height: 576px){ 
  .acell  {
    width:  25vmin; /* calc(25vmin - 28px); */
    height: 25vmin; /* calc(25vmin - 28px); */
  }
}
 
  .acell:hover {
    cursor: pointer;
  }

  .acell:focus {
    outline: none;
    background: #41b88330;
  }

  .acell:first-child,
  .acell:nth-child(2),
  .acell:nth-child(3) {
    border-top: none;
  }

  .acell:nth-child(3),
  .acell:nth-child(6),
  .acell:last-child {
    border-right: none;
  }

  .acell:nth-child(7),
  .acell:nth-child(8),
  .acell:last-child {
    border-bottom: none;
  }

  .acell:first-child,
  .acell:nth-child(4),
  .acell:nth-child(7) {
    border-left: none;
  }
  .acell.addwinner,  .acell.addwinner:focus{
    background: radial-gradient(circle at center, rgb(238, 129, 129) 0, rgba(255, 255, 255, 0.25) 100%);
  }

  .xo {
    margin: auto;
    padding: 1vmin;
    max-width: 100%;
    max-height: 100%;
    display: block;
  }

</style>