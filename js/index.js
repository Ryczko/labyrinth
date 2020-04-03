import Board from "./Board/Board.js";
import Put from "./Board/Put.js";
import Start from "./Start/Start.js";
import { inicializeChat } from './Chat/chat.js'

//map initialization
const board = new Board();
const put = new Put();
inicializeChat();
//argument = number of players
const start = new Start(4, put);