addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) =>
        new Response(err.stack, {
          status: 500,
        })
    )
  );
});

/**
 * @param {Array} list
 */
function randomChoice(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * @param {RequestInfo} input
 * @param {RequestInit} init
 * @returns {any}
 */
async function requestJson(input, init) {
  const response = await fetch(input, init);
  return response.json();
}

/**
 * @param {Number} id
 * @returns {Promise<Response>}
 */
async function getImage(id) {
  const data = await requestJson(
    `https://api.zettai.moe/api/pixiv/illust?id=${id}`,
    {
      headers: { "Cache-Control": "no-store" },
    }
  );

  const illust = data.illust;

  const image = !!illust.meta_pages.length
    ? randomChoice(illust.meta_pages).image_urls.original
    : illust.meta_single_page.original_image_url;

  return fetch(image, {
    headers: {
      Referer: "https://www.pixiv.net",
    },
  });
}

/**
 * @param {URLSearchParams} params
 * @returns {Promise<Response>}
 **/
async function rankImage(params) {
  const nsfw = params.get("nsfw")
  params.delete("nsfw")
  
  var i = true;
  while (i) {
    const data = await requestJson(
      `https://api.zettai.moe/api/pixiv/rank?` + params.toString(),
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );

    const illust = randomChoice(data.illusts);

    const image = !!illust.meta_pages.length
      ? randomChoice(illust.meta_pages).image_urls.original
      : illust.meta_single_page.original_image_url;
    
    var sl = false
    if (illust.sanity_level >= 4) {
      sl = true;
    }

    if (nsfw == "false" && sl.toString() != nsfw) {
      continue
    }

    if ([".png", ".jpg", ".gif"].some(char => image.endsWith(char))) {
      return [image, sl];
    }
  }
}

/**
 * @param {Date} date
 * @returns {String}
 */
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

/**
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const reg = /\/(?<id>\d+)\/?/;
  if (!url.searchParams.has("mode")) {
    url.searchParams.set("mode", randomChoice(["day", "week", "month"]));
  }
  if (!url.searchParams.has("date")) {
    const date = new Date();
    date.setDate(date.getDate() - Math.ceil(Math.random() * 365 * 2));
    url.searchParams.set("date", formatDate(date));
  }
  if (!url.searchParams.has("nsfw")) {
    url.searchParams.set("nsfw", "true")
  }
  const link = await rankImage(url.searchParams);

  switch (url.pathname) {
    case "/":
      return fetch(link[0], {
        headers: {
          Referer: "https://www.pixiv.net",
        },
      });
    case "/api":
      const json = JSON.stringify({
        imglink: link[0],
        nsfw: link[1],
        status: 200
      });
      return new Response(json, {
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      });
    default:
      if (reg.exec(url.pathname)) {
        return fetch("https://i.pximg.net/" + url.pathname, {
          headers: {
            Referer: "https://www.pixiv.net/",
          },
        });
      }
      return new Response(`Not Found: ${request.url}`, { status: 404 });
  }
}