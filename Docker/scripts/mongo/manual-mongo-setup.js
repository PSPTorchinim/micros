// Manual MongoDB User Creation Script
// Use this script if the automatic initialization fails
// Run this with: docker exec -it <mongodb_container> mongosh

print("=== Manual MongoDB User Creation ===");
print("Timestamp: " + new Date().toISOString());

// Get credentials from environment (you'll need to replace these with actual values)
// You can get these from: docker exec <container> env | grep MONGO_INITDB
const USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME || "PSPTorchinim";
const PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD || "your_password_here";

if (!USERNAME || !PASSWORD || PASSWORD === "your_password_here") {
  print(
    "ERROR: Please update the USERNAME and PASSWORD variables in this script"
  );
  print(
    "Check your environment variables with: docker exec <container> env | grep MONGO_INITDB"
  );
  quit(1);
}

print("Creating user: " + USERNAME);

// Switch to admin database
db = db.getSiblingDB("admin");

// Check if user already exists
try {
  const existingUser = db.getUser(USERNAME);
  if (existingUser) {
    print("User already exists. Updating password...");
    db.updateUser(USERNAME, {
      pwd: PASSWORD,
      roles: [
        { role: "root", db: "admin" },
        { role: "readWriteAnyDatabase", db: "admin" },
        { role: "dbAdminAnyDatabase", db: "admin" },
        { role: "userAdminAnyDatabase", db: "admin" },
        { role: "clusterAdmin", db: "admin" },
      ],
    });
    print("✓ User updated successfully");
  }
} catch (e) {
  print("User does not exist, creating new user...");

  try {
    db.createUser({
      user: USERNAME,
      pwd: PASSWORD,
      roles: [
        { role: "root", db: "admin" },
        { role: "readWriteAnyDatabase", db: "admin" },
        { role: "dbAdminAnyDatabase", db: "admin" },
        { role: "userAdminAnyDatabase", db: "admin" },
        { role: "clusterAdmin", db: "admin" },
      ],
    });
    print("✓ User created successfully");
  } catch (createError) {
    print("✗ Error creating user: " + createError.message);
    throw createError;
  }
}

// Test authentication
print("Testing authentication...");
try {
  const authResult = db.auth(USERNAME, PASSWORD);
  if (authResult) {
    print("✓ Authentication successful");
  } else {
    print("✗ Authentication failed");
  }
} catch (authError) {
  print("✗ Authentication error: " + authError.message);
}

// List all users to verify
print("Current users in admin database:");
try {
  const users = db.getUsers();
  users.forEach(function (user) {
    print(
      "- " +
        user.user +
        " (roles: " +
        user.roles.map((r) => r.role).join(", ") +
        ")"
    );
  });
} catch (e) {
  print("Could not list users: " + e.message);
}

// Create application databases
print("Creating application databases...");
const appDatabases = [
  "djpanel_documents",
  "djpanel_logging",
  "djpanel_cache",
  "djpanel_sessions",
  "djpanel_audit",
];

appDatabases.forEach(function (dbName) {
  try {
    const appDb = db.getSiblingDB(dbName);
    appDb.createCollection("_metadata");
    appDb._metadata.insertOne({
      created: new Date(),
      purpose: "Database initialization marker",
      version: "1.0.0",
      database: dbName,
      createdBy: "manual-setup-script",
    });
    print("✓ Created database: " + dbName);
  } catch (e) {
    print("⚠ Warning: Could not create database " + dbName + ": " + e.message);
  }
});

print("=== Manual setup complete ===");
print("");
print("To verify the setup, run:");
print('db.adminCommand("listDatabases")');
print("db.getUsers()");
print("");
print("To test connection from application:");
print(
  'mongosh --username "' +
    USERNAME +
    '" --password "' +
    PASSWORD +
    '" --authenticationDatabase admin'
);
