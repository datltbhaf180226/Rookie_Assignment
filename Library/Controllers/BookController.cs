using Library.Models;
using Library.Repositoties;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace Library.Controllers
{
    [Route("books")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IRepository<Book> _repository;
        private readonly IRepository<User> _userRepo;

        public BookController(IRepository<Book> repository, IRepository<User> userRepo)
        {
            _repository = repository;
            _userRepo = userRepo;
        }

        [HttpGet("")]
        public IActionResult GetAll()
        {
            var books = _repository.GetAll(b => b.Category).ToList();

            if (books != null)
            {
                foreach (var book in books)
                {
                    book.Category.Books = new List<Book>();
                }
                return Ok(books);
            }
            return BadRequest("Co loi xay ra!");
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var book = _repository.GetAll(b => b.Category).SingleOrDefault(b => b.Id == id);
            if (book != null)
            {
                book.Category.Books = null;
                return Ok(book);
            }
            return BadRequest("Khong tim thay book co id:" + id);
        }

        //[Route("borrowBooks")]
        [HttpGet("borrowBooks")]
        public IActionResult GetListBookOfBorrowRequest(int[] listBookId)
        {
            List<string> borrowBooks = new List<string>();

            foreach (var bookId in listBookId)
            {
                var book = _repository.GetAll().SingleOrDefault(b => b.Id == bookId);
                if (book != null)
                {
                    borrowBooks.Add(book.Name);
                }
                
            }

            return Ok(borrowBooks);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            string token = Request.Headers["Token"];

            if (token != null)
            {
                var user = _userRepo.GetAll().SingleOrDefault(u => u.Id == int.Parse(token));
                if (user == null)
                {
                    return Unauthorized();
                }
                else if (user.Role == Role.Admin)
                {
                    var book = _repository.Get(id);
                    if (book != null)
                    {
                        _repository.Delete(book);
                        return Ok(book);
                    }
                    return BadRequest("Khong tim thay book co id:" + id);
                }
                else
                {
                    return StatusCode(403);
                }
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpPost("")]
        public IActionResult Insert(Book book)
        {
            if (!ModelState.IsValid) return BadRequest("Co loi xay ra!");

            string token = Request.Headers["Token"];
            if (token == null)
            {
                return Unauthorized();
            }
            else
            {
                var user = _userRepo.GetAll().SingleOrDefault(u => u.Id == int.Parse(token));
                if (user.Role == Role.Admin)
                {
                    var entity = new Book
                    {
                        Id = book.Id,
                        Name = book.Name,
                        Author = book.Author,
                        CategoryId = book.CategoryId
                    };
                    if (entity != null)
                    {
                        _repository.Insert(entity);
                        return Created("", entity);
                    }
                    return BadRequest("Co loi xay ra!");
                }
                else
                {
                    return StatusCode(403);
                }
            }
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Book book)
        {
            if (!ModelState.IsValid) return BadRequest("Co loi xay ra!");

            string token = Request.Headers["Token"];

            if (token != null)
            {
                var user = _userRepo.GetAll().SingleOrDefault(u => u.Id == int.Parse(token));
                if (user == null)
                {
                    return Unauthorized();
                }
                else if (user.Role == Role.Admin)
                {
                    var entity = _repository.Get(id);

                    if (entity != null)
                    {
                        entity.Name = book.Name;
                        entity.Author = book.Author;
                        entity.CategoryId = book.CategoryId;
                        _repository.Update(entity);
                        return Ok(entity);
                    }

                    return BadRequest("Khong tim thay book co id la " + id!);
                }
                else
                {
                    return StatusCode(403);
                }
            }
            else
            {
                return Unauthorized();
            }
            
        }
    }
}