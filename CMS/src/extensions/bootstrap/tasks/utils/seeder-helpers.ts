/**
 * Comprehensive seeder utility functions for Strapi content creation
 * Provides logging, CRUD operations, and relation handling
 */

type StrapiInstance = any;
type ContentData = Record<string, any>;
type QueryResult = any;

/**
 * Enhanced logger with consistent formatting for seeding operations
 */
export class SeederLogger {
  constructor(private context: string) {}

  info(message: string) {
    console.info(`[SEED][${this.context}] ℹ️  ${message}`);
  }

  success(message: string) {
    console.info(`[SEED][${this.context}] ✅ ${message}`);
  }

  warn(message: string) {
    console.warn(`[SEED][${this.context}] ⚠️  ${message}`);
  }

  error(message: string, error?: any) {
    console.error(`[SEED][${this.context}] ❌ ${message}`);
    if (error) {
      console.error(`[SEED][${this.context}] Error details:`, error?.message || error);
      if (error?.stack) {
        console.error(`[SEED][${this.context}] Stack trace:`, error.stack);
      }
    }
  }

  debug(message: string) {
    console.debug(`[SEED][${this.context}] 🔍 ${message}`);
  }
}

/**
 * Find or create an entity in the database
 * Useful for idempotent seeding
 */
export async function findOrCreate(
  strapi: StrapiInstance,
  uid: string,
  findQuery: ContentData,
  createData: ContentData,
  logger: SeederLogger,
  entityName?: string
): Promise<QueryResult> {
  const name = entityName || uid.split('::').pop();
  
  try {
    // Try to find existing entity
    const existing = await strapi.db.query(uid).findOne({ where: findQuery });
    
    if (existing) {
      logger.debug(`${name} already exists (id: ${existing.id})`);
      return existing;
    }

    // Create new entity
    logger.info(`Creating ${name}...`);
    const created = await strapi.db.query(uid).create({ data: createData });
    logger.success(`Created ${name} (id: ${created.id})`);
    
    return created;
  } catch (error) {
    logger.error(`Failed to find or create ${name}`, error);
    throw error;
  }
}

/**
 * Create an entity, checking if it exists first
 */
export async function createIfNotExists(
  strapi: StrapiInstance,
  uid: string,
  uniqueField: string,
  data: ContentData,
  logger: SeederLogger,
  entityName?: string
): Promise<QueryResult> {
  const name = entityName || uid.split('::').pop();
  const uniqueValue = data[uniqueField];

  if (!uniqueValue) {
    logger.warn(`No ${uniqueField} provided for ${name}, skipping uniqueness check`);
  }

  return findOrCreate(
    strapi,
    uid,
    uniqueValue ? { [uniqueField]: uniqueValue } : {},
    data,
    logger,
    name
  );
}

/**
 * Publish an entity (for content types with draftAndPublish enabled)
 */
export async function publishEntity(
  strapi: StrapiInstance,
  uid: string,
  entityId: number,
  logger: SeederLogger,
  entityName?: string
): Promise<void> {
  const name = entityName || uid.split('::').pop();
  
  try {
    logger.debug(`Publishing ${name} (id: ${entityId})...`);
    await strapi.db.query(uid).update({
      where: { id: entityId },
      data: { publishedAt: new Date() },
    });
    logger.success(`Published ${name} (id: ${entityId})`);
  } catch (error) {
    logger.error(`Failed to publish ${name} (id: ${entityId})`, error);
    throw error;
  }
}

/**
 * Create and publish an entity in one operation
 */
export async function createAndPublish(
  strapi: StrapiInstance,
  uid: string,
  uniqueField: string,
  data: ContentData,
  logger: SeederLogger,
  entityName?: string
): Promise<QueryResult> {
  const entity = await createIfNotExists(strapi, uid, uniqueField, data, logger, entityName);
  
  // Only publish if it's newly created (doesn't have publishedAt)
  if (!entity.publishedAt) {
    await publishEntity(strapi, uid, entity.id, logger, entityName);
  }
  
  return entity;
}

/**
 * Get or create a single-type entity
 */
