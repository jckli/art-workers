import { rankImage, randomChoice, formatDate } from "./hibiapi";
import { pximgProxy } from "./pximg";

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

async function handleRequest(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const reg = /\/(?<id>\d+)\/?/;
	if (!url.searchParams.has("mode")) {
		url.searchParams.set(
			"mode",
			randomChoice(["day", "week", "month"]),
		);
	}
	if (!url.searchParams.has("date")) {
		const date = new Date();
		date.setDate(
			date.getDate() - Math.ceil(Math.random() * 365 * 2),
		);
		url.searchParams.set("date", formatDate(date));
	}
	if (!url.searchParams.has("nsfw")) {
		url.searchParams.set("nsfw", "true");
	}
	const link = await rankImage(url.searchParams);

	switch (url.pathname) {
		case "/":
			return fetch(link[0], {
				headers: {
					referer: "https://www.pixiv.net/",
				},
			});
		case "/api":
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
			if (reg.exec(url.pathname)) {
				return pximgProxy(url.pathname);
			}
			return new Response(`Not Found: ${request.url}`, {
				status: 404,
			});
	}
}
