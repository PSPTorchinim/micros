// uniwersalny ekstraktor documentId z różnych kształtów populate
function getDocId(input: any): string | undefined {
  if (!input) return undefined;

  // 1) najczęstszy przypadek: obiekt z documentId (to masz w payloadzie)
  if (typeof input.documentId === 'string') return input.documentId;

  // 2) czasem API zwraca stringa (np. przy connect: ["docId"])
  if (typeof input === 'string') return input;

  // 3) niektóre klienty spłaszczają id jako string
  if (input?.id && typeof input.id === 'string') return input.id;

  // 4) strapi v4/v5 różne kształty z data/attributes
  if (input?.data?.attributes?.documentId)
    return input.data.attributes.documentId;
  if (typeof input?.data?.id === 'string') return input.data.id;

  // nic nie znalezione
  return undefined;
}
