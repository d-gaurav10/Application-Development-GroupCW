using BookBazzar.Data;
using BookBazzar.DTOs;
using BookBazzar.Models;
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

        // ✅ Enhanced Dashboard Summary
        public async Task<AdminDashboardDto> GetEnhancedSummaryAsync()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalAdmins = await _context.Users.CountAsync(u => u.Role == "Admin");
            var totalMembers = await _context.Users.CountAsync(u => u.Role == "Member");
            var totalStaff = await _context.Users.CountAsync(u => u.Role == "Staff");

            var totalOrders = await _context.Orders.CountAsync();
            var pendingOrders = await _context.Orders.CountAsync(o => o.Status == "Pending");
            var completedOrders = await _context.Orders.CountAsync(o => o.Status == "Completed");

            var totalRevenue = await _context.Orders
                .Where(o => o.Status == "Completed")
                .SumAsync(o => (decimal?)o.TotalAmount) ?? 0;

            var lowStockBooks = await _context.Books
                .Where(b => b.Stock < 5)
                .Select(b => $"{b.Title} ({b.Stock})")
                .ToListAsync();

            var topRatedBooks = await _context.Reviews
                .GroupBy(r => r.BookId)
                .OrderByDescending(g => g.Average(r => r.Rating))
                .Take(5)
                .Select(g => g.First().Book.Title)
                .ToListAsync();

            return new AdminDashboardDto
            {
                TotalBooks = await _context.Books.CountAsync(),
                TotalUsers = totalUsers,
                TotalAdmins = totalAdmins,
                TotalMembers = totalMembers,
                TotalStaff = totalStaff,
                TotalOrders = totalOrders,
                PendingOrders = pendingOrders,
                CompletedOrders = completedOrders,
                TotalRevenue = totalRevenue,
                LowStockBooks = lowStockBooks,
                MostRatedBooks = topRatedBooks
            };
        }

        // ✅ Update Order Status
        public async Task<bool> UpdateOrderStatus(int orderId, string status)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return false;

            order.Status = status;
            await _context.SaveChangesAsync();
            return true;
        }

        // ✅ Discount Codes

        public async Task<bool> AddDiscountCodeAsync(string code, decimal discount)
        {
            var existing = await _context.DiscountCodes.FirstOrDefaultAsync(dc => dc.Code == code);
            if (existing != null) return false;

            var discountCode = new DiscountCode
            {
                Code = code,
                Discount = discount,
                CreatedAt = DateTime.UtcNow
            };

            _context.DiscountCodes.Add(discountCode);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDiscountCodeAsync(string code)
        {
            var discountCode = await _context.DiscountCodes.FirstOrDefaultAsync(dc => dc.Code == code);
            if (discountCode == null) return false;

            _context.DiscountCodes.Remove(discountCode);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<DiscountCode>> GetAllDiscountCodesAsync()
        {
            return await _context.DiscountCodes.ToListAsync();
        }

        public async Task<List<Order>> GetAllOrdersAsync()
{
    return await _context.Orders
        .Include(o => o.User)
        .Include(o => o.Items)
            .ThenInclude(i => i.Book)
        .OrderByDescending(o => o.CreatedAt)
        .ToListAsync();
}


          // ✅ Get All Users
        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            return await _context.Users
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    Role = u.Role,
                })
                .ToListAsync();
        }

        // ✅ Create User
        public async Task<bool> CreateUserAsync(CreateUserDto dto)
        {
            if (_context.Users.Any(u => u.Email == dto.Email))
                return false;

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return true;
        }

        // ✅ Update User
        public async Task<bool> UpdateUserAsync(Guid id, UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            user.FullName = dto.FullName;
            user.Email = dto.Email;
            user.Role = dto.Role;

            await _context.SaveChangesAsync();
            return true;
        }

        // ✅ Delete User
        public async Task<bool> DeleteUserAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
  


        // ✅ Add Announcement
        public async Task<bool> AddAnnouncementAsync(string title, string message, DateTime startTime, DateTime? endTime)
        {
            var announcement = new Announcement
            {
                Title = title,
                Message = message,
                StartTime = startTime,
                EndTime = endTime
            };

            _context.Announcements.Add(announcement);
            await _context.SaveChangesAsync();
            return true;
        }

        // ✅ Delete Announcement
        public async Task<bool> DeleteAnnouncementAsync(int id)
        {
            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null) return false;

            _context.Announcements.Remove(announcement);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
