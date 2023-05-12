import { Configuration, OpenAIApi } from "openai";
import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import { pulseEngine } from "./pulse-engine.js";

dotenv.config();

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();

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
		console.log(`DISCONNECTED ${socket.id}: ${reason}`);
	});

	socket.on("message", (data) => {
		data = JSON.parse(JSON.stringify(data));

		console.log(`QUESTION (${socket.id}) [${data.engine}]: ${data.question}`);

		if (data.engine == "openai") {
			(async () => {
				try {
					const completion = await openai.createCompletion({
						model: "text-davinci-003",
						prompt:
							"The following is a conversation with an AI assistant called Chatterbox. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by Dialogue Developers. How can I help you today?\nHuman: " +
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
		} else if (data.engine == "pulse") {
			(async () => {
				try {
					const answer = await pulseEngine(data.question);

					console.log(`ANSWER (${socket.id}): ${answer}`);

					socket.emit("answer", answer);
				} catch (error) {
					console.log(error);
				}
			})();
		}
	});
});

server.listen(5000, function () {
	console.log("server started at port 5000");
});
