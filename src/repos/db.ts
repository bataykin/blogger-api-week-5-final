const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://serega:serega@cluster0.midpe.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



let db = client.db("bloggers-posts")



export async function runDB() {
    try {
        await client.connect()
        console.log("Connected successfully to mongo server")
    } catch {
        console.log("Can't connected to mongo server")
        await client.close()
    }
}

console.log("Waiting for connection to database server: " + db.databaseName + "...")
export const bloggersCollection = db.collection('bloggers')
export const postsCollection = db.collection('posts')
