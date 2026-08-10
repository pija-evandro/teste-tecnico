function parseApiBody(body) {
  if (body === null || body === undefined) {
    return null;
  }

  if (typeof body === "string") {
    const normalizedBody = body.trim();

    if (!normalizedBody) {
      return null;
    }

    return JSON.parse(normalizedBody);
  }

  return body;
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