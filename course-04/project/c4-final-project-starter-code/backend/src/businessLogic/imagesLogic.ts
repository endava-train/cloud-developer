import imagesBucket, {ImagesBucket} from "../dataLayer/imagesBucket";
import {UploadURL} from "../models/UploadURL";
import {getLogger} from "../utils/logger";

const log = getLogger();

export interface ImagesLogic {
  uploadUrl(todoId: string): UploadURL;
}

class ImagesLogicImp implements ImagesLogic {
  constructor(private readonly imageBucket: ImagesBucket = imagesBucket) {}

  uploadUrl(todoId: string): UploadURL {
    log.info(`uploadUrl with input todoId: ${todoId}`);
    return {
      uploadUrl: this.imageBucket.getUploadUrl(todoId),
    }
  }
}

const imagesLogic: ImagesLogic = new ImagesLogicImp();
export default imagesLogic;