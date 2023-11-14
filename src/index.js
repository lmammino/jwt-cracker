#!/usr/bin/env node

import { fork } from "node:child_process";
import { createReadStream } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import variationsStream from "variations-stream";
import ArgsParser from "./argsParser.js";
import {
	CHUNK_SIZE,
	EXIT_CODE_FAILURE,
	EXIT_CODE_SUCCESS,
} from "./constants.js";
import { validateToken } from "./jwtValidator.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const numberFormatter = Intl.NumberFormat("en", { notation: "compact" }).format;

const { token, alphabet, maxLength, dictionaryFilePath, force } =
	new ArgsParser();

const { isTokenValid, algorithm } = validateToken(token);

if (!isTokenValid && (!force || !token.length)) {
	process.exit(EXIT_CODE_FAILURE);
}

const timeTaken = (startTime) => (new Date().getTime() - startTime) / 1000;

const printResult = (startTime, attempts, result) => {
	if (result) {
		console.log("SECRET FOUND:", result);
	} else {
		console.log("SECRET NOT FOUND");
	}
	console.log("Time taken (sec):", timeTaken(startTime));
	console.log("Total attempts:", attempts);
};

const [header, payload, signature] = token.split(".");
const content = `${header}.${payload}`;

let chunk = [];
let attempts = 0;
let isStreamClosed = false;
const startTime = new Date().getTime();
const childProcesses = [];

if (dictionaryFilePath) {
	const lineReader = createInterface({
		input: createReadStream(dictionaryFilePath),
	});

	lineReader.on("error", () => {
		console.log(
			`Unable to read the dictionary file "${dictionaryFilePath}" (make sure the file path exists)`,
		);
		process.exit(EXIT_CODE_FAILURE);
	});
	lineReader.on("line", addToQueue);
	lineReader.on("close", closeStream);
} else {
	variationsStream(alphabet, maxLength)
		.on("data", addToQueue)
		.on("end", closeStream);
}

function closeStream() {
	// purge remaining items in chunk
	purgeQueue();
	isStreamClosed = true;
}

function purgeQueue() {
	// save chunk and reset it
	forkChunk(chunk);
	chunk = [];
}

function addToQueue(comb) {
	chunk.push(comb);
	if (chunk.length >= CHUNK_SIZE) {
		purgeQueue();
	}
}

function forkChunk(chunk) {
	const child = fork(join(__dirname, "process-chunk.js"));
	childProcesses.push(child);
	child.send({ chunk, content, signature, algorithm });
	child.on("message", (result) => {
		attempts += chunk.length;
		if (result === null && attempts % (CHUNK_SIZE * 5) === 0) {
			const speed = numberFormatter(
				Math.trunc(attempts / timeTaken(startTime)),
			);
			console.log(
				`Attempts: ${attempts} (${speed}/s last attempt was '${
					chunk[chunk.length - 1]
				}')`,
			);
		}
		if (result) {
			// secret found, print result and exit
			printResult(startTime, attempts, result);
			process.exit(EXIT_CODE_SUCCESS);
		}
	});

	child.on("exit", checkFinished);
}

function checkFinished() {
	// check if all child processes have finished, and if so, exit
	childProcesses.pop();
	if (isStreamClosed && childProcesses.length === 0) {
		printResult(startTime, attempts);
		process.exit(EXIT_CODE_FAILURE);
	}
}
