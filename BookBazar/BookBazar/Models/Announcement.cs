using System.ComponentModel.DataAnnotations;

namespace BookBazzar.Models
{
    public class Announcement
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        [Required]
        [StringLength(1000)]
        public string Message { get; set; }

        [Required]
        public DateTime StartTime { get; set; } = DateTime.UtcNow;

        public DateTime? EndTime { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        [Required]
        public bool IsEnabled { get; set; } = true;

        public bool IsActive => IsEnabled && (!EndTime.HasValue || EndTime > DateTime.UtcNow);
    }
}