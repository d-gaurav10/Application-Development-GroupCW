using BookBazzar.DTOs;
using BookBazzar.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookBazzar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewService _reviewService;

        public ReviewController(ReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        // POST: api/review
        [HttpPost]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> AddReview([FromBody] ReviewDto dto)
        {
            var review = await _reviewService.AddReviewAsync(GetUserId(), dto);
            if (review == null)
                return BadRequest(new { message = "You can only review books you've purchased and not reviewed yet." });

            return Ok(review);
        }

        // GET: api/review/book/{bookId}
        [HttpGet("book/{bookId}")]
        public async Task<IActionResult> GetReviewsForBook(int bookId)
        {
            var reviews = await _reviewService.GetReviewsByBookAsync(bookId);
            return Ok(reviews);
        }

        // GET: api/review/my/{bookId}
        [HttpGet("my/{bookId}")]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> GetOwnReview(int bookId)
        {
            var review = await _reviewService.GetUserReviewAsync(GetUserId(), bookId);
            if (review == null) return NotFound();

            return Ok(review);
        }
    }
}
