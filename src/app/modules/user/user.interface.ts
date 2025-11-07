// Interface for pagination
export interface IPagination {
  limit?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface IPaginationResponse {
  limit: number;
  page: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}
