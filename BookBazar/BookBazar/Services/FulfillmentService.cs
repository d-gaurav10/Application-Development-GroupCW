using BookBazzar.Data;
using BookBazzar.DTOs;
using BookBazzar.Models;
using Microsoft.EntityFrameworkCore;

namespace BookBazzar.Services
{
    public class FulfillmentService
    {
        private readonly AppDbContext _context;

        public FulfillmentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Order?> FindOrderByClaimCodeAsync(string code)
        {
            return await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Items).ThenInclude(i => i.Book)
                .FirstOrDefaultAsync(o => o.ClaimCode == code && o.Status == "Pending");
        }

        public async Task<bool> FulfillOrderAsync(FulfillOrderDto dto)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.ClaimCode == dto.ClaimCode && o.UserId == dto.UserId && o.Status == "Pending");

            if (order == null) return false;

            order.Status = "Completed";
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateOrderStatusAsync(string claimCode, string status)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.ClaimCode == claimCode);
            if (order == null) return false;

            order.Status = status;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
