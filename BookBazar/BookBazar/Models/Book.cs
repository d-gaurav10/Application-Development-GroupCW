using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookBazzar.Models
{
    public class Book
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string Title { get; set; }
    
    [Required]
    public string ISBN { get; set; }
    
    [Required]
    public string Author { get; set; }
    
    [Required]
    public string Format { get; set; }
    
    public string Language { get; set; }
    
    [Required]
    public decimal Price { get; set; }
    
    public decimal? DiscountPrice { get; set; }
    public DateTime? DiscountStart { get; set; }
    public DateTime? DiscountEnd { get; set; }
    public bool OnSale { get; set; }
    
    [Required]
    public int Stock { get; set; }
    
    public string Description { get; set; }
    public string CoverImage { get; set; }
    public DateTime PublicationDate { get; set; }
    
    public int CategoryId { get; set; }
    public Category Category { get; set; }
    
    public int PublisherId { get; set; }
    public Publisher Publisher { get; set; }
    
    public ICollection<Review> Reviews { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; }
}
}