<template>
  <div class="board">
    <span class="vertical-line-1"></span>
    <span class="vertical-line-2"></span>
    <ACell
      v-for="(cell, i) in board"
      :key="`cell-${i}`"
      :label="`cell-${i}`"
      :value="cell"
      @click="performMove(i)"
      :winner="calculateWinner"
    />
  </div>
</template>

<script>
  import ACell from "./ACell.vue";
  import * as tconst from "@/lib/const.js"


  export default {
    name: "TicBoard",
    components: {
      ACell,
    },
  data() { return {
      board: Array(9).fill(tconst.EMPTY_CELL),
      turn: tconst.X,
    } },  
   methods: {
      performMove(i, side) {
        if (this.board[i] !== tconst.EMPTY_CELL) {
          // Invalid move.
          return;
        }
        this.board.splice(i, 1, side); // reactively modify 'x';
        this.changeTurn();
      },
      changeTurn(){ this.turn = this.turn == tconst.X? tconst.O: tconst.X}
    }    
  };
</script>

<style scoped>
  .board {
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }

  .board::before,
  .board::after {
    background: linear-gradient(to right, #41b883, #35495e);
  }

  .vertical-line-1,
  .vertical-line-2 {
    background: linear-gradient(to right, #41b883, #35495e);
  }

  .board::before,
  .board::after {
    content: "";
    width: 100%;
    height: 5px;
    position: absolute;
    border-radius: 1rem;
  }

  .board::before {
    top: 33%;
  }

  .board::after {
    top: 66%;
  }

  .vertical-line-1,
  .vertical-line-2 {
    position: absolute;
    width: 100%;
    height: 5px;
    top: 50%;
    border-radius: 1rem;
    transform: translate(-50%, -50%) rotate(90deg);
  }

  .vertical-line-1 {
    left: 33%;
  }

  .vertical-line-2 {
    left: 66%;
  }
</style>