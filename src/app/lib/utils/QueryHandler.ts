type QueryValue = string | number | boolean | Date | Record<string, unknown>;
type QueryParams = Record<string, QueryValue>;

export class QueryHandler {
  params: QueryParams;

  constructor(queryStrings: string) {
    this.params = this.parseQuery(queryStrings);
  }

  private parseQuery(query: string): QueryParams {
    const searchParams = new URLSearchParams(query);
    const result: QueryParams = {};

    searchParams.forEach((value, rawKey) => {
      let parsedValue: QueryValue = value;

      // Number
      if (!isNaN(Number(value)) && value.trim() !== "") {
        parsedValue = Number(value);
      }
      // Boolean
      else if (value === "true" || value === "false") {
        parsedValue = value === "true";
      }
      // Date
      else if (!isNaN(Date.parse(value))) {
        parsedValue = new Date(value);
      }

      // Nested key: e.g. createdAt[$gte]
      const match = rawKey.match(/^(.+)\[(.+)\]$/);
      if (match) {
        const [, mainKey, subKey] = match;
        if (!result[mainKey]) result[mainKey] = {};
        (result[mainKey] as Record<string, unknown>)[subKey] = parsedValue;
      } else {
        result[rawKey] = parsedValue;
      }
    });

    return result;
  }

  getParams(): QueryParams {
    return this.params;
  }

  getPaginationParams(
    defaultPage = 1,
    defaultLimit = 25,
    defaultSortBy = "createdAt",
    defaultSortOrder: 1 | -1 = -1,
  ): { page: number; limit: number; sortBy: string; sortOrder: 1 | -1 } {
    const page =
      typeof this.params.page === "number" && this.params.page > 0
        ? this.params.page
        : defaultPage;

    const limit =
      typeof this.params.limit === "number" && this.params.limit > 0
        ? this.params.limit
        : defaultLimit;

    const sortBy =
      typeof this.params.sortBy === "string"
        ? this.params.sortBy
        : defaultSortBy;

    let sortOrder: 1 | -1;
    if (this.params.sortOrder === 1 || this.params.sortOrder === -1) {
      sortOrder = this.params.sortOrder;
    } else {
      sortOrder = defaultSortOrder;
    }

    return { page, limit, sortBy, sortOrder };
  }

  getFilterParams(whitelist: string[]): QueryParams {
    const match: QueryParams = {};
    for (const [key, value] of Object.entries(this.params)) {
      if (!whitelist.includes(key)) continue;
      match[key] = value;
    }
    return match;
  }

  static fromSearchParams(searchParams: {
    [key: string]: string | string[] | undefined;
  }): QueryHandler {
    const queryString = new URLSearchParams(
      Object.entries(searchParams).flatMap(([key, value]) => {
        if (typeof value === "string") return [[key, value]];
        if (Array.isArray(value)) return value.map((v) => [key, v]);
        return [];
      }),
    ).toString();

    return new QueryHandler(queryString);
  }

  toQueryString(): string {
    return new URLSearchParams(
      Object.entries(this.params).flatMap(([key, value]) => {
        if (value === undefined) return [];
        if (typeof value === "object" && !(value instanceof Date)) {
          return Object.entries(value).map(([subKey, subVal]) => [
            `${key}[${subKey}]`,
            String(subVal),
          ]);
        }
        return [[key, String(value)]];
      }),
    ).toString();
  }
}
