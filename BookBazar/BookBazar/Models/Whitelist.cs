using System.ComponentModel.DataAnnotations;

namespace BookBazzar.Models
{
    public class Whitelist
    {
        [Key]
        public int Id { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }

        public int BookId { get; set; }
        public Book Book { get; set; }
    }
}
