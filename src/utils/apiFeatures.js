class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Filtering (supports advanced operators like gte, lte, in, etc.)
  filter() {
    const queryObj = { ...this.queryString };
    const excluded = ['page', 'sort', 'limit', 'fields', 'all', 'search', 'startDate', 'endDate'];
    excluded.forEach(key => delete queryObj[key]);

    // --- DATE RANGE SUPPORT ---
    if (this.queryString.startDate || this.queryString.endDate) {
      queryObj.date = {};

      if (this.queryString.startDate) {
        queryObj.date.gte = new Date(this.queryString.startDate);
      }
      if (this.queryString.endDate) {
        queryObj.date.lte = new Date(this.queryString.endDate);
      }
    }

    Object.keys(queryObj).forEach(key => {
      const value = queryObj[key];

      if (
        value === undefined ||
        value === null ||
        value === '' ||
        (typeof value === 'object' && Object.keys(value).length === 0)
      ) {
        delete queryObj[key];
      }
    });

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|in|ne)\b/g, m => `$${m}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  search(searchableFields = []) {
    const keyword = (this.queryString.search || this.queryString.Search)?.trim();
    if (!keyword || searchableFields.length === 0) return this;

    const baseFilter = this.query.getFilter ? this.query.getFilter() : {};

    const keywords = keyword.split(/\s+/).filter(Boolean);

    const andConditions = keywords.map(word => {
      const regex = new RegExp(word, 'i');
      return { $or: searchableFields.map(field => ({ [field]: regex })) };
    });

    // Merge search conditions with any existing filters
    const hasBaseFilter = Object.keys(baseFilter || {}).length > 0;

const finalFilter = hasBaseFilter
  ? { $and: [baseFilter, ...andConditions] }
  : { $and: andConditions };

    this.query = this.query.find(finalFilter);

    return this;
  }

// Sorting (multi-field support)
  sort() {
    const sortBy = this.queryString.sort
      ? this.queryString.sort.split(',').join(' ')
      : '-createdAt';

    this.query = this.query.sort(sortBy);
    return this;
  }

  // Field selection (projection)
  limitFields() {
    const fields = this.queryString.fields
      ? this.queryString.fields.split(',').join(' ')
      : '-__v';

    this.query = this.query.select(fields);
    return this;
  }

  // Pagination
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;
