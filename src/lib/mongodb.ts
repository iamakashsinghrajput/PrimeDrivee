import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    );
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache;

if (process.env.NODE_ENV === 'production') {
    if (!global.mongooseCache) {
        global.mongooseCache = { conn: null, promise: null };
    }
    cached = global.mongooseCache;
} else {
    if (!global.mongooseCache) {
        global.mongooseCache = { conn: null, promise: null };
    }
     cached = global.mongooseCache;
}


async function connectMongoDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        console.log("DB: Creating new connection promise");
        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            console.log("DB: Connection successful!");
            return mongoose;
        }).catch(err => {
            console.error("DB: Connection error:", err);
            cached.promise = null;
            throw err;
        });
    }

    try {
        // console.log("DB: Awaiting connection promise");
        cached.conn = await cached.promise;
    } catch (error) {
         cached.promise = null;
         cached.conn = null;
         console.error("DB: Failed to await connection promise", error);
         throw error;
    }
    return cached.conn;
}

export { connectMongoDB };