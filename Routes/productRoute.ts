import  {createProduct, getAllProduct } from "../Controllers/productController";
import uploadController from "../Controllers/imageController"
import express from "express"


const router=express.Router()

router.post("/upload",uploadController.uploadFiles );
router.get("/files", uploadController.getListFiles);
router.post("/create",createProduct)
router.get("/allProducts",getAllProduct)


export default router