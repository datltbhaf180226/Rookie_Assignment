using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Library.Models
{
    public class BorrowRequestDetail
    {
        public int BorrowRequestId { get; set; }
        public int BookId { get; set; }
        public virtual Book Book { get; set; }
        public virtual BorrowRequest BorrowRequest { get; set; }

    }
}
