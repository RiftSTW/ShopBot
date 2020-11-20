//Fortnite Shop Bot developed by: RiftSTW

const axios = require("axios");
const Twitter = require("twitter");
const Canvas = require("canvas")
const fs = require("fs")
const config = require("./config.json")
const { GenerateShop } = require('./functions/shop.js')

console.log("Fortnite Shop Bot developed by: RiftSTW")
console.log(`SAC Code used: ${config.sac}`)
console.log("Grabbing Item Shop Image...")

fs.stat('./final/shop.png', async function(err, stats) {
    if(!err) {
    console.log("No error lol")
    }
    else {
        const response = await axios({method: 'get',url: 'https://fortnite-api.com/v2/shop/br/combined?language=en'})
        await GenerateShop(response.data.data).then(async (value) => {
            
        })
    }

    const client = new Twitter({
    consumer_key: 'PUT KEY HERE',
    consumer_secret: 'PUT KEY HERE',
    access_token_key: 'PUT KEY HERE',
    access_token_secret: 'PUT KEY HERE'
  });

  const data = require('fs').readFileSync("./final/shop.png");

  // Make post request on media endpoint. Pass file data as media parameter
  client.post('media/upload', {media: data}, function(error, media, response) {
  
    if (!error) {
  
      // If successful, a media object will be returned.
      console.log(media);
  
      // Lets tweet it
      var date = new Date();
      var status = {
        status: `#Fortnite Item Shop for, ${date} #FortniteBR #FortniteItemShop Use Support-A-Creator Code: ${config.sac} #ad`,
        media_ids: media.media_id_string
      }
  
      client.post('statuses/update', status, function(error, tweet, response) {
        if (!error) {
          console.log(tweet);
          console.log("Item shop has been tweeted!")
        }
      });
  
    }
  }); 
  })
