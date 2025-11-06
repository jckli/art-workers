# art-workers

Repository to store various Cloudflare workers for different anime art sources.

## Links

### References & Links

#### Art Sites

- [Pixiv](https://www.pixiv.net/) - https://pximg.jackli.dev/

#### Subreddits

Can be accessed by appending the subreddit name to the base URL without the r/, e.g. `https://reddit.jackli.dev/<subreddit>`.

Compatible subreddits:

- [r/streetmoe](https://www.reddit.com/r/streetmoe/)
- [r/animehoodies](https://www.reddit.com/r/animehoodies/)
- [r/animewallpaper](https://www.reddit.com/r/animewallpaper/)
- [r/moescape](https://www.reddit.com/r/moescape/)
- [r/wholesomeyuri](https://www.reddit.com/r/wholesomeyuri/)
- [r/awwnime](https://www.reddit.com/r/awwnime/)
- [r/anime_irl](https://www.reddit.com/r/anime_irl/)
- [r/saltsanime](https://www.reddit.com/r/saltsanime/)
- [r/megane](https://www.reddit.com/r/megane/)
- [r/imaginarymaids](https://www.reddit.com/r/imaginarymaids/)
- [r/cutelittlefangs](https://www.reddit.com/r/cutelittlefangs/)

### Default timeframes

#### Art Sites

- [Pixiv](https://pximg.jackli.dev/): _Completely Random_

#### Subreddits

- [r/streetmoe](https://reddit.jackli.dev/streetmoe): Month
- [r/animehoodies](https://reddit.jackli.dev/animehoodies): Year
- [r/animewallpaper](https://reddit.jackli.dev/animewallpaper): Week
- [r/moescape](https://reddit.jackli.dev/moescape): Month
- [r/wholesomeyuri](https://reddit.jackli.dev/wholesomeyuri): Week
- [r/awwnime](https://reddit.jackli.dev/awwnime): Week
- [r/anime_irl](https://reddit.jackli.dev/anime_irl): Week
- [r/saltsanime](https://reddit.jackli.dev/saltsanime): Year
- [r/megane](https://reddit.jackli.dev/megane): Year
- [r/imaginarymaids](https://reddit.jackli.dev/imaginarymaids): Month
- [r/cutelittlefangs](https://reddit.jackli.dev/cutelittlefangs): Month

## Parameters

### Art Sites

#### Pixiv

`mode` - Rank by, one of (day, week, month, day_male, day_female, week_original, week_rookie, day_r18, day_male_r18, day_female_r18, week_r18, week_r18g)

`date` - Date to fetch images from, formatted like "yyyy-mm-dd"

`nsfw` - Include NSFW images (default: true)

### Subreddits

`t` - Timeframe to fetch images from, one of (hour, day, week, month, year, all)

`sort` - Sort by, one of (hot, top, new, rising, controversial) (default: top)

`nsfw` - Include NSFW images (default: true)

## Usages

### Art Sites

#### Pixiv

- Base URL: `https://pximg.jackli.dev/`, Shows you a random image from Pixiv.

- Pixiv Proxy URL: `https://pximg.jackli.dev/<i.pximg.net link>`, Shows you the given image proxied, as Pixiv.net doesn't allow direct viewing of images from their server.
     - Example: `https://pximg.jackli.dev/img-master/img/2024/07/05/20/07/20/120262337_p0_master1200.jpg`
     - Parameters do NOT work with this URL.

- API URL: `https://pximg.jackli.dev/api`, Shows you a random image from Pixiv within a JSON.

#### Subreddits

- Base URL: `https://reddit.jackli.dev/`, Shows you a random image from a random subreddit.

- Subreddit URL: `https://reddit.jackli.dev/<subreddit>`, Shows you a random image from the given subreddit.
     - Example: `https://reddit.jackli.dev/streetmoe`
     - You can append `/api` to the end of the URL to get the subreddit in a JSON formatted response.

- API URL: `https://reddit.jackli.dev/api`, Shows you a random image from a random subreddit within a JSON.

---

art-workers was created by jckli<br>
https://github.com/jckli
