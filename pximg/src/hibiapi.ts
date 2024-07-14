type responseIllust = {
	illust: {
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
};

type responseRank = {
	illusts: {
		meta_pages: {
			image_urls: {
				original: string;
			};
		}[];
		meta_single_page: {
			original_image_url: string;
		};
		sanity_level: number;
	}[];
};

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
	return response.json();
}

export async function getImage(id: number): Promise<Response> {
	const data: responseIllust = await requestJson(
		`https://hibiapi.hayasaka.moe/api/pixiv/illust?id=${id}`,
		{
			headers: { "Cache-Control": "no-store" },
		},
	);

	const illust = data.illust;

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
	params.delete("nsfw");

	while (true) {
		const data: responseRank = await requestJson(
			`https://hibiapi.hayasaka.moe/api/pixiv/rank?` +
				params.toString(),
			{
				headers: {
					"Cache-Control": "no-store",
				},
			},
		);

		const illust = randomChoice(data.illusts);

		const image = illust.meta_pages.length
			? randomChoice(illust.meta_pages).image_urls.original
			: illust.meta_single_page.original_image_url;

		const sl = illust.sanity_level >= 4;

		if (nsfw === "false" && sl.toString() !== nsfw) {
			continue;
		}

		return [image, sl];
	}
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
