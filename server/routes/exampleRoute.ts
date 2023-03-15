import * as express from 'express';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';


const router = express.Router();


router.get('/arrivals', getArrivals);
router.get('/departures', getDepartures);
router.get('/logos', getLogos);


function getArrivals(req: express.Request, res: express.Response) {
  axios.get('https://www.skg-airport.gr/en/_jcr_content.arrivals.json').then((data)=>{
    res.send(JSON.stringify(data.data.data))
  })
  
}

function getDepartures(req: express.Request, res: express.Response) {
  axios.get('https://www.skg-airport.gr/en/_jcr_content.departures.json').then((data)=> {
    res.send(JSON.stringify(data.data.data))
  });
}

function getLogos(req: express.Request, res: express.Response) {
  let rersourcesPath = path.join(
    __dirname,
    '..',
    '..',
    'client',
    'assets',
    'icons',
    'airlines'
  );
  fs.readdir(rersourcesPath, (err, files) => {
    res.send(JSON.stringify(files));
  });
}

export = router;


