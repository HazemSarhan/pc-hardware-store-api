const paginate = async (model, queryObject, options, selectFields) => {
  const {
    page = 1,
    limit = 12,
    sort,
    fields,
    numericFilters,
    populate,
  } = options;

  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating'];
    filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = model.find(queryObject);

  // Exclude fields
  if (selectFields) {
    result = result.select(selectFields);
  }

  // Sorting
  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('-createdAt');
  }

  // Field selection
  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }

  // Pagination
  const pageValue = parseInt(page, 10);
  const limitValue = parseInt(limit, 12);
  const skip = (pageValue - 1) * limitValue;

  result = result.skip(skip).limit(limitValue);

  // Apply populate option
  if (populate) {
    result = result.populate(populate);
  }

  const total = await model.countDocuments(queryObject);
  const totalPages = Math.ceil(total / limitValue);

  const results = await result;

  return {
    results,
    pagination: {
      page: pageValue,
      pageSize: limitValue,
      pageCount: totalPages,
      total,
    },
  };
};

module.exports = paginate;
