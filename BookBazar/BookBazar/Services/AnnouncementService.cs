using BookBazzar.Data;
using BookBazzar.Models;
using Microsoft.EntityFrameworkCore;

namespace BookBazzar.Services
{
    public class AnnouncementService
    {
        private readonly AppDbContext _context;

        public AnnouncementService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Announcement>> GetActiveAnnouncementsAsync()
        {
            return await _context.Announcements
                .Where(a => !a.EndTime.HasValue || a.EndTime > DateTime.UtcNow)
                .OrderByDescending(a => a.StartTime)
                .ToListAsync();
        }

        public async Task<Announcement> CreateAsync(Announcement model)
        {
            _context.Announcements.Add(model);
            await _context.SaveChangesAsync();
            return model;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var ann = await _context.Announcements.FindAsync(id);
            if (ann == null) return false;

            _context.Announcements.Remove(ann);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
