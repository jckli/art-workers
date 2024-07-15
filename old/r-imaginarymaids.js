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

function randomObjChoice(obj) {
  var keys = Object.keys(obj);
  return obj[keys[ keys.length * Math.random() << 0]];
}
  
async function requestJson(input) {
  const response = await fetch(input);
  return response.json();
}

function getGalleryImage(post) {
  const image = randomObjChoice(post.data.media_metadata);
  const id = image.id;
  const m = image.m;
  const filetype = m.substring(6);

  const imageLink = `https://i.redd.it/${id}.${filetype}`;

  return imageLink;
}
  
async function getImage(params) {
  const sort = params.get("sort")
  params.delete("sort")
  const nsfw = params.get("nsfw")
  params.delete("nsfw")
  
  var i = true;
  while (i) {
    const data = await requestJson(
      `https://www.reddit.com/r/ImaginaryMaids/${sort}/.json?limit=100&` + params.toString()
    )
    const post = randomChoice(data.data.children);

    var imageLink = post.data.url;
    var over_18 = post.data.over_18;

    if (nsfw == "false" && over_18.toString() != nsfw) {
      continue
    }

    if (imageLink.includes("/gallery/")) {
        imageLink = getGalleryImage(post);
    }
    
    if ([".png", ".jpg", ".gif"].some(char => imageLink.endsWith(char))) {
        return [imageLink, over_18];
    }
  }
}
  
async function handleRequest(request) {
  const url = new URL(request.url);
  if(!url.searchParams.has("t")) {
    url.searchParams.set("t", "month")
  }
  if (!url.searchParams.has("sort")) {
    url.searchParams.set("sort", "top")
  }
  if (!url.searchParams.has("nsfw")) {
    url.searchParams.set("nsfw", "true")
  }
  const image = await getImage(url.searchParams);
  switch (url.pathname) {
    case "/api":
      const json = JSON.stringify({
        imglink: image[0],
        over_18: image[1],
        status: 200
      });
      return new Response(json, {
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      });

    default:
      return fetch(image[0]);
  }
}