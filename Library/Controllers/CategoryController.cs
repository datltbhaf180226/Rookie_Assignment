using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Library.Models;
using Library.Repositoties;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Library.Controllers
{
    [Route("categories")]
    [ApiController]
    public class CategoryController : Controller
    {
        private readonly IRepository<Category> _repository;
        private readonly IRepository<User> _userRepo;

        public CategoryController(IRepository<Category> repository, IRepository<User> userRepo)
        {
            _repository = repository;
            _userRepo = userRepo;
        }

        [HttpGet("")]
        public IEnumerable<Category> GetAll()
        {
            var catrgories = _repository.GetAll(c => c.Books);
            return catrgories.ToList();
        }

        [HttpGet("{id}")]
        public Category Get(int id)
        {
            var category = _repository.Get(id);
            return category;
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            int token = int.Parse(Request.Headers["Token"]);

            var user= _userRepo.GetAll().SingleOrDefault(u => u.Id == token);
            if (user == null)
            {
                return Unauthorized();
            }
            else if (user.Role == Role.Admin)
            {
                var category = _repository.Get(id);
                _repository.Delete(category);
                return Ok();
            } else
            {
                return StatusCode(403);
            }
           
        }

        [HttpPost("")]
        public IActionResult Insert(Category category)
        {
            int token = int.Parse(Request.Headers["Token"]);

            var user = _userRepo.GetAll().SingleOrDefault(u => u.Id == token);
            if (user == null)
            {
                return Unauthorized();
            }
            else if (user.Role == Role.Admin)
            {
                var entity = new Category
                {
                    Id = category.Id,
                    Name = category.Name
                };

                _repository.Insert(entity);
                return Ok(entity);
            }
            else
            {
                return StatusCode(403);
            }
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Category category)
        {
            if (!ModelState.IsValid) return null;

            int token = int.Parse(Request.Headers["Token"]);

            var user = _userRepo.GetAll().SingleOrDefault(u => u.Id == token);
            if (user == null)
            {
                return Unauthorized();
            }
            else if (user.Role == Role.Admin)
            {
                var entity = _repository.Get(id);
                entity.Name = category.Name;

                _repository.Update(entity);
                return Ok(entity);
            }
            else
            {
                return StatusCode(403);
            }
        }
    }
}
