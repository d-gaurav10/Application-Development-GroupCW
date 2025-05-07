using System.ComponentModel.DataAnnotations;

namespace BookBazzar.Models
{
    public class Announcement
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string Message { get; set; }

        public DateTime StartTime { get; set; } = DateTime.UtcNow;
        public DateTime? EndTime { get; set; } // Optional

        public bool IsActive => !EndTime.HasValue || EndTime > DateTime.UtcNow;
    }
}
