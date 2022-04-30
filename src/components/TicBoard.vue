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
      :winner="winnerCell(i)"
    />
  </div>
</template>

<script>
  import ACell from "./ACell.vue";
  import * as tconst from "@/lib/const.js"

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  export default {
    name: "TicBoard",
    components: {
      ACell,
    },
  data() { return {
      board: Array(9).fill(tconst.EMPTY_CELL),
      turn: tconst.X,
      winner: tconst.EMPTY_CELL,
    } }, 
    computed: {
      calculateWinner() {
        for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (
            this.board[a] &&
            this.board[a] === this.board[b] &&
            this.board[a] === this.board[c]
          ) {
            console.log(`calculateWinner ${a}`);
            return lines[i];
          }
        }
        if (this.board.every((val) => val)) return tconst.DRAW;

        return tconst.EMPTY_CELL;
      }
    },
   methods: {
      performMove(i) {
        console.log(`performMove ${i} ${this.turn}`);
        if (this.board[i] !== tconst.EMPTY_CELL) {
          // Invalid move.
          return;
        }
        if (this.winner !== tconst.EMPTY_CELL) { // already finished
          return;
        }
        this.board.splice(i, 1, this.turn); // reactively modify 'x';
        let w = this.calculateWinner;
        if (w !== null && Array.isArray(w) && w.length > 0)
          this.winner = this.board[w[0]];
        this.changeTurn();
      },
      changeTurn(){ this.turn = this.turn == tconst.X? tconst.O: tconst.X},
      winnerCell(cellNo) {
        if (this.winner) {
          let w = this.calculateWinner;
          if (Array.isArray(w) && w.includes(cellNo))
            return true;

        }
        return false;

      }
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