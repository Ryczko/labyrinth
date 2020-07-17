const express = require("express");
const router = express.Router();
const lobbyControllers = require("../controllers/lobby");

router.get("/", lobbyControllers.getHome);

router.post("/room", lobbyControllers.postRoom);

router.get("/:room", lobbyControllers.getUniqueRoom);

module.exports = router;
