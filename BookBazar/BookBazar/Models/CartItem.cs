using System.ComponentModel.DataAnnotations;

namespace BookBazzar.Models
{
    public class CartItem
    {
        [Key]
        public int Id { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }

        public int BookId { get; set; }
        public Book Book { get; set; }

        public int Quantity { get; set; } = 1;
    }
}
