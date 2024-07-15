import { randomChoice, getImage } from "./reddit";

addEventListener("fetch", (event: FetchEvent) => {
	event.respondWith(
		handleRequest(event.request).catch(
			(err: Error) =>
				new Response(err.stack, {
					status: 500,
				}),
		),
	);
});

const subreddits = [
	{ subreddit: "anime_irl", tp: "week" },
	{ subreddit: "animehoodies", tp: "year" },
	{ subreddit: "animewallpaper", tp: "week" },
	{ subreddit: "awwnime", tp: "week" },
	{ subreddit: "imaginarymaids", tp: "month" },
	{ subreddit: "megane", tp: "year" },
	{ subreddit: "moescape", tp: "month" },
	{ subreddit: "saltsanime", tp: "year" },
	{ subreddit: "streetmoe", tp: "month" },
	{ subreddit: "wholesomeyuri", tp: "week" },
	{ subreddit: "cutelittlefangs", tp: "month" },
	{ subreddit: "pouts", tp: "year" },
];

async function handleRequest(request: Request): Promise<Response> {
	const url = new URL(request.url);
	// get the first part of the path, like https://reddit.jackli.dev/subreddit
	var subreddit = url.pathname.split("/")[1] || "";
	var pathEnd = url.pathname.split("/")[2] || "";

	if (subreddit == "api") {
		pathEnd = "api";
		subreddit = "";
	}

	var sub = subreddits.find((s) => s.subreddit === subreddit);
	if (!sub) {
		sub = randomChoice(subreddits);
	}

	if (!url.searchParams.has("t")) {
		url.searchParams.set("t", sub.tp);
	}
	if (!url.searchParams.has("sort")) {
		url.searchParams.set("sort", "top");
	}
	if (!url.searchParams.has("nsfw")) {
		url.searchParams.set("nsfw", "false");
	}

	const link = await getImage(url.searchParams, sub.subreddit);
	switch (pathEnd) {
		case "api":
			const json = JSON.stringify({
				status: 200,
				data: {
					illust: link[0],
					nsfw: link[1],
				},
			});
			return new Response(json, {
				headers: {
					"content-type":
						"application/json;charset=UTF-8",
				},
			});
		default:
			return fetch(link[0], {
				headers: {
					referer: "hayasaka.moe",
				},
			});
	}
}
