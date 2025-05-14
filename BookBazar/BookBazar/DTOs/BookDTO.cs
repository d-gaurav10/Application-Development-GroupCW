using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace BookBazzar.DTOs
{
   public class BookCreateDto
{
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
    [Range(0, 999999.99)]
    public decimal Price { get; set; }
    
    [Range(0, 999999.99)]
    public decimal? DiscountPrice { get; set; }
    
    public DateTime? DiscountStart { get; set; }
    public DateTime? DiscountEnd { get; set; }
    
    public bool OnSale { get; set; }
    
    [Required]
    [Range(0, 10000)]
    public int Stock { get; set; }
    
    public string Description { get; set; }
    public IFormFile CoverImage { get; set; }
    public DateTime PublicationDate { get; set; }
    
    [Required]
    public string CategoryName { get; set; }
    
    [Required]
    public string PublisherName { get; set; }
}
}