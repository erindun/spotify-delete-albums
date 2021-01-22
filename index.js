import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "YOUR CLIENT ID HERE",
  clientSecret: "YOUR CLIENT SECRET HERE",
});

const accessToken = "YOUR ACCESS TOKEN HERE";

spotifyApi.setAccessToken(accessToken);

(async function main() {
  // make initial API call to get total
  // number of albums
  let offset = 0;
  const response = await spotifyApi.getMySavedAlbums({
    limit: 50,
    offset: offset,
  });
  offset += 50;

  const items = response.body.items;
  const total = response.body.total;

  // get the rest of the albums
  while (offset <= total) {
    const response = await spotifyApi.getMySavedAlbums({
      limit: 50,
      offset: offset,
    });
    items.push(...response.body.items);
    offset += 50;
  }
  const albumIds = items.map((item) => item.album.id);

  // Spotify API can only remove 50 albums
  // at once, so split `albumIds` into chunks
  for (let i = 0; i < albumIds.length; i += 50) {
    const chunk = albumIds.slice(i, i + 50);
    console.log(`Removing ${chunk.length} albums...`);
    await spotifyApi.removeFromMySavedAlbums(chunk);
  }

  console.log("All done!");
})();
