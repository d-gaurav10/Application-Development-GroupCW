using BookBazzar.Data;
using BookBazzar.DTOs;
using BookBazzar.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookBazzar.Services
{
    public class CartService
    {
        private readonly AppDbContext _context;

        public CartService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CartItem>> GetUserCartAsync(Guid userId)
        {
            return await _context.CartItems
                .Include(c => c.Book)
                .Where(c => c.UserId == userId)
                .ToListAsync();
        }

        public async Task<CartItem?> AddToCartAsync(Guid userId, AddToCartDto dto)
        {
            var book = await _context.Books.FindAsync(dto.BookId);
            if (book == null || dto.Quantity <= 0) return null;

            var existing = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userId && c.BookId == dto.BookId);

            if (existing != null)
            {
                existing.Quantity += dto.Quantity;
            }
            else
            {
                existing = new CartItem
                {
                    UserId = userId,
                    BookId = dto.BookId,
                    Quantity = dto.Quantity
                };
                _context.CartItems.Add(existing);
            }

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> RemoveCartItemAsync(int cartItemId, Guid userId)
        {
            var item = await _context.CartItems
                .FirstOrDefaultAsync(c => c.Id == cartItemId && c.UserId == userId);

            if (item == null) return false;

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
