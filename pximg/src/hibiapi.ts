type Illust = {
	meta_pages: {
		image_urls: {
			original: string;
		};
	}[];
	meta_single_page: {
		original_image_url: string;
	};
	sanity_level: number;
};
type responseIllust = Illust;

type responseRank = Illust[];

export function randomChoice<T>(list: T[]): T {
	if (list.length === 0) {
		throw new Error("Cannot choose from an empty list");
	}
	return list[Math.floor(Math.random() * list.length)] as T;
}

export async function requestJson(
	input: RequestInfo,
	init?: RequestInit,
): Promise<any> {
	const response = await fetch(input, init);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
}

export async function getImage(id: number): Promise<Response> {
	const illust: responseIllust = await requestJson(
		`https://pymapi.hayasaka.moe/v1/pixiv/illust/details/${id}`,
		{
			headers: { "Cache-Control": "no-store" },
		},
	);

	const image = illust.meta_pages.length
		? randomChoice(illust.meta_pages).image_urls.original
		: illust.meta_single_page.original_image_url;

	return fetch(image, {
		headers: {
			Referer: "https://www.pixiv.net",
		},
	});
}

export async function rankImage(
	params: URLSearchParams,
): Promise<[string, boolean]> {
	const nsfw = params.get("nsfw");
	const mode = params.get("mode") || "week";

	if (nsfw === "only") {
		const nsfwModeMap: { [key: string]: string } = {
			day: "day_r18",
			week: "week_r18",
			day_male: "day_male_r18",
			day_female: "day_female_r18",
			day_ai: "day_r18_ai",
			day_manga: "day_r18_manga",
			week_manga: "week_r18_manga",
			week_r18: "week_r18",
			week_r18g: "week_r18g",
		};

		if (nsfwModeMap[mode]) {
			params.set("mode", nsfwModeMap[mode]);
		}
	}
	let data: responseRank;
	try {
		data = await requestJson<responseRank>(
			`https://pymapi.hayasaka.moe/v1/pixiv/illust/ranking?` +
				params.toString(),
			{
				headers: {
					"Cache-Control": "no-store",
				},
			},
		);
	} catch (error) {
		console.error("Failed to fetch illust ranking:", error);
		return [null, false];
	}

	if (!Array.isArray(data) || data.length === 0) {
		console.error("No illustrations found for these parameters.");
		return [null, false];
	}

	let availableIllusts = data;
	if (nsfw === "only") {
		availableIllusts = data.filter(
			(illust) => illust.sanity_level >= 5,
		);
	} else if (nsfw !== "true") {
		availableIllusts = data.filter(
			(illust) => illust.sanity_level < 5,
		);
	}

	if (availableIllusts.length === 0 && data.length > 0) {
		if (nsfw === "only") {
			console.warn(
				"No NSFW illustrations found on this page. Falling back to a random (SFW) image.",
			);
		} else if (nsfw !== "true") {
			console.warn(
				"No SFW illustrations found on this page. Falling back to a random (NSFW) image.",
			);
		}
		availableIllusts = data;
	}

	const illust = randomChoice(availableIllusts);

	const image = illust.meta_pages.length
		? randomChoice(illust.meta_pages).image_urls.original
		: illust.meta_single_page.original_image_url;

	const isNsfw = illust.sanity_level >= 5;

	return [image, isNsfw];
}

export function formatDate(date: Date): string {
	const d = new Date(date);
	let month = "" + (d.getMonth() + 1);
	let day = "" + d.getDate();
	const year = d.getFullYear();

	if (month.length < 2) month = "0" + month;
	if (day.length < 2) day = "0" + day;

	return [year, month, day].join("-");
}
