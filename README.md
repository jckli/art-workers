# art-workers

Repository to store various Cloudflare workers for different anime art sources.

## Links

### References & Links

#### Art Sites

- [Pixiv](https://www.pixiv.net/) - https://pximg.jackli.dev/

#### Subreddits

- [r/streetmoe](https://www.reddit.com/r/streetmoe/) - https://streetmoe.jackli.dev/
- [r/animehoodies](https://www.reddit.com/r/animehoodies/) - https://animehoodies.jackli.dev/
- [r/animewallpaper](https://www.reddit.com/r/animewallpaper/) - https://aniwp.jackli.dev/
- [r/moescape](https://www.reddit.com/r/moescape/) - https://moescape.jackli.dev/
- [r/wholesomeyuri](https://www.reddit.com/r/wholesomeyuri/) - https://wsyuri.jackli.dev/
- [r/awwnime](https://www.reddit.com/r/awwnime/) - https://awwnime.jackli.dev/
- [r/anime_irl](https://www.reddit.com/r/anime_irl/) - https://animeirl.jackli.dev/
- [r/saltsanime](https://www.reddit.com/r/saltsanime/) - https://saltsanime.jackli.dev/
- [r/megane](https://www.reddit.com/r/megane/) - https://megane.jackli.dev/

### Default timeframes

#### Art Sites

- [Pixiv](https://pximg.jackli.dev/): *Completely Random*

#### Subreddits

- [streetmoe](https://streetmoe.jackli.dev/): Month
- [animehoodies](https://animehoodies.jackli.dev/): Year
- [animewallpaper](https://aniwp.jackli.dev/): Week
- [moescape](https://moescape.jackli.dev/): Month
- [wholesomeyuri](https://wsyuri.jackli.dev/): Week
- [awwnime](https://awwnime.jackli.dev/): Week
- [anime_irl](https://animeirl.jackli.dev/): Week
- [saltsanime](https://saltsanime.jackli.dev/): Year
- [megane](https://megane.jackli.dev/): Year

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

