using BookBazzar.Data;
using BookBazzar.DTOs;
using Microsoft.EntityFrameworkCore;

namespace BookBazzar.Services
{
    public class AdminDashboardService
    {
        private readonly AppDbContext _context;

        public AdminDashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<object>> GetDailySalesAsync(DateTime from, DateTime to)
        {
            var orders = await _context.Orders
                .Where(o => o.Status == "Completed" && o.CreatedAt >= from && o.CreatedAt <= to)
                .ToListAsync();

            var grouped = orders
                .GroupBy(o => o.CreatedAt.Date)
                .OrderBy(g => g.Key)
                .Select(g => new
                {
                    date = g.Key.ToString("yyyy-MM-dd"),
                    revenue = g.Sum(o => o.TotalAmount)
                }).ToList<object>();

            return grouped;
        }


        public async Task<IEnumerable<object>> SearchUsersAsync(string? role, string? search)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(role))
                query = query.Where(u => u.Role == role);

            if (!string.IsNullOrEmpty(search))
                query = query.Where(u => u.FullName.Contains(search) || u.Email.Contains(search));

            return await query
                .OrderBy(u => u.FullName)
                .Select(u => new { u.Id, u.FullName, u.Email, u.Role })
                .ToListAsync();
        }

        public async Task<IEnumerable<object>> SearchOrdersAsync(string? status, string? search)
        {
            var query = _context.Orders
                .Include(o => o.User)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(o => o.Status == status);

            if (!string.IsNullOrEmpty(search))
                query = query.Where(o => o.ClaimCode.Contains(search) || o.User.FullName.Contains(search));

            return await query
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.Id,
                    o.ClaimCode,
                    o.Status,
                    o.TotalAmount,
                    o.CreatedAt,
                    User = new { o.User.FullName, o.User.Email }
                })
                .ToListAsync();
        }



        public async Task<AdminDashboardDto> GetSummaryAsync()
        {
            var totalUsers = await _context.Users.CountAsync();

            return new AdminDashboardDto
            {
                TotalBooks = await _context.Books.CountAsync(),
                TotalUsers = totalUsers,
                TotalAdmins = await _context.Users.CountAsync(u => u.Role == "Admin"),
                TotalMembers = await _context.Users.CountAsync(u => u.Role == "Member"),
                TotalStaff = await _context.Users.CountAsync(u => u.Role == "Staff"),

                TotalOrders = await _context.Orders.CountAsync(),
                CompletedOrders = await _context.Orders.CountAsync(o => o.Status == "Completed"),
                PendingOrders = await _context.Orders.CountAsync(o => o.Status == "Pending"),

                TotalRevenue = await _context.Orders
                    .Where(o => o.Status == "Completed")
                    .SumAsync(o => (decimal?)o.TotalAmount) ?? 0,

                LowStockBooks = await _context.Books
                    .Where(b => b.Stock < 5)
                    .Select(b => $"{b.Title} ({b.Stock})")
                    .ToListAsync(),

                MostRatedBooks = await _context.Reviews
                    .GroupBy(r => r.BookId)
                    .OrderByDescending(g => g.Count())
                    .Take(5)
                    .Select(g => g.First().Book.Title)
                    .ToListAsync()
            };
        }
    }
}
