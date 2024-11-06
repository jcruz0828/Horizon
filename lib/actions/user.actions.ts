"use server"

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from "@/lib/plaid";
import { revalidatePath } from "next/cache";
import { createDwollaCustomer } from "./dwolla.actions";
const {
  APPWRITE_DATABASE_ID:DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID:BANK_COLLECTION_ID,
}= process.env

export const signIn = async ({email,password}:signInProps) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email,password);

    
    return parseStringify(session)
    
  } catch (error) {
    console.log("Error", error);
  }
};

export const signUp = async ({password,...userData}: SignUpParams) => {
  const {email,firstName,lastName} = userData;
  let newUserAccount;
  try {
    const { account,database } = await createAdminClient();
    
    newUserAccount = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
    
    if(!newUserAccount) throw new Error('Error creating reponse');
    
    const dwollaCustomerUrl = await createDwollaCustomer({...userData,type:'personal'})

    if(!dwollaCustomerUrl) throw new Error('Error Creating dwolla customer');

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    const newUser = await database.createDocument(DATABASE_ID!,APPWRITE_USER_COLLECTION_ID!,ID.unique(),{
      ...userData,
      userId: newUserAccount.$id,
      dwollaCustomerId,
      dwollaCustomerUrl
    })

    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    return parseStringify(newUser);

  } catch (error) {
    console.log("Error", error);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();      
    const user =  await account.get();
    return parseStringify(user);
  } catch (error) {
    return null;
  }
}

export const logoutAccount = async () =>{
  try {
    const {account} = await createSessionClient();
    (await cookies()).delete('appwrite-session');
    await account.deleteSession('current')
    return true;
  } catch (error) {
    console.error(error)
    return false
  }
}

export const createBankAccount = async (
  {userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId}: createBankAccountProps) =>{
    const {database} = await createAdminClient();
    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      }
    )
    return parseStringify(bankAccount)
  }
  


export const createLinkToken = async (user:User) =>{
  try {
    const tokenParams = {
      user:{
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products:['auth'] as Products[],
      language:'en',
      country_codes:['US'] as CountryCode[]
    }

    const response = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify({linkToken : response.data.link_token});
  } catch (error) {
    console.log(error)
  }
}

export const exchangePublicToken = async ({publicToken,user}:exchangePublicTokenProps)=>{
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    
    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });
    
    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
  }

};