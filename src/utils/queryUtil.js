import APIFeatures from "./apiFeatures.js";

/**
 * Reusable function for fetching paginated, filtered, sorted data
 * with total and filtered counts.
 *
 * @param {Object} repo - Repository object containing `findAll`, `countAll`, and `countFiltered` methods.
 * @param {Object} queryParams - The request query parameters.
 * @returns {Promise<{data: Array, total: number, totalFiltered: number}>}
 */

export const getAllDocuments = async (repo, queryParams, searchableFields = []) => {
  const baseQuery = repo.findAll();
  const isAll = queryParams.all === "true";

  // Apply API features (filter, sort, fields)
  const features = new APIFeatures( baseQuery, queryParams )
    .filter()
    .search(searchableFields)
    .sort()
    .limitFields();

  // Extract filter from Mongoose query for countFiltered
  const filter = features.query.getFilter();

  // Apply pagination only when 'all' is not true
  if (!isAll) features.paginate();

  // Execute data query and counts concurrently
  const [data, total, totalFiltered] = await Promise.all([
    features.query,
    repo.countAll(),
    repo.countFiltered(filter),
  ]);

  // Process media with signed URLs if method exists (for properties)
  const processedData = repo.processPropertiesMedia 
    ? await repo.processPropertiesMedia(data)
    : data;

  return { data: processedData, total, totalFiltered };
};
