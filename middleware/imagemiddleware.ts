import express, { Request, Express } from "express";
import { GridFsStorage } from "multer-gridfs-storage";
import multer, { Multer } from "multer";
import util from "util";

import dbConfig from "../conf/db";

const storageOptions = {
  url: dbConfig.url + dbConfig.database,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req: Request, file: Express.Multer.File): string | { bucketName: string; filename: string } => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-bezkoder-${file.originalname}`;
      console.log("Generated filename:", filename);
      return filename;
    }

    const fileInfo = {
      bucketName: dbConfig.imgBucket,
      filename: `${Date.now()}-bezkoder-${file.originalname}`,
    };
    console.log("Generated fileInfo:", fileInfo);
    return fileInfo;
  },
};

const storage = new GridFsStorage(storageOptions);

const uploadFiles: express.RequestHandler = multer({ storage }).single("file");

const uploadFilesMiddleware = util.promisify(uploadFiles);

console.log("Starting uploadFilesMiddleware...");

export default uploadFilesMiddleware;
