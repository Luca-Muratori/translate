import { ITranslatePrimaryKey, ITranslateRequest,  ITranslateResult, ITranslateResultList } from "@sff/shared-types";
import { fetchAuthSession } from "aws-amplify/auth";

const URL = "https://ara5o5slgh.execute-api.us-east-1.amazonaws.com/prod";
//in case we deployed a domain name
// const URL= "https://api.domainName.com"

export const translatePublicText = async (request: ITranslateRequest) => {
  try {


    const result = await fetch(`${URL}/public`, {
      method: "POST",
      body: JSON.stringify(request),
    });

    const rtnValue = (await result.json()) as ITranslateResult;
    return rtnValue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(e);
    throw e;
  }
};

export const translateUserText = async (request: ITranslateRequest) => {
  try {

    const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const result = await fetch(`${URL}/user`, {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const rtnValue = (await result.json()) as ITranslateResult;
    return rtnValue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(e);
    throw e;
  }
};

export const getUserTranslations = async () => {
  try {
    const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const result = await fetch(`${URL}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const rtnValue = (await result.json()) as ITranslateResultList;
    return rtnValue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(e);
    throw e;
  }
};

export const deleteUserTranslation = async (item: ITranslatePrimaryKey) => {
  try {
    const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const result = await fetch(`${URL}/user`, {
      method: "DELETE",
      body: JSON.stringify(item),
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const rtnValue = (await result.json()) as ITranslatePrimaryKey;
    return rtnValue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(e);
    throw e;
  }
};