export async function getOrCreateSingleType(
  strapi: StrapiInstance,
  uid: string,
  data: ContentData,
  logger: SeederLogger,
  entityName?: string
): Promise<QueryResult> {
  const name = entityName || uid.split('::').pop();
  
  try {
    // Try to find existing single type
    logger.debug(`Checking for existing ${name}...`);
    const existing = await strapi.db.query(uid).findMany({ limit: 1 });
    
    if (existing && existing.length > 0) {
      logger.debug(`${name} already exists (id: ${existing[0].id})`);
      return existing[0];
    }

    // Create new single type
    logger.info(`Creating ${name}...`);
    const created = await strapi.db.query(uid).create({ data });
    logger.success(`Created ${name} (id: ${created.id})`);
    
    return created;
  } catch (error) {
    logger.error(`Failed to get or create ${name}`, error);
    throw error;
  }
}

/**
 * Count entities of a given type
 */
export async function countEntities(
  strapi: StrapiInstance,
  uid: string,
  logger: SeederLogger
): Promise<number> {
  try {
    const count = await strapi.db.query(uid).count();
    logger.debug(`Found ${count} existing entities for ${uid}`);
    return count;
  } catch (error: any) {
    logger.warn(`Failed to count entities for ${uid}: ${error?.message || error}`);
    return 0;
  }
}

/**
 * Delete all entities of a given type (use with caution)
 */
export async function deleteAllEntities(
  strapi: StrapiInstance,
  uid: string,
  logger: SeederLogger,
  entityName?: string
): Promise<number> {
  const name = entityName || uid.split('::').pop();
  
  try {
    const entities = await strapi.db.query(uid).findMany();
    const count = entities.length;
    
    if (count === 0) {
      logger.debug(`No ${name} entities to delete`);
      return 0;
    }

    logger.warn(`Deleting ${count} ${name} entities...`);
    
    for (const entity of entities) {
      await strapi.db.query(uid).delete({ where: { id: entity.id } });
    }
    
    logger.success(`Deleted ${count} ${name} entities`);
    return count;
  } catch (error) {
    logger.error(`Failed to delete ${name} entities`, error);
    throw error;
  }
}

/**
 * Create a component (for use in dynamic zones and repeatable components)
 */
export function createComponent(
  componentName: string,
  data: ContentData
): ContentData {
  return {
    __component: componentName,
    ...data,
  };
}

/**
 * Batch create multiple entities
 */
export async function batchCreate(
  strapi: StrapiInstance,
  uid: string,
  dataArray: ContentData[],
  uniqueField: string,
  logger: SeederLogger,
  entityName?: string
): Promise<QueryResult[]> {
  const name = entityName || uid.split('::').pop();
  logger.info(`Batch creating ${dataArray.length} ${name} entities...`);
  
  const results: QueryResult[] = [];
  
  for (let i = 0; i < dataArray.length; i++) {
    const data = dataArray[i];
    try {
      const entity = await createIfNotExists(
        strapi,
        uid,
        uniqueField,
        data,
        logger,
        `${name}[${i}]`
      );
      results.push(entity);
    } catch (error) {
      logger.error(`Failed to create ${name}[${i}]`, error);
      // Continue with next item instead of failing entirely
    }
  }
  
  logger.success(`Batch created ${results.length}/${dataArray.length} ${name} entities`);
  return results;
}

/**
 * Batch create and publish multiple entities
 */
export async function batchCreateAndPublish(
  strapi: StrapiInstance,
  uid: string,
  dataArray: ContentData[],
  uniqueField: string,
  logger: SeederLogger,
  entityName?: string
): Promise<QueryResult[]> {
  const name = entityName || uid.split('::').pop();
  logger.info(`Batch creating and publishing ${dataArray.length} ${name} entities...`);
  
  const results: QueryResult[] = [];
  
  for (let i = 0; i < dataArray.length; i++) {
    const data = dataArray[i];
    try {
      const entity = await createAndPublish(
        strapi,
        uid,
        uniqueField,
        data,
        logger,
        `${name}[${i}]`
      );
      results.push(entity);
    } catch (error) {
      logger.error(`Failed to create and publish ${name}[${i}]`, error);
      // Continue with next item instead of failing entirely
    }
  }
  
  logger.success(`Batch created and published ${results.length}/${dataArray.length} ${name} entities`);
  return results;
}
