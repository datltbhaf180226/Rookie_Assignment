using Library.Data;
using Library.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Library.Repositoties
{
    public class CategoryRepository : GenericRepository<Category>
    {
        public CategoryRepository(MyDbContext context) : base(context)
        {

        }
    }
}
