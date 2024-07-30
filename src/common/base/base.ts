export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type BaseResponse<T> = {
  status: string;
  statusCode: number;
  message: string[];
  data?: T;
};

export type BasePaginatedResponse<T> = BaseResponse<T> & {
  pagination: PaginationMeta;
};
