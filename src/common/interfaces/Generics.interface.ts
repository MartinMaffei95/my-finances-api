export type Measurements = 'gr'| 'un'| 'ml'
export type ProductType = ['BASIC', 'ELABORATED'];

export interface PaginationInfo {
  page: number;
  perPage: number;
  totalPages: number;
  totalElements: number;
  nextPage: number | null;
  prevPage: number | null;
}

export type PaginatedData<Data> = {
  data: Data;
  pagination: PaginationInfo;
};
