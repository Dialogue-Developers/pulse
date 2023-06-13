import { Configuration, OpenAIApi } from "openai";
import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import { LocalStorage } from "node-localstorage";

// Our imports
import { pulseEngine } from "./pulse-engine.js";

// Set up local storage
global.localStorage = new LocalStorage("./temp");
// Clear the local storage
global.localStorage.clear();

dotenv.config();

// OpenAI API
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Express
const app = express();

// Socket.io
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

app.use(express.static("public"));

io.on("connection", (socket) => {
	console.log(`CONNECTED ${socket.id}`);
	
	socket.on("disconnect", (reason) => {
		global.localStorage.clear();
		console.log(`DISCONNECTED ${socket.id}: ${reason}`);
	});
	

	socket.on("message", (data) => {
		data = JSON.parse(JSON.stringify(data));

		console.log(`QUESTION (${socket.id}) [${data.engine}]: ${data.question}`);

		// OpenAI Engine
		if (data.engine == "openai") {
			(async () => {
				try {
					const completion = await openai.createCompletion({
						model: "text-davinci-003",
						prompt:
							"The following is a conversation with an AI health assistant called Pulse that can diagnose user diseases based on symptoms that the user is having. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you today?\nAI: I am an AI created by Dialogue Developers. How can I help you today?\nHuman: " +
							data.question +
							"\nAI:",
						temperature: 0.6,
					});
					// res.status(200).json({ result: completion.data.choices[0].text });

					console.log(`ANSWER (${socket.id}): ${completion.data.choices[0].text}`);

					socket.emit("answer", completion.data.choices[0].text);
				} catch (error) {
					console.log(error);
				}
			})();

		// Pulse Engine
		} else if (data.engine == "pulse") {
			pulseEngine(data.question, socket.id).then((response) => {
				console.log(`ANSWER (${socket.id}): ${response}`);
				socket.emit("answer", response);
			});
		}
	});
});

server.listen(443, function () {
	console.log("server started at port 443");
});
