using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Helpers
{
    public class PaginationHeader
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int TotalCount { get; set; }
        public int PageSize { get; set; }

        public PaginationHeader(int currentPage, int totalPages, int totalCount, int pageSize)
        {
            CurrentPage = currentPage;
            TotalPages = totalPages;
            TotalCount = totalCount;
            PageSize = pageSize;
        }
    }
}
