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
  
async function requestJson(input) {
    const response = await fetch(input);
    return response.json();
}
  
async function getImage(params) {
    const data = await requestJson(
      `https://www.reddit.com/r/Animewallpaper/top/.json?limit=100&` + params.toString()
    )
    const post = randomChoice(data.data.children);
  
    const imageLink = post.data.url;
  
    return fetch(imageLink);
}
  
async function handleRequest(request) {
    const url = new URL(request.url);
    switch (url.pathname) {
      default:
        if(!url.searchParams.has("t")) {
          url.searchParams.set("t", "week")
        }
        return getImage(url.searchParams);
    }
}