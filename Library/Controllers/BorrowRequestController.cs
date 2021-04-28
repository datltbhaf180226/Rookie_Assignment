using Library.Models;
using Library.Repositoties;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace Library.Controllers
{
    [Route("borrowRequests")]
    [ApiController]
    public class BorrowRequestController : ControllerBase
    {
        private readonly IRepository<BorrowRequest> _brRepository;
        private readonly IRepository<User> _userRepo;

        public BorrowRequestController(IRepository<BorrowRequest> brRepository, IRepository<User> userRepo)
        {
            _brRepository = brRepository;
            _userRepo = userRepo;
        }

        [HttpGet("")]
        public IActionResult GetAll()
        {
            if (!ModelState.IsValid) return BadRequest("Co loi xay ra!");

            string token = Request.Headers["Token"];

            if (token == null) return Unauthorized();

            var user = _userRepo.GetAll().SingleOrDefault(u => u.Id == int.Parse(token));

            if (user == null) return Unauthorized();

            if (user.Role == Role.User) return StatusCode(403);

            var borrowRequests = _brRepository.GetAll(b => b.BorrowRequestDetails).ToList();

            if (borrowRequests != null)
            {
                return Ok(borrowRequests);
            }

            return BadRequest("Co loi xay ra!");
        }

        
        [HttpGet("{borrowRequestId}")]
        public IActionResult GetBorrowRequestById(int borrowRequestId)
        {
            if (!ModelState.IsValid) return BadRequest("Co loi xay ra!");

            string token = Request.Headers["Token"];

            if (token == null) return Unauthorized();

            var user = _userRepo.GetAll().SingleOrDefault(u => u.Id == int.Parse(token));

            if (user == null) return Unauthorized();

            if (user.Role == Role.User) return StatusCode(403);

            var borrowRequests = _brRepository.GetAll(b => b.BorrowRequestDetails)
                .AsQueryable()
                .Include(b => b.BorrowRequestDetails)
                .ThenInclude(br => br.Book)
                .ThenInclude(b => b.Category)
                .Where(b => b.Id == borrowRequestId)
                .ToList();

            if (borrowRequests != null)
            {
                return Ok(borrowRequests);
            }

            return BadRequest("Co loi xay ra!");
        }

        //[HttpGet("{userId}")]
        //public IActionResult GetAllRequestsByUserId(int userId)
        //{
        //    var borrowRequests = _brRepository.GetAll(b => b.BorrowRequestDetails, b => b.User).Where(b => b.UserId == userId).ToList();

        //    if (borrowRequests != null)
        //    {
        //        //foreach(var borrowRequest in borrowRequests)
        //        //{
        //        //    borrowRequest.User.BorrowRequests = null;
        //        //}
        //        return Ok(borrowRequests);
        //    }

        //    return BadRequest("Co loi xay ra!");
        //}

        [HttpPost("{userId}")]
        public IActionResult Insert(BorrowRequest borrowRequest, int userId)
        {
            var checkBorrowInMonth = _brRepository.GetAll().Count(br => br.UserId == userId && br.BorrowDate.Month == DateTime.Now.Month);

            if (checkBorrowInMonth < 3)
            {
                if (borrowRequest.BorrowRequestDetails.Count <= 5)
                {
                    borrowRequest.BorrowDate = DateTime.Now;
                    borrowRequest.Status = (Status)0;
                    borrowRequest.UserId = userId;
                    _brRepository.Insert(borrowRequest);
                    return Ok(borrowRequest);
                }
                return BadRequest("Ban ko the muon 5 cuon sach 1 luc");
            }
            return BadRequest("Ban ko the muon qua 3 lan trong 1 thang");
        }

        [HttpPut("{borrowRequestId}/approve")]
        public IActionResult ApproveBorrowRequest(int borrowRequestId)
        {
            if (!ModelState.IsValid) return BadRequest("Co loi xay ra!");

            string token = Request.Headers["Token"];

            if (token == null) return Unauthorized();

            var user = _userRepo.GetAll().SingleOrDefault(u => u.Id == int.Parse(token));

            if (user == null) return Unauthorized();

            if (user.Role == Role.User) return StatusCode(403);

            var entity = _brRepository.Get(borrowRequestId);

            if (entity != null)
            {
                entity.Status = (Status)1;
                _brRepository.Update(entity);
                return Ok(entity);
            }

            return BadRequest("Khong tim thay book co id la " + borrowRequestId!);
        }

        [HttpPut("{borrowRequestId}/reject")]
        public IActionResult RejectBorrowRequest(int borrowRequestId)
        {
            if (!ModelState.IsValid) return BadRequest("Co loi xay ra!");

            string token = Request.Headers["Token"];

            if (token == null) return Unauthorized();

            var user = _userRepo.GetAll().SingleOrDefault(u => u.Id == int.Parse(token));

            if (user == null) return Unauthorized();

            if (user.Role == Role.User) return StatusCode(403);

            var entity = _brRepository.Get(borrowRequestId);

            if (entity != null)
            {
                entity.Status = (Status)2;
                _brRepository.Update(entity);
                return Ok(entity);
            }

            return BadRequest("Khong tim thay book co id la " + borrowRequestId!);
        }
    }
}