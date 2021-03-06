import rp from "request-promise";
import { Environment } from "../../env";

const options = {
 simple: false,
 json: true,
 resolveWithFullResponse: true,
 headers: {
  "Content-Type": "application/json",
  "X-API-Key": Environment.CRYPTO_API_KEY
 }
};

const COIN_NETWORK = {
 development: "testnet",
 production: "mainnet",
 test: "testnet"
};

const btcPath = "/v1/bc/btc/" + COIN_NETWORK[process.env.NODE_ENV];
const BTCROOT = Environment.CRYPTO_API + btcPath;

export class BTC {
 static async createAddress(): Promise<{ payload: any; statusCode: number }> {
  const response = await rp.post(BTCROOT + "/address", { ...options });
  return Promise.resolve({
   statusCode: response.statusCode,
   payload: response.body.payload
  });
 }

 static async getAddressDetails(address: string): Promise<{ payload: any; statusCode: number; }> {
  const response = await rp.get(BTCROOT + "/address/" + address, { ...options });
  return Promise.resolve({
   statusCode: response.statusCode,
   payload: response.body.payload
  });
 }

 static async sendToken(
  inputs: { address: string; value: number; }[], 
  outputs: { address: string; value: number; }[],
  fee: { address: string; value: number; },
  data?: string
 ): Promise<{ payload: any; statusCode: number; }> {
  const response = await rp.post(BTCROOT + "/txs/create", {
   ...options,
   body: {
    inputs, outputs, fee, data
   }
  });
  return Promise.resolve({
   statusCode: response.statusCode,
   payload: response.body.payload
  });
 }

 static async signTransaction(
  hex: string, 
  wifs: Array<string>
 ): Promise<{ payload: any; statusCode: number }> {
  const response = await rp.post(BTCROOT + "/txs/sign", {
   ...options,
   body: { hex, wifs }
  });
  return Promise.resolve({
   statusCode: response.statusCode,
   payload: response.body.payload
  });
 }

 static async broadcastTransaction(hex: string): Promise<{ payload: any; statusCode: number }> {
  const response = await rp.post(BTCROOT + "/txs/send", {
   ...options,
   body: { hex }
  });
  return Promise.resolve({
   statusCode: response.statusCode,
   payload: response.body.payload
  });
 }
}
