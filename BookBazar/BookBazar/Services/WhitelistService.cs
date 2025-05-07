using BookBazzar.Data;
using BookBazzar.Models;
using Microsoft.EntityFrameworkCore;

namespace BookBazzar.Services
{
    public class WhitelistService
    {
        private readonly AppDbContext _context;

        public WhitelistService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Whitelist>> GetUserWhitelistAsync(Guid userId)
        {
            return await _context.Whitelists
                .Include(w => w.Book)
                .Where(w => w.UserId == userId)
                .ToListAsync();
        }

        public async Task<bool> AddToWhitelistAsync(Guid userId, int bookId)
        {
            var exists = await _context.Whitelists
                .AnyAsync(w => w.UserId == userId && w.BookId == bookId);

            if (exists) return false;

            var whitelist = new Whitelist
            {
                UserId = userId,
                BookId = bookId
            };

            _context.Whitelists.Add(whitelist);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveFromWhitelistAsync(Guid userId, int bookId)
        {
            var item = await _context.Whitelists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.BookId == bookId);

            if (item == null) return false;

            _context.Whitelists.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
