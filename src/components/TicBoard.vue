<template>
<div class="wrapper">
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
    <div class="col-12 sm:col-6 field">
      <div class="card">
        <div v-if="this.winner" >
          <div class="text-lg sm:text-xl">Finished: {{ this.result }} </div>
          <Button @click="startGame" label="Play Again" icon="pi pi-replay" class="p-button-success"></Button>
        </div>
        <div v-else>
          <div class="text-lg sm:text-xl">Turn: {{ this.turn }}</div>
        </div>
      </div>
    </div>
    <div class="col-12 sm:col-6 field justify-content-between">
      <div>
      <ConfirmPopup></ConfirmPopup>
      <Toast />  
      <Inplace :closable="true" ref="extOperations">
        <template #display>
          <div class="flex flex-column">
          <Button type="button" label="Saved Games" :badge="`${this.storedCounter}`"  />
          </div>
        </template>
        <template #content>
          <div class="flex flex-column flex-grow-1 sm:flex-grow-0">
          <Dropdown v-model="selectedGame" :options="savedGames" optionLabel="lastPlayed" optionValue="Record" placeholder="Select a Game" />
          <Button @click="confirmDelete($event)" icon="pi pi-times" label="Delete All" class="p-button-danger" v-show="storedCounter > 0"></Button>  
          </div>
        </template>
      </Inplace>  
      </div>
    </div>
  </div>
  </div>

</template>

<script>
  import ACell from "./ACell.vue";
  import * as tconst from "@/lib/const.js";
  import * as DB from '@/lib/db.js';
  import ConfirmPopup from 'primevue/confirmpopup';
  import Toast from 'primevue/toast';
  

  
 
