using BookBazzar.Data;
using BookBazzar.Models;
using BookBazzar.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace BookBazzar.Services
{
    public class OrderService
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;

        public OrderService(AppDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
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

            // Check for loyalty discount (10+ completed orders)
            var completedOrders = await _context.Orders
                .CountAsync(o => o.UserId == userId && o.Status == "Completed");
            if (completedOrders >= 10) discount += 0.10m;

            // Apply coupon code
            if (!string.IsNullOrEmpty(discountCode))
            {
                var validCodes = new Dictionary<string, decimal>
                {
                    { "SAVE10", 0.10m },
                    { "SAVE20", 0.20m },
                    { "OFF50", 0.50m }
                };
                if (validCodes.TryGetValue(discountCode.ToUpper(), out var codeDiscount))
                    discount += codeDiscount;
            }

            // Cap total discount at 75%
            discount = Math.Min(discount, 0.75m);
            decimal finalTotal = subtotal * (1 - discount);

            var order = new Order
            {
                UserId = userId,
                TotalAmount = finalTotal,
                DiscountApplied = discount,
                Status = "Pending",
                ClaimCode = GenerateClaimCode(),
                CreatedAt = DateTime.UtcNow,
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

            // Send email confirmation
            await _emailService.SendOrderConfirmationAsync(order);

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

        public async Task<bool> CancelOrderAsync(int orderId, Guid userId)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

            if (order == null || order.Status != "Pending")
                return false; // Only allow cancellation of pending orders

            _context.OrderItems.RemoveRange(order.Items);
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return true;
        }

        private string GenerateClaimCode()
        {
            return Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();
        }


        public async Task<IEnumerable<Order>> GetPendingOrdersAsync()
{
    return await _context.Orders
        .Include(o => o.Items)
        .ThenInclude(i => i.Book)
        .Where(o => o.Status == "Pending")
        .OrderBy(o => o.CreatedAt)
        .ToListAsync();
}
public async Task<Order?> FindOrderByClaimCodeAsync(string code)
    {
        return await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Book)
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.ClaimCode == code && o.Status == "Pending");
    }

    public async Task<Order?> FulfillOrderAsync(FulfillOrderDto dto)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Book)
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => 
                o.ClaimCode == dto.ClaimCode && 
                o.UserId == dto.UserId && 
                o.Status == "Pending");

        if (order == null) return null;

        order.Status = "Completed";
        await _context.SaveChangesAsync();

        return order;
    }
    }
}
