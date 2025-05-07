using BookBazzar.Data;
using BookBazzar.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace BookBazzar.Services
{
    public class OrderService
    {
        private readonly AppDbContext _context;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

       public async Task<Order?> PlaceOrderAsync(Guid userId, string? discountCode = null)
{
    var cartItems = await _context.CartItems
        .Include(c => c.Book)
        .Where(c => c.UserId == userId)
        .ToListAsync();

    if (!cartItems.Any()) return null;

    decimal subtotal = cartItems.Sum(i => i.Book.Price * i.Quantity);
    decimal discount = 0;

    // Apply automatic discounts
    int totalBooks = cartItems.Sum(i => i.Quantity);
    if (totalBooks >= 5) discount += 0.05m;
    int pastOrders = await _context.Orders.CountAsync(o => o.UserId == userId);
    if (pastOrders >= 10) discount += 0.10m;

    // Improved Discount Code Validation
    if (!string.IsNullOrEmpty(discountCode))
    {
        var validCodes = new Dictionary<string, decimal>
        {
            { "SAVE10", 0.10m },
            { "SAVE20", 0.20m },
            { "OFF50", 0.50m } // Example additional discount code
        };

        if (validCodes.ContainsKey(discountCode.ToUpper()))
        {
            discount += validCodes[discountCode.ToUpper()];
        }
        else
        {
            throw new InvalidOperationException("Invalid discount code.");
        }
    }

    decimal totalAfterDiscount = subtotal * (1 - discount);

    var order = new Order
    {
        UserId = userId,
        TotalAmount = totalAfterDiscount,
        DiscountApplied = discount,
        ClaimCode = GenerateClaimCode(),
        Status = "Pending",
        Items = cartItems.Select(c => new OrderItem
        {
            BookId = c.BookId,
            Quantity = c.Quantity,
            Price = c.Book.Price
        }).ToList()
    };

    _context.Orders.Add(order);
    _context.CartItems.RemoveRange(cartItems);

    await _context.SaveChangesAsync();
    return order;
}

        public async Task<IEnumerable<Order>> GetUserOrdersAsync(Guid userId)
        {
            return await _context.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Book)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(int id, Guid userId)
        {
            return await _context.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Book)
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);
        }

        private string GenerateClaimCode()
        {
            return Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
        }
    }
}
