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

const subredditConfig = {
	anime_irl: { subreddit: "anime_irl", tp: "week" },
	animehoodies: { subreddit: "animehoodies", tp: "year" },
	animewallpaper: { subreddit: "animewallpaper", tp: "week" },
	awwnime: { subreddit: "awwnime", tp: "week" },
	imaginarymaids: { subreddit: "imaginarymaids", tp: "month" },
	megane: { subreddit: "megane", tp: "year" },
	moescape: { subreddit: "moescape", tp: "month" },
	saltsanime: { subreddit: "saltsanime", tp: "year" },
	streetmoe: { subreddit: "streetmoe", tp: "month" },
	wholesomeyuri: { subreddit: "wholesomeyuri", tp: "week" },
	cutelittlefangs: { subreddit: "cutelittlefangs", tp: "month" },
};
const subredditList = Object.values(subredditConfig);

async function handleRequest(request: Request): Promise<Response> {
	const url = new URL(request.url);

	const parts = url.pathname.replace(/^\/+|\/+$/g, "").split("/");
	let subredditName = parts[0] || "";
	let pathEnd = parts[1] || "";

	if (subredditName === "api") {
		pathEnd = "api";
		subredditName = "";
	}

	let sub = subredditConfig[subredditName];
	if (!sub) {
		sub = randomChoice(subredditList);
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

	try {
		const [link, isNsfw] = await getImage(
			url.searchParams,
			sub.subreddit,
		);

		switch (pathEnd) {
			case "api":
				const json = JSON.stringify({
					status: 200,
					data: {
						illust: link,
						nsfw: isNsfw,
					},
				});
				return new Response(json, {
					headers: {
						"content-type":
							"application/json;charset=UTF-8",
					},
				});
			default:
				return fetch(link, {
					headers: {
						referer: "hayasaka.moe",
					},
				});
		}
	} catch (err) {
		return new Response(err.message, { status: 500 });
	}
}
