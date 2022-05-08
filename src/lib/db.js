import { openDB } from 'idb';
import * as tconst from "@/lib/const.js";

/**
 * database tic-tac-db
 * 
 * games_played store fields:
 *  Result - String - X O = or * - unknown
 *  Record - String - game record itself (format in proces)
 *  Size - Number - Board size square
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
 * @param to_save - String - game record itsef
 * @param to_square - Integer - the size of playing square (3). not used now standard 3x3
 */
export async function saveGame(to_result, to_save, to_square){
  let res =  DB_ERR;
  try {
    let oneRecord = {Result: to_result, Record: to_save, Size: to_square, lastPlayed: Date.now()};
    if (oneRecord.Result === null) oneRecord.Result = tconst.NO_RESULT;
    await db.add(storeGames, oneRecord);
    res =  DB_OK;
    // console.log(`db startGame ${typeof result === 'object'? JSON.stringify(result): result}`);
  } catch(err) {
    console.log(`db saveGame catch error ${err.toString()}`); // eslint-disable-line no-console
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
    try {
      result = await db.getAll(storeGames);
      if (result) {
        res = DB_OK;
      }
      else 
        res =  DB_NOTFOUND;
    } catch(err) {
      console.log(`db getGames ${err.toString()}`); // eslint-disable-line no-console
    }
  // }
  return res === DB_OK? result: res;  
}


export async function count() {
  const value = await db.count(storeGames);
  return value;   
}

export async function clear() {
  const value = await db.clear(storeGames);
  return value;   
}

export async function close() {
  db.close();
}


