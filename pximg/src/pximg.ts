export async function pximgProxy(pathname: string): Promise<Response> {
	return fetch("https://i.pximg.net/" + pathname, {
		headers: {
			Referer: "https://www.pixiv.net",
		},
	});
}
