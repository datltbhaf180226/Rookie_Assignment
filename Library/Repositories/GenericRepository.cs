using Microsoft.EntityFrameworkCore;
using Library.Data;
using Library.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Library.Repositoties
{
    public class GenericRepository<T> : IRepository<T> where T : BaseEntity
    {
        protected readonly MyDbContext _context;
        protected readonly DbSet<T> entities;
        public GenericRepository(MyDbContext context)
        {
            _context = context;
            entities = context.Set<T>();
        }
        public void Delete(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }

            entities.Remove(entity);
            _context.SaveChanges();
        }

        public T Get(long id)
        {
            return entities.SingleOrDefault(s => s.Id == id);
        }

        public IEnumerable<T> GetAll(params Expression<Func<T, object>>[] includeProperties)
        {
            var query = entities.AsQueryable();
            return includeProperties.Aggregate(query, (current, include) => current.Include(include));
        }

        public void Insert(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }

            entities.Add(entity);
            _context.SaveChanges();
        }

        public void Update(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }

            _context.SaveChanges();
        }
    }
}
