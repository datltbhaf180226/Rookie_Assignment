using Library.Data;
using Library.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Library.Repositoties
{
    //public interface IUserRepository : IRepository<User>
    //{
    //    IEnumerable<User> CheckLogin(string username, string password);
    //}
    public class UserRepository : GenericRepository<User>
    {
        public UserRepository(MyDbContext context) : base(context)
        {
             
        }

        //public IEnumerable<User> CheckLogin(string username, string password)
        //{
        //    var user = entities.Where(o => o.Username == username && o.Password == password).AsEnumerable();

        //    return user;
        //}

    }
}
