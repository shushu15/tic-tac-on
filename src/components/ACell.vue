<template>
  <div class="square" :name="label" :class="isFinished()? 'addwinner': ''">
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
      winner: {
        type: Boolean,
        default: false,
      }
    },
    methods: {
    valX (val) {
        return val === tconst.X;
    },
    valO (val) {
        return val === tconst.O;
    },
    isFinished() {
        console.log(`isFinished ${this.winner}`)
        return this.winner;
    },
    }
    
  };
</script>

<style scoped>
  .square {
    border: none;
    width: 10rem;
    height: 10rem;
    background: none;
    color: inherit;
    font-size: 3rem;
    font-weight: 700;
  }

  .square:hover {
    cursor: pointer;
  }

  .square:focus {
    outline: none;
    background: #41b88330;
  }

  .square:first-child,
  .square:nth-child(2),
  .square:nth-child(3) {
    border-top: none;
  }

  .square:nth-child(3),
  .square:nth-child(6),
  .square:last-child {
    border-right: none;
  }

  .square:nth-child(7),
  .square:nth-child(8),
  .square:last-child {
    border-bottom: none;
  }

  .square:first-child,
  .square:nth-child(4),
  .square:nth-child(7) {
    border-left: none;
  }
  .square.addwinner,  .square.addwinner:focus{
    background: radial-gradient(circle at center, rgb(238, 129, 129) 0, rgba(255, 255, 255, 0.25) 100%);
  }

  .xo {
    margin: auto;
    padding: 1rem;
    max-width: 100%;
    max-height: 100%;
    display: block;
  }

</style>