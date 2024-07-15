type mediaMetadata = {
	id: string;
	m: string;
};

type redditPost = {
	data: {
		media_metadata: Record<string, mediaMetadata>;
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
		return undefined; // Return undefined if th
	}
	const randomIndex = Math.floor(Math.random() * keys.length);
	const randomKey = keys[randomIndex];
	if (randomKey === undefined) {
		return undefined;
	}
	return obj[randomKey]!;
}

async function requestJson(input: RequestInfo): Promise<any> {
	const response = await fetch(input, {
		headers: {
			"User-Agent": "hayasaka.moe",
		},
	});
	return response.json();
}

function getGalleryImage(post: any): string {
	const image: mediaMetadata = randomObjChoice(post.data.media_metadata)!;
	const id = image.id;
	const m = image.m;
	const filetype = m.substring(6);

	const imageLink = `https://i.redd.it/${id}.${filetype}`;

	return imageLink;
}

export async function getImage(
	params: URLSearchParams,
	subreddit: string,
): Promise<[string, boolean]> {
	const sort = params.get("sort") || "top";
	params.delete("sort");
	const nsfw = params.get("nsfw") || "true";
	params.delete("nsfw");

	while (true) {
		const data = await requestJson(
			`https://www.reddit.com/r/${subreddit}/${sort}/.json?limit=100&${params.toString()}`,
		);
		const post: redditPost = randomChoice(data.data.children);

		let imageLink = post.data.url;
		const over_18 = post.data.over_18;

		if (nsfw == "false" && over_18.toString() == "true") {
			continue;
		}

		if (imageLink.includes("/gallery/")) {
			imageLink = getGalleryImage(post);
		}

		if (
			[".png", ".jpg", ".gif", ".jpeg"].some((ext) =>
				imageLink.endsWith(ext),
			)
		) {
			return [imageLink, over_18];
		}
	}
}
