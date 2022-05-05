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
      :glow="winnerCell(i)"
    />
  </div>

  <div class="p-fluid grid mt-2">
    <div class="col-12 md:col-6 field">
      <div class="card">
        <div v-if="this.winner" >
          <h2>Finished: {{ this.result }} </h2>
          <Button @click="startGame" label="Play Again" class="p-button-success"></Button>
        </div>
        <div v-else>
          <h2>Turn: {{ this.turn }}</h2>
        </div>
      </div>
    </div>
    <div class="col-12 md:col-6 field">
      <div class="card">
        <Button type="button" label="Saved Games" badge="8"  />
        <Dropdown v-model="selectedGame" :options="savedGames" optionLabel="name" optionValue="code" placeholder="Select a Game" />
      </div>
    </div>
  </div>

</template>

<script>
  import ACell from "./ACell.vue";
  import * as tconst from "@/lib/const.js";
  import * as DB from '@/lib/db.js';
  
 

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
  let gamerecord = {
    moves: [],
    result: ' ',
  }

  export default {
    name: "TicBoard",
    components: {
      ACell,
      /* Button, Dropdown, Badge, */
    },
  data() { return {
      board: Array(9).fill(tconst.EMPTY_CELL),
      turn: tconst.X,
      winner: tconst.EMPTY_CELL,
      selectedGame: null,
      savedGames: [
        {name: 'New York', code: 'NY'},
        {name: 'Rome', code: 'RM'},
        {name: 'London', code: 'LDN'},
        {name: 'Istanbul', code: 'IST'},
        {name: 'Paris', code: 'PRS'},
      ],

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
            gamerecord.result = this.board[a];
            return lines[i];
          }
        }
        if (this.board.every((val) => val)) {
          gamerecord.result = tconst.DRAW;
          return tconst.DRAW;
        }

        return tconst.EMPTY_CELL;
      },
      result() {
        if (this.winner === tconst.DRAW) return "Draw Game";
        return 'Winner ' + (this.winner === tconst.X? tconst.X: this.winner === tconst.O? tconst.O: 'Undefined');
      },
    },
   methods: {
      performMove(i) {
        console.log(`performMove ${i} ${this.turn}`);
        if (this.winner !== tconst.EMPTY_CELL) { // already finished
          return;
        }
        if (this.board[i] !== tconst.EMPTY_CELL) {
          // Invalid move.
          return;
        }
        this.board.splice(i, 1, this.turn); // reactively modify 'x';
        gamerecord.moves.push(this.turn === tconst.X? i: -i); // save cell number positive for X negative for O
        let w = this.calculateWinner;
        console.log(`performMove 2 ${w}`);
        if (w !== null) {
          if( Array.isArray(w) && w.length > 0) this.winner = this.board[w[0]];
          else if (w === tconst.DRAW) this.winner = w;
          gamerecord.result = this.winner;
          this.db_saveGame();
          // save game
        }
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

      },
      startGame() {
        this.board.fill(tconst.EMPTY_CELL);
        this.turn= tconst.X;
        this.winner= tconst.EMPTY_CELL;
        gamerecord.moves = [];
        gamerecord.result = ' ';
      },
      async db_init() {
        if(DB.getDB()) {
          console.log('db_init db already in use'); // eslint-disable-line no-console
          await DB.close();
        }
        await DB.init().then((res) => {
          if (res === DB.DB_ERR || res === DB.DB_NOTFOUND) {
            console.log(`db_init db error ${res}`); // eslint-disable-line no-console
          } else { 
            DB.getGames().then((result) => {
              if (typeof result == 'object') {
                //TODO: fill games list
              }
            }); 
          }
        });
      },
      db_saveGame() {
        return new Promise((resolve) => {
          let result = DB.DB_OFF;
          if(DB.getDB()) {
            DB.saveGame(gamerecord.result, gamerecord.moves, tconst.SQ_SIZE).then((res) => {
              if (res === DB.DB_ERR || res === DB.DB_NOTFOUND) {
                result = res;
                console.log(`db_saveGame error ${res}`); // eslint-disable-line no-console
              } else result = DB.DB_OK;
              resolve(result);
            });
          }
        });
      }
    },
    mounted() {
      this.db_init();
    }
}
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
    background: hsla(160, 100%, 37%, 1);
  }

  .vertical-line-1,
  .vertical-line-2 {
    background: hsla(160, 100%, 37%, 1);
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
  .btn_new {
    background: hsla(160, 100%, 37%, 1);
    border: none;
    border-radius: 5px;
    padding: 1rem 1.5rem;
    color: black;
    text-transform: uppercase;
}
</style>