const Canvas = require("canvas");
const moment = require("moment");
const date = moment().utcOffset('+0200').format('dddd, MMMM Do YYYY');
const fs = require("fs");
Canvas.registerFont('.fonts/BurbankBigCondensed-Black.otf', { family: 'Burbank Big Condensed' });

module.exports = {
    async GenerateShop(data) {
        return new Promise(async (resolve) => {
			const background = await Canvas.loadImage('./assets/background.png');
			let canvasHeight;
			await data.specialFeatured.forEach(el => {
				data.featured.push(el);
			});

			const nbDaily = data.daily.length;
			const nbFeatured = data.featured.length;
			console.log(nbFeatured + 'Featured');
			if (nbDaily > nbFeatured) canvasHeight = nbDaily;
			else canvasHeight = nbFeatured;
			canvasHeight = Math.ceil(canvasHeight / 3) * 310 + 400;
			const canvas = Canvas.createCanvas(1280, canvasHeight);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
			//ctx.clearRect(0, 0, canvas.width, canvas.height);
			// DATE
			ctx.font = '100px Burbank Big Cd Bk';
			ctx.fillStyle = '#ffffff';
			const measure = ctx.measureText(date).width;
			const left = (640 - (measure / 2));
			ctx.fillText(date, left, 150);
			ctx.font = '80px Burbank Big Cd Bk';
			ctx.fillText('Featured', 195, 300);
			ctx.fillText('Daily', 880, 300);
			// Shop Data
			let decalLeft = 20;
			let firstDecal = 20;
			let decalHeight = 350;
			let nbImage = 1;
			let e = 0;
			let shopType = 'featured';
			while(e !== data[shopType].length) {
				try {
					box = await Canvas.loadImage(`./assets/box/box_${data[shopType][e].rarity}.png`);
				}
				catch {
					box = await Canvas.loadImage('./assets/box/box_common.png');
				}
				var cosmetic;
				if(data[shopType][e].image !== null) cosmetic = await Canvas.loadImage(data[shopType][e].image);
				else cosmetic = await Canvas.loadImage(data[shopType][e].icon);
				ctx.drawImage(box, decalLeft, decalHeight, 200, 300);
				ctx.drawImage(cosmetic, decalLeft - 15, decalHeight + 30, 230, 230);
				ctx.fillStyle = 'black';
				ctx.globalAlpha = 0.40;
				ctx.fillRect(decalLeft, decalHeight + 200, 200, 100);
				ctx.fillStyle = 'black';
				ctx.globalAlpha = 0.40;
				ctx.globalAlpha = 1;
				ctx.fillStyle = '#000724';
				ctx.fillRect(decalLeft, decalHeight + 260, 200, 40);

				if(data[shopType][e].items.length > 1) {
					let i = 1;
					let boxHeight = 0;
					while(i < data[shopType][e].otherItemsDetails.length) {
						const cos = await Canvas.loadImage(data[shopType][e].otherItemsDetails[i].images.icon);
						ctx.drawImage(cos, decalLeft + 150, decalHeight + boxHeight, 50, 50);
						boxHeight = boxHeight + 50;
						i++;
					}
				}
				// Name
				ctx.fillStyle = '#ffffff';
				let fontSize = 30;
				ctx.font = fontSize + '30px Burbank Big Cd Bk';
				let cosName;
				if(data[shopType][e].type === 'bundle') cosName = data[shopType][e].name;
				else cosName = data[shopType][e].name;
				let measure = ctx.measureText(cosName).width;
				while (measure > 190) {
					fontSize = fontSize - 1;
					ctx.font = fontSize + 'px Burbank Big Cd Bk';
					measure = ctx.measureText(cosName).width;
				}
				let left = decalLeft + (100 - (measure / 2));
				ctx.fillText(cosName, left, decalHeight + 230);
				// Type
				ctx.font = '20px Burbank Big Cd Bk';
				ctx.fillStyle = '#ffffff';
				const nb = data[shopType][e].items.length;
				if(data[shopType][e].type === 'bundle') finalName = `Pack contains ${nb} items`;
				else finalName = data[shopType][e].type.toUpperCase();
				measure = ctx.measureText(finalName).width;
				left = decalLeft + (100 - (measure / 2));
				ctx.fillText(finalName, left, decalHeight + 250);
				// Price
				const vbucks = await Canvas.loadImage('./assets/vbucks.png');
				ctx.font = '25px Burbank Big Cd Bk';
				ctx.fillStyle = '#ffffff';
				measure = ctx.measureText(data[shopType][e].price).width;
				left = decalLeft + (100 - (measure / 2) - 17);
				ctx.drawImage(vbucks, left + measure + 13, decalHeight + 267, 25, 25);
				ctx.fillText(data[shopType][e].price, left + 10, decalHeight + 288);
				if(data[shopType][e].banner !== '') {
					const texture = await Canvas.loadImage('./assets/new.png');
					ctx.font = '15px Burbank Big Cd Bk';
					ctx.fillStyle = '#ffffff';
					measure = ctx.measureText(data[shopType][e].banner.toUpperCase()).width;
					ctx.drawImage(texture, decalLeft - 4, decalHeight - 5, measure + 50, 40);
					ctx.fillText(data[shopType][e].banner.toUpperCase(), decalLeft + 16, decalHeight + 20);
				}
				decalLeft = decalLeft + 205;
				nbImage++;
				if(nbImage == 4) {
					nbImage = 1;
					decalLeft = firstDecal;
					decalHeight = decalHeight + 310;
				}
				e++;
				if(e === data[shopType].length && shopType == 'featured') {
					nbImage = 1;
					shopType = 'daily';
					firstDecal = 645;
					decalLeft = firstDecal;
					decalHeight = 350;
					e = 0;
				}
            }

			// Draw footer
			ctx.fillStyle = '#ffffff';
			ctx.font = '83px Burbank Big Cd Bk';
			ctx.textAlign = 'center';
			ctx.fillText('Shop by: RiftSTWLeaks', 955, canvas.height - 66);

			const end = fs.createWriteStream('./final/shop.png');
			const stream = canvas.createPNGStream().pipe(end);
			stream.on('finish', () => {
				resolve('./final/shop.png');
			});
		});
	},
};
