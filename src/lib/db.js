import { openDB } from 'idb';
import * as tconst from "@/lib/const.js";

/**
 * database tic-tac-db
 * 
 * games_played store fields:
 *  Result - String - X O = or * - unknown
 *  Record - String - game record itself (format in proces)
 *  lastPlayed - Date.now() - date of last played (maybe only date, not time)
 *  PlayerX - not used now, can be any for one player, but not for multiplayer 
 *  PlayerO -not used now
 *  
 */

let db;
const dbName = 'tic-tac-db';
const storeGames = 'games_played';
export const DB_OFF = -2;
export const DB_ERR = -1;
export const DB_NOTFOUND = 0;
export const DB_OK = 1;


export function getDB() {
  return db;
}
export async function init(){
  // Set up the database
  let res =  DB_ERR;
  if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB'); // eslint-disable-line no-console
    return DB_NOTFOUND;
  }  
  try {
    db = await openDB(dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(storeGames))
          db.createObjectStore(storeGames, {keyPath: "id", autoIncrement: true});
      },
    });
    res =  DB_OK;
  } catch(err) {
    console.log(`db init ${err.toString()}`); // eslint-disable-line no-console
  }
  return res;  
}
/*******
 * @param to_result - String game result, needs processing from null -> *
 * @param to_save - game record itsef
 */
export async function saveGame(to_result, to_save){
  let res =  DB_ERR;
  try {
    let oneRecord = {Result: to_result, Record: to_save, lastPlayed: Date.now()};
    if (oneRecord.Result === null) oneRecord.Result = tconst.NO_RESULT;
    await db.add(storeGames, oneRecord);
    res =  DB_OK;
    // console.log(`db startGame ${typeof result === 'object'? JSON.stringify(result): result}`);
  } catch(err) {
    console.log(`db startGame catch error ${err.toString()}`); // eslint-disable-line no-console
  }
  // console.log(`db startGame res=${res}`);
  return res;  
}


/**
 * List all played games
 */
 export async function getGames(){
  let res =  DB_ERR;
  let result = [];
  // if (cache.length > 0) {
  //  result = cache;
  //  res = DB_OK;
  // } else {
    try {
      result = await db.getAll(storeGames);
      if (result) {
        res = DB_OK;
        // result.forEach(element => cache.push(element)); // due to reactivity we need on-element adding
        // cache.stickers = result;
      }
      else 
        res =  DB_NOTFOUND;
    } catch(err) {
      console.log(`db getGames ${err.toString()}`); // eslint-disable-line no-console
    }
  // }
  return res === DB_OK? result: res;  
}


/**
 * @param cache  dbCache.stickers
 */
/*
 export async function checkForPrize() {
  let res =  DB_ERR;
  let prize = DB_NOTFOUND;
  try {
    let nMaxGame, nToPrizeMax = 0, nToPrizeSum = 0;
    let cursor = await db.transaction(storeGames).store.openCursor();
    while (cursor) {   
      let nToPrize = Math.round(cursor.value.nToPrize / (cursor.value.prizeCounter * recountCoeff(cursor.value.nToPrize, cursor.value.WB===undefined? 0: cursor.value.WB) + 1)); // we count games played for prize div by the number of issued prizes with coeff for this game
      // search for the game played most from last prize
      if (nToPrize > nToPrizeMax) {
        nToPrizeMax = nToPrize;
        nMaxGame = cursor.value.gameID;
      }
      nToPrizeSum += nToPrize;
      // console.log(cursor.key, cursor.value);
      cursor = await cursor.continue();
    }
    // console.log(`checkForPrize nToPrizeSum=${nToPrizeSum}`);
    if (nToPrizeSum >= sumToPrize())  { // add a prize
      prize = {prize: listPrizes[getRandomInt(listPrizes.length)], color: listColors[getRandomInt(listColors.length)], gameID: nMaxGame, dateIssued: Date.now()};
      await db.add(storePrizes, prize);
      // update cache - we can reQuery database or add it to cache manually 
      // for now I'mm adding just to cache
      // cache.push(prize);

      // cursor to clear prizeCounters
      cursor = await db.transaction(storeGames, "readwrite").store.openCursor();
      while (cursor) {
        let record = cursor.value;
        if (record.nToPrize > 0 || record.gameID === nMaxGame) {
          record.nToPrize = 0;
          record.WB = 0;
          record.prizeCounter++;
          await cursor.update(record);
        }
        cursor = await cursor.continue();
      }
      res = DB_OK;
    } else res = DB_NOTFOUND;   
  } catch(err) {
    console.log(`db checkForPrize ${err.toString()}`); // eslint-disable-line no-console
  }
  return res === DB_OK? prize: res;  

}
*/

export async function close() {
  db.close();
}
/*
export function clearCache() {
  while(cache.stickers.length > 0) cache.stickers.pop(); // = undefined;
}
*/
/*
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
*/


