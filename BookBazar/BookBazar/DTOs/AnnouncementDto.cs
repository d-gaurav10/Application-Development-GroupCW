using System.ComponentModel.DataAnnotations;

namespace BookBazzar.DTOs
{
    public class AnnouncementDto
    {
        [Required]
        public string Title { get; set; }
        
        [Required]
        public string Message { get; set; }
        
        [Required]
        public DateTime StartTime { get; set; }
        
        public DateTime? EndTime { get; set; }
    }
}