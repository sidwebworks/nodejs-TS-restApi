import {
    DocumentDefinition,
    FilterQuery,
    QueryOptions,
    UpdateQuery,
  } from "mongoose";
  import ProductModel, { ProductDocument } from "../models/product.model";
import { databaseRespsnseTimeHistogram } from "../utils/metrics";
  
  export async function createProduct(
    input: DocumentDefinition<Omit<ProductDocument, "createdAt" | "updatedAt" | 'productId'>>
  ) {
    const metricsLabels = {
      operation: 'createProduct',
    }
    const timer = databaseRespsnseTimeHistogram.startTimer();

    try{
      const result = await ProductModel.create(input);
      //@ts-ignore
      timer({...metricsLabels, success: true});
      return result;
    }
    catch(e){
      //@ts-ignore
      timer({...metricsLabels, success: false});
      throw e;
    }

    
  }
  
  export async function findProduct(
    query: FilterQuery<ProductDocument>,
    options: QueryOptions = { lean: true }
  ) {
    try{
      const result = await ProductModel.findOne(query, {}, options);
      return result;
    }
    catch(e){
      throw e;
    }
    
  }
  
  export async function findAndUpdateProduct(
    query: FilterQuery<ProductDocument>,
    update: UpdateQuery<ProductDocument>,
    options: QueryOptions
  ) {
    return ProductModel.findOneAndUpdate(query, update, options);
  }
  
  export async function deleteProduct(query: FilterQuery<ProductDocument>) {
    return ProductModel.deleteOne(query);
  }