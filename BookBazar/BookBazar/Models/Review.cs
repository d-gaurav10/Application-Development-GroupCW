using System.ComponentModel.DataAnnotations;

namespace BookBazzar.Models
{
    public class Review
    {
        [Key]
        public int Id { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }

        public int BookId { get; set; }
        public Book Book { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
