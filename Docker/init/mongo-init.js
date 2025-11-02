// MongoDB initialization script
print("=== MongoDB Initialization Script ===");
print("Timestamp: " + new Date().toISOString());
print("Root username: " + process.env.MONGO_INITDB_ROOT_USERNAME);
print("MongoDB version: " + version());

// Switch to admin database
db = db.getSiblingDB("admin");

try {
  // Check if user already exists
  let userExists = false;
  try {
    const existingUser = db.getUser(process.env.MONGO_INITDB_ROOT_USERNAME);
    userExists = !!existingUser;
    print("User existence check result: " + userExists);
  } catch (e) {
    print("User does not exist (expected for first run): " + e.message);
    userExists = false;
  }

  if (!userExists) {
    // Create the root user
    const result = db.createUser({
      user: process.env.MONGO_INITDB_ROOT_USERNAME,
      pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
      roles: [
        { role: "root", db: "admin" },
        { role: "readWriteAnyDatabase", db: "admin" },
        { role: "dbAdminAnyDatabase", db: "admin" },
        { role: "userAdminAnyDatabase", db: "admin" },
        { role: "clusterAdmin", db: "admin" },
      ],
    });
    print(
      '✓ Root user "' +
        process.env.MONGO_INITDB_ROOT_USERNAME +
        '" created successfully'
    );
    print("User creation result: " + JSON.stringify(result));
  } else {
    print(
      '✓ Root user "' +
        process.env.MONGO_INITDB_ROOT_USERNAME +
        '" already exists'
    );
  }

  // Test authentication with the created user
  print("Testing authentication...");
  const authResult = db.auth(
    process.env.MONGO_INITDB_ROOT_USERNAME,
    process.env.MONGO_INITDB_ROOT_PASSWORD
  );
  print("Authentication test result: " + authResult);
} catch (e) {
  if (e.code === 51003) {
    print(
      '✓ User "' +
        process.env.MONGO_INITDB_ROOT_USERNAME +
        '" already exists (duplicate key error - this is normal)'
    );
  } else {
    print("✗ Error during user creation: " + e.message);
    print("Error code: " + e.code);
    print("Full error: " + JSON.stringify(e));
    throw e;
  }
}

// Create additional databases that might be needed by the application
print("Creating application databases...");
const databases = [
  "djpanel_documents",
  "djpanel_logging",
  "djpanel_cache",
  "djpanel_sessions",
  "djpanel_audit",
];

databases.forEach(function (dbName) {
  try {
    print("Creating database: " + dbName);
    const targetDb = db.getSiblingDB(dbName);

    // Create a collection to ensure database is created
    targetDb.createCollection("_metadata");
    targetDb._metadata.insertOne({
      created: new Date(),
      purpose: "Database initialization marker",
      version: "1.0.0",
      database: dbName,
    });

    print('✓ Database "' + dbName + '" initialized successfully');
  } catch (e) {
    print(
      '⚠ Warning: Could not initialize database "' + dbName + '": ' + e.message
    );
  }
});

// Verify the setup
print("=== Verification ===");
try {
  const users = db.getUsers();
  print("Total users in admin database: " + users.length);

  const databases = db.adminCommand("listDatabases");
  print(
    "Available databases: " + databases.databases.map((d) => d.name).join(", ")
  );

  print("✓ MongoDB initialization completed successfully");
} catch (e) {
  print("⚠ Warning during verification: " + e.message);
}

print("=== End of MongoDB Initialization ===");
