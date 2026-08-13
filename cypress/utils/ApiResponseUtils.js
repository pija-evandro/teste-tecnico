function parseApiBody(body) {
  if (body === null || body === undefined) {
    return null;
  }

  if (typeof body !== "string") {
    return body;
  }

  const normalizedBody = body.trim();

  if (!normalizedBody) {
    return null;
  }

  if (normalizedBody.startsWith("<")) {
    throw new Error(
      "Expected JSON response but received HTML from the external service",
    );
  }

  try {
    return JSON.parse(normalizedBody);
  } catch {
    throw new Error(
      "Expected a valid JSON response from the external service",
    );
  }
}

function flattenProductCollections(items) {
  return items.flatMap((item) => {
    if (Array.isArray(item?.products)) {
      return item.products;
    }

    return item;
  });
}

function getProductList(body) {
  const parsedBody = parseApiBody(body);

  if (parsedBody === null) {
    return [];
  }

  if (Array.isArray(parsedBody)) {
    return flattenProductCollections(parsedBody);
  }

  if (Array.isArray(parsedBody?.products)) {
    return flattenProductCollections(parsedBody.products);
  }

  return [];
}

module.exports = {
  parseApiBody,
  getProductList,
};