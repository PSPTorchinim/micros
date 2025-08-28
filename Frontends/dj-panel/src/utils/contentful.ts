import {
  createClient,
  EntryCollection,
  EntrySkeletonType,
  Entry,
} from 'contentful';

const SPACE_ID = process.env.REACT_APP_CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN;

if (!SPACE_ID) {
  throw new Error(
    'REACT_APP_CONTENTFUL_SPACE_ID environment variable is not set',
  );
}
if (!ACCESS_TOKEN) {
  throw new Error(
    'REACT_APP_CONTENTFUL_ACCESS_TOKEN environment variable is not set',
  );
}

const client = createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN,
});

export async function fetchEntries<T extends EntrySkeletonType>(
  contentType: string,
): Promise<EntryCollection<T>> {
  return client.getEntries<T>({ content_type: contentType });
}

export async function fetchEntryById<T extends EntrySkeletonType>(
  id: string,
): Promise<Entry<T, undefined, string> | undefined> {
  return client.getEntry<T>(id);
}
