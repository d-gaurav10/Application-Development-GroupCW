using BookBazzar.Data;
using BookBazzar.DTOs;
using BookBazzar.Models;
using Microsoft.EntityFrameworkCore;

namespace BookBazzar.Services
{
    public class ReviewService
    {
        private readonly AppDbContext _context;

        public ReviewService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CanUserReviewAsync(Guid userId, int bookId)
        {
            return await _context.Orders
                .Include(o => o.Items)
                .AnyAsync(o => o.UserId == userId &&
                               o.Status == "Completed" &&
                               o.Items.Any(i => i.BookId == bookId));
        }

        public async Task<bool> HasUserAlreadyReviewed(Guid userId, int bookId)
        {
            return await _context.Reviews.AnyAsync(r => r.UserId == userId && r.BookId == bookId);
        }

        public async Task<Review?> AddReviewAsync(Guid userId, ReviewDto dto)
{
    // Check if user has purchased and completed the order for this book
    var canReview = await _context.Orders
        .Include(o => o.Items)
        .AnyAsync(o => 
            o.UserId == userId && 
            o.Status == "Completed" &&
            o.Items.Any(i => i.BookId == dto.BookId));

    if (!canReview) return null;

    // Check if user has already reviewed this book
    var hasReviewed = await _context.Reviews
        .AnyAsync(r => r.UserId == userId && r.BookId == dto.BookId);

    if (hasReviewed) return null;

    var review = new Review
    {
        UserId = userId,
        BookId = dto.BookId,
        Rating = dto.Rating,
        Comment = dto.Comment,
        CreatedAt = DateTime.UtcNow
    };

    _context.Reviews.Add(review);
    await _context.SaveChangesAsync();

    return review;
}
        public async Task<IEnumerable<Review>> GetReviewsByBookAsync(int bookId)
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.BookId == bookId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<Review?> GetUserReviewAsync(Guid userId, int bookId)
        {
            return await _context.Reviews
                .FirstOrDefaultAsync(r => r.UserId == userId && r.BookId == bookId);
        }
    }
}
