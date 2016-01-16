import { LoadTextAsync } from "./FileHelper.js";

// TODO: Okay, this SUCKS at the moment!! The promises/tasks are executed sequentally and not in parallel!!
export async function WaitAll(collection, func) {
	return new Promise(async function(resolve, reject) {
		try {
			let paths = [];
			for(let elem of collection) { // argh ^^ !!
				paths.push(await func(elem));
			}

			resolve(paths);
		}
		catch(err) {
			reject(err);
		}
	});
}
