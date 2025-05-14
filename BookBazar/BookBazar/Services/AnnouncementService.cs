using BookBazzar.Data;
using BookBazzar.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BookBazzar.Services
{
    public class AnnouncementService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AnnouncementService> _logger;

        public AnnouncementService(AppDbContext context, ILogger<AnnouncementService> logger)
        {
            _context = context;
            _logger = logger;
        }

       public async Task<IEnumerable<Announcement>> GetAllAsync()
{
    return await _context.Announcements
        .OrderByDescending(a => a.CreatedAt)
        .AsNoTracking()
        .ToListAsync();
}

public async Task<IEnumerable<Announcement>> GetActiveAnnouncementsAsync()
{
    var now = DateTime.UtcNow;
    return await _context.Announcements
        .Where(a => a.IsEnabled 
            && a.StartTime <= now 
            && (!a.EndTime.HasValue || a.EndTime > now))
        .OrderByDescending(a => a.CreatedAt)
        .AsNoTracking()
        .ToListAsync();
}

        public async Task<Announcement> GetByIdAsync(int id)
        {
            return await _context.Announcements.FindAsync(id);
        }

        public async Task<Announcement> CreateAsync(Announcement model)
        {
            try
            {
                model.CreatedAt = DateTime.UtcNow;
                _context.Announcements.Add(model);
                await _context.SaveChangesAsync();
                return model;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating announcement: {Message}", ex.Message);
                throw;
            }
        }



        public async Task<bool> UpdateAsync(int id, Announcement model)
        {
            try
            {
                var announcement = await _context.Announcements.FindAsync(id);
                if (announcement == null) return false;

                announcement.Title = model.Title;
                announcement.Message = model.Message;
                announcement.StartTime = model.StartTime;
                announcement.EndTime = model.EndTime;
                announcement.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating announcement {Id}: {Message}", id, ex.Message);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var announcement = await _context.Announcements.FindAsync(id);
                if (announcement == null) return false;

                _context.Announcements.Remove(announcement);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting announcement {Id}: {Message}", id, ex.Message);
                throw;
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Announcements.AnyAsync(a => a.Id == id);
        }
    }
}