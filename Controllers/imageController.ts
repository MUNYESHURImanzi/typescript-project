import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { GridFSBucket } from "mongodb";
import dbConfig from "../conf/db";
import uploadFilesMiddleware from "../middleware/imagemiddleware";
import file from "../modols/image";

const url = dbConfig.url;
const baseUrl = "mongodb+srv://munyeshurimanzi:Munyeshuri1@cluster0.yqd0pr4.mongodb.net/?retryWrites=true&w=majority";
const mongoClient = new MongoClient(url);

const uploadFiles = async (req: Request, res: Response) => {
  try {
    await uploadFilesMiddleware(req, res);
    console.log("req.file:", req.file);

    if (req.file === undefined) {
      console.log("No file selected");
      return res.send({
        message: "You must select a file.",
      });
    }

    return res.send({
      message: "File has been uploaded.",
    });
  } catch (error) {
    console.log("Error:", error);

    return res.send({
      message: `Error when trying to upload image: ${error}`,
    });
  }
};

const getListFiles = async (req: Request, res: Response) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const images = database.collection(dbConfig.imgBucket + ".files");

    const cursor = images.find({});

    if ((await cursor.count()) === 0) {
      return res.status(500).send({
        message: "No files found!",
      });
    }

    const fileInfos: { name: string; url: string }[] = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });

    console.log("Success");

    // Create file documents using the file model
    const files = await file.create(fileInfos);

    return res.status(200).send(files);
  } catch (error) {
    console.log("Error:", error);

    return res.status(500).send({
      message: "hellow",
    });
  }
};

const download = async (req: Request, res: Response) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const bucket = new GridFSBucket(database, {
      bucketName: dbConfig.imgBucket,
    });

    const downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      console.log("Error downloading image:", err);
      return res.status(404).send({ message: "Cannot download the Image!" });
    });

    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (error) {
    console.log("Error:", error);

    return res.status(500).send({
      message: "hellow",
    });
  }
};

export default {
  uploadFiles,
  getListFiles,
  download,
};
