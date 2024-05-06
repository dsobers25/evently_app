import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if(!MONGODB_URI) throw new Error('MONGODB_URI is missing');

  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
    dbName: 'evently',
    bufferCommands: false,
  })

  cached.conn = await cached.promise;

  return cached.conn;
}

// why would we use this pattern

// in serverless functions/environment
// your code could be executed multiple times but not in a 
// single continuous server process

// you need to manage DB connections efficiently

// b/c each invocation of a serverless function
// could result in a new connection to the DB
// which is inefficient and can exhaust DB resources

// we use Server actions, & each server action has to call
// connectToDatabase() again & again

// since we cache it will either reuse existing or create new