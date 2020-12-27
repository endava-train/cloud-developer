import {filterImageFromURL} from '../util/util';
import {Request, Response} from 'express';

export default async function (req: Request, res: Response) {
  const imageUrl: string = req.query.image_url;
  if (imageUrl) {
    try {
      const image: Buffer = await filterImageFromURL(imageUrl);
      res.set('Content-Type', 'image/jpeg');
      return res.send(image);
    } catch (e) {
      return res.status(422).send('invalid param image_url');
    }
  }

  return res.status(400).send("error with the param image_url");
}
