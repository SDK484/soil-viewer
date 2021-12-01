const Airtable = require('airtable');
const base = new Airtable({apiKey: 'keyRxbrIIcPFpfAHZ'}).base('appnVHmHqljR3JkKC');
const fs  = require("fs");

setInterval(function() {
	/* call ardunio to get data written to text file */
	
	 // TODO
	
	/* read from text file */
	
	/*fs.writeFile('./log.txt', '16', 'utf8', function (err) {
	  if (err) return console.log(err);
	  console.log('data > log.txt');
	});*/
	
	const date = new Date;
	const day = date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear().toString().substr(-2);
	const hours = date.getUTCHours();
	const mins = date.getUTCMinutes();
	const timestamp = `S01_${day}-${month}-${year}_${hours}-${mins}`;
	const temp = fs.readFileSync('data.txt').toString();
	// console.log(timestamp, temp);
	
	/* update database */
	base('SoilData').create([
		{
			"fields": {
			  "Name": timestamp,
			  "Temp": parseFloat(temp)
			}
		}
	], function(err, records) {
		if (err) {
			console.error(err);
			return;
		}
		records.forEach(function (record) {
			// console.log(record.getId());
			console.log(timestamp, ': ', temp);
		});
	});
}, 1000 * 60 * 3); // 1 ms * num secs * mins wanted