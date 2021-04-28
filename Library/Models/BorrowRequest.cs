using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Library.Models
{
    public class BorrowRequest : BaseEntity
    {
        public int UserId { get; set; }
        public DateTime BorrowDate { get; set; }
        public Status Status { get; set; }
        public virtual User User { get; set; }
        public ICollection<BorrowRequestDetail> BorrowRequestDetails { get; set; } = new List<BorrowRequestDetail>();
    }
}
