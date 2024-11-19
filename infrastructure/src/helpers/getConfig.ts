import * as dotenv from "dotenv";
import { IAppConfig } from "./IAppTypes";

export const getConfig = (): IAppConfig => {
  dotenv.config({ path: "../.env" });
  const { AWS_ACCOUNT_ID, AWS_REGION } = process.env;

  if (!AWS_ACCOUNT_ID) {
    throw new Error("AWS_ACCOUNT_ID is empty");
  }
  
  if (!AWS_REGION) {
    throw new Error("AWS_REGION is empty");
  }

  return{
    awsAccountId: AWS_ACCOUNT_ID,
    awsRegion: AWS_REGION
  }
};
