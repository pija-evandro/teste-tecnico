function parseApiBody(body) {
  if (typeof body === "string") {
    return JSON.parse(body);
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
