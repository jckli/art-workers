type mediaMetadata = {
	id: string;
	m: string;
};

type redditPost = {
	data: {
		media_metadata?: Record<string, mediaMetadata>;
		over_18: boolean;
		url: string;
	};
};
export function randomChoice<T>(list: T[]): T {
	return list[Math.floor(Math.random() * list.length)] as T;
}

function randomObjChoice<T>(obj: Record<string, T>): T | undefined {
	const keys = Object.keys(obj);
	if (keys.length === 0) {
		return undefined;
	}
	const randomIndex = Math.floor(Math.random() * keys.length);
	const randomKey = keys[randomIndex];
	if (randomKey === undefined) {
		return undefined;
	}
	return obj[randomKey];
}

async function requestJson(input: RequestInfo): Promise<any> {
	const response = await fetch(input, {
		headers: {
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
			Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
			"Accept-Language": "en-US,en;q=0.9",
			Referer: "https://www.reddit.com/",
		},
	});
	if (!response.ok) {
		throw new Error(
			`Reddit API request failed: ${response.status}`,
		);
	}
	return response.json();
}

function getGalleryImage(post: redditPost): string | undefined {
	if (!post.data.media_metadata) {
		return undefined;
	}

	const image = randomObjChoice(post.data.media_metadata);
	if (!image) {
		return undefined;
	}

	const { id, m } = image;
	const filetype = m.split("/")[1];

	if (!filetype) {
		return undefined;
	}

	return `https://i.redd.it/${id}.${filetype}`;
}

const VALID_EXTENSIONS = [".png", ".jpg", ".gif", ".jpeg"];

export async function getImage(
	params: URLSearchParams,
	subreddit: string,
): Promise<[string, boolean]> {
	const sort = params.get("sort") || "top";
	const nsfwParam = params.get("nsfw");

	params.delete("sort");
	params.delete("nsfw");

	let retries = 5;
	while (retries > 0) {
		retries--;
		const data = await requestJson(
			`https://www.reddit.com/r/${subreddit}/${sort}/.json?limit=100&${params.toString()}`,
		);

		if (!data?.data?.children?.length) {
			throw new Error(
				"No posts found or invalid API response.",
			);
		}

		const post: redditPost = randomChoice(data.data.children);

		let imageLink = post.data.url;
		const over_18 = post.data.over_18;

		if (nsfwParam === "false" && over_18 === true) {
			continue;
		}

		if (imageLink.includes("/gallery/")) {
			const galleryImage = getGalleryImage(post);
			if (!galleryImage) {
				continue;
			}
			imageLink = galleryImage;
		}

		if (VALID_EXTENSIONS.some((ext) => imageLink.endsWith(ext))) {
			return [imageLink, over_18];
		}
	}

	throw new Error("Could not find a suitable image after 5 attempts.");
}
