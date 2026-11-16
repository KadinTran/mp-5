import {Db, MongoClient} from 'mongodb';

const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) {throw new Error("MongoDB URI doesn't exist");}

const DB_NAME = "mp-5"
export const URL_SHORTENER = "url-shortener";

let client: MongoClient | null = null;
let db: Db | null = null;

async function connect(): Promise<Db> {
    if(!client) {
        client = new MongoClient(MONGO_URI);
        await client.connect();
    }
    return client.db(DB_NAME);
}
export default async function getURL(alias: string) {
    if (!db){db = await connect();}
    const collection = db.collection(URL_SHORTENER);
    return collection.findOne({alias : alias})
}