import Board from "./Board/Board.js";
import Put from "./Board/Put.js";
import Start from "./Start/Start.js"

//map initialization
const board = new Board();
const put = new Put();

//argument = number of players
const start = new Start(4, put);