// 3x3 winning lines
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
  // data to save for each game
  let gamerecord = {
    moves: [],
    result: ' ',
  }

  export default {
    name: "TicBoard",
    components: {
      ACell,
      ConfirmPopup, Toast,
      /* Button, Dropdown, Badge, */
    },
    data() { 
      return {
        board: Array(9).fill(tconst.EMPTY_CELL),
        turn: tconst.X,
        winner: tconst.EMPTY_CELL,
        selectedGame: null,
        savedGames: [],
        storedCounter: 0,
        loading: false,
      } 
    }, 
    computed: {
      /****
       * Check winer after each move
       */
      calculateWinner() {
        for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (
            this.board[a] &&
            this.board[a] === this.board[b] &&
            this.board[a] === this.board[c]
          ) {
            // console.log(`calculateWinner ${a}`);
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
      /****
       * Result from code to humad-readible 
       */
      result() {
        if (this.winner === tconst.DRAW) return "Draw Game";
        return 'Winner ' + (this.winner === tconst.X? tconst.X: this.winner === tconst.O? tconst.O: 'Undefined');
      },
    },
   methods: {
     /*****
      * onClick processing for the board
      * @param ind - Integer the clicked cell index
      * @param replay - Boolean - true - to show saved games aniation
      * 
      */
      performMove(ind, replay = false) {
        // console.log(`performMove ${ind} ${this.turn}`);
        if (this.winner !== tconst.EMPTY_CELL) { // already finished
          return;
        }
        if (this.board[ind] !== tconst.EMPTY_CELL || (this.loading && !replay)) {
          // Invalid move.
          return;
        }
        this.board.splice(ind, 1, this.turn); // reactively modify 'x';
        // gamerecord.moves.push(this.turn === tconst.X? ind: -ind); // save cell number positive for X negative for O
        gamerecord.moves.push(ind); // save cell number as is
        let w = this.calculateWinner;
        if (w !== null) {
          if( Array.isArray(w) && w.length > 0) this.winner = this.board[w[0]];
          else if (w === tconst.DRAW) this.winner = w;
          gamerecord.result = this.winner;
          if (!replay)  // save game
            this.db_saveGame().then(()=> DB.count()).then((res) => this.storedCounter = res);    
        }
        this.changeTurn();
      },
      /***
       * the current turn procedures
       */
      changeTurn(){ this.turn = this.turn == tconst.X? tconst.O: tconst.X},
      setTurn(t){ this.turn = t},

      winnerCell(cellNo) {
        if (this.winner) {
          let w = this.calculateWinner;
          if (Array.isArray(w) && w.includes(cellNo))
            return true;

        }
        return false;

      },
      /****
       * Clear data for the new game
       */
      startGame() {
        this.board.fill(tconst.EMPTY_CELL);
        this.turn= tconst.X;
        this.winner= tconst.EMPTY_CELL;
        gamerecord.moves = [];
        gamerecord.result = ' ';
        this.loading = false;
      },
      /*****
       * Load the selected game 
       */
      loadGame() {
        this.startGame();
        if (this.selectedGame && Array.isArray(this.selectedGame)) {
          this.loading = true;
          this.selectedGame.forEach((elem, ind) => {
            setTimeout(() => {             
              this.performMove(elem, true); }, tconst.MOVING_DELAY * (ind+1)); 
          });
          setTimeout(() => { this.loading = false; }, 
            tconst.MOVING_DELAY * (this.selectedGame.length+1)); 
        }
        this.$refs.extOperations.close();

      },
/****** Database - related start */
      async db_init() {
        if(DB.getDB()) {
          console.log('db_init db already in use'); // eslint-disable-line no-console
          await DB.close();
        }
        await DB.init().then((res) => {
          if (res === DB.DB_ERR || res === DB.DB_NOTFOUND) {
            console.log(`db_init db error ${res}`); // eslint-disable-line no-console
          } else { 
            this.fillGamesArray();
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
              } else { 
                result = DB.DB_OK;
                this.fillGamesArray();                  
              }
              resolve(result);
            }); 
          }
        });
      },
      fillGamesArray() {
        DB.getGames().then((result) => {
          if (typeof result == 'object') {
                //TODO: fill games list
            while (this.savedGames.length > 0) this.savedGames.pop();
            for (let i=result.length-1; i>=0; i--) {
              let elem = result[i];
              let el2 = {id: elem.id, Result: elem.Result, Record: elem.Record, lastPlayed: new Date(elem.lastPlayed).toLocaleString()}; 
              this.savedGames.push(el2);
            }
            DB.count().then((res)=> this.storedCounter = res);
          }
        });       
      },

      clearRecords() {
        DB.clear().then(() => this.fillGamesArray());
      },

/**** Database - related end */  

      confirmDelete(event) {
            this.$confirm.require({
                target: event.currentTarget,
                message: 'Do you want to delete all saved records?',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                accept: () => {
                  this.clearRecords();
                    this.$toast.add({severity:'error', summary:'Confirmed', detail:'Records deleted', life: 3000});
                    this.$refs.extOperations.close();
                },
                reject: () => {
                    this.$toast.add({severity:'success', summary:'Cancelled', detail:'Records not deleted', life: 3000});
                    this.$refs.extOperations.close();
                }
            });
        },      
   },
    watch: {
      // whenever selectedGame changes, this function will run
    selectedGame(newSelGame) {
      if (newSelGame) {
        this.loadGame();
      }
    }

    },
    mounted() {
      this.db_init();
    },
    beforeUnmount() {
      DB.close();
  },

}
</script>

<style scoped>
  .wrapper {
    max-width: 900px;
    max-height: 900px;
    margin: 0;
    padding: 0;

  }
  .board {
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    width: 64vmin;
    height: 64vmin;
    margin: auto;

  }

@media (max-width: 576px), (max-height: 576px){ 
  .board  {
    width: 80vmin; /* calc(80vmin - 80px); */
    height: 80vmin; /* calc(80vmin - 80px); */
  }
}

@media (max-width: 500px), (max-height: 500px){ 
  .board  {
    width: 88vmin; /* calc(80vmin - 80px); */
    height: 88vmin; /* calc(80vmin - 80px); */
  }
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
</style>