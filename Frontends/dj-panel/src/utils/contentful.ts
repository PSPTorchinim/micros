import { createClient, EntryCollection } from 'contentful';

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

export async function fetchEntries(
  contentType: string,
): Promise<EntryCollection<any>> {
  return client.getEntries({ content_type: contentType });
}

export async function fetchEntryById(id: string): Promise<any> {
  return client.getEntry(id);
}
