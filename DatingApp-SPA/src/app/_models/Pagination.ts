export interface Pagination {
    currentPage : number;
    pageSize : number;
    totalPages : number;
    totalCount : number;
}

export class PaginationResult<T> {
    result : T ;
    pagination : Pagination;
    likesParam : any;
}
