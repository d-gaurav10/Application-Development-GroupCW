using System.ComponentModel.DataAnnotations;

namespace BookBazzar.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }

        public decimal TotalAmount { get; set; }
        public decimal DiscountApplied { get; set; }
        public string Status { get; set; } = "Pending";

        public string ClaimCode { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<OrderItem> Items { get; set; }

        
    }
}
