import { FilterQuery, Model, Query, Document, Types } from 'mongoose';

interface BaseDocument extends Document {
  _id: Types.ObjectId;
}

// Extend QueryOptions to be more flexible
export interface QueryOptions {
  searchTerm?: string | null;
  sort?: string | null;
  limit?: number | null;
  page?: number | null;
  fields?: string | null;
  [key: string]: unknown;
}

// Pagination result type
interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// Result type for query execution
interface QueryResult<T extends BaseDocument> {
  data: T[];
  pagination: PaginationResult;
}

class QueryBuilder<T extends BaseDocument> {
  private model: Model<T>;
  private queryOptions: QueryOptions;
  private baseQuery: FilterQuery<T>;
  private query: Query<T[], T>;

  constructor(model: Model<T>, queryOptions: QueryOptions = {}) {
    this.model = model;
    this.queryOptions = this.sanitizeQueryOptions(queryOptions);
    this.baseQuery = {};
    this.query = this.model.find();
  }

  /**
   * Sanitize and validate query options
   */
  private sanitizeQueryOptions(options: QueryOptions): QueryOptions {
    const sanitizedOptions: QueryOptions = { ...options };

    // Validate and parse numeric options
    if (sanitizedOptions.page !== undefined && sanitizedOptions.page !== null) {
      sanitizedOptions.page = Math.max(1, Number(sanitizedOptions.page));
    }

    if (sanitizedOptions.limit !== undefined && sanitizedOptions.limit !== null) {
      sanitizedOptions.limit = Math.max(1, Math.min(Number(sanitizedOptions.limit), 1000));
    }

    return sanitizedOptions;
  }

  /**
   * Perform search across multiple fields
   * @param searchableFields - Array of fields to search
   */
  search(searchableFields: (keyof T)[]): this {
    const { searchTerm } = this.queryOptions;

    if (searchTerm && searchableFields.length > 0) {
      this.baseQuery.$or = searchableFields.map((field) => ({
        [field]: {
          $regex: String(searchTerm).trim(),
          $options: 'i',
        },
      })) as FilterQuery<T>[];
    }

    return this;
  }

  /**
   * Apply filtering based on query parameters
   */
  filter(): this {
    const excludeFields: (keyof QueryOptions)[] = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

    // Create a copy of query options without excluded fields
    const filterQuery = Object.fromEntries(
      Object.entries(this.queryOptions)
        .filter(([key]) => !excludeFields.includes(key as keyof QueryOptions))
        .map(([key, value]) => [key, value])
    ) as FilterQuery<T>;

    // Merge base query with filter query
    this.baseQuery = { ...this.baseQuery, ...filterQuery };

    return this;
  }

  /**
   * Apply sorting to the query
   */
  sort(): this {
    const { sort = '-createdAt' } = this.queryOptions;
    const sortString = sort
      ? String(sort)
          .split(',')
          .map((field) => field.trim())
          .join(' ')
      : '-createdAt';

    this.query = this.query.sort(sortString);

    return this;
  }

  /**
   * Apply pagination
   */
  paginate(): this {
    const page = this.queryOptions.page ? Number(this.queryOptions.page) : 1;
    const limit = this.queryOptions.limit ? Number(this.queryOptions.limit) : 20;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  /**
   * Select specific fields
   */
  fields(): this {
    const { fields = '-__v' } = this.queryOptions;
    const fieldString = fields
      ? String(fields)
          .split(',')
          .map((field) => field.trim())
          .join(' ')
      : '-__v';

    this.query = this.query.select(fieldString);

    return this;
  }

  /**
   * Apply all query modifications
   */
  applyModifications(searchFields: (keyof T)[] = []): this {
    this.query = this.model.find(this.baseQuery);
    return this.search(searchFields).filter().sort().fields().paginate();
  }

  /**
   * Get paginated results with total count
   */
  async execute(searchFields: (keyof T)[] = []): Promise<QueryResult<T>> {
    // Apply all modifications
    this.applyModifications(searchFields);

    // Execute query and count total documents
    const [data, total] = await Promise.all([
      this.query.exec(),
      this.model.countDocuments(this.baseQuery),
    ]);

    const page = this.queryOptions.page ? Number(this.queryOptions.page) : 1;
    const limit = this.queryOptions.limit ? Number(this.queryOptions.limit) : 20;
    const totalPage = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPage,
      },
    };
  }

  /**
   * Advanced filtering with operators support
   */
  advancedFilter(filterOperators: FilterQuery<T>): this {
    this.baseQuery = {
      ...this.baseQuery,
      ...filterOperators,
    };

    return this;
  }

  /**
   * Populate related documents
   * @param paths - Paths to populate
   */
  populate(paths: string | string[]): this {
    this.query = this.query.populate(paths);
    return this;
  }
}

export default QueryBuilder;
