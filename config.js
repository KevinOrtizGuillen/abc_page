exports.mongodb={};
exports.mongodb.url=process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL||"mongodb://127.0.0.1/turistico";
exports.mongoURLLabel = "";
//mongodb://user:password@sample.com:port/dbname