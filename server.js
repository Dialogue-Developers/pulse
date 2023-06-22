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
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
	console.log(`CONNECTED ${socket.id}`);

	socket.on("disconnect", (reason) => {
		global.localStorage.clear();
		console.log(`DISCONNECTED ${socket.id}: ${reason}`);
	});

	let openaiHistory = [];

	socket.on("message", (data) => {
		data = JSON.parse(JSON.stringify(data));

		console.log(`QUESTION (${socket.id}) [${data.engine}]: ${data.question}`);

		// OpenAI Engine
		if (data.engine == "openai") {
			let messages = [];

			messages.push({
				role: "system",
				content: "You're a AI health assistant called Pulse that can diagnose user diseases based on symptoms that the user is having. The assistant is helpful, creative, clever, and very friendly.",
			});

			for (const [input_text, completion_text] of openaiHistory) {
				messages.push({
					role: "user",
					content: input_text,
				});
				messages.push({
					role: "assistant",
					content: completion_text,
				});
			}

			messages.push({
				role: "user",
				content: data.question,
			});

			(async () => {
				try {
					const completion = await openai.createChatCompletion({
						model: "gpt-3.5-turbo",
						messages: messages,
					});

					// console.log(completion.data.choices);

					openaiHistory.push([data.question, completion.data.choices[0].message.content]);

					console.log(`ANSWER (${socket.id}): ${completion.data.choices[0].message.content}`);

					socket.emit("answer", completion.data.choices[0].message.content);
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

const port = process.env.PORT || 80;

server.listen(port, () => {
	console.log("server started at port " + port);
});
