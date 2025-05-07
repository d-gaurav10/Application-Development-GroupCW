using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace BookBazzar.DTOs
{
    public class BookCreateDto
{
    [Required]
    public required string Title { get; set; }

    public string? Author { get; set; } // New field for the author's name

    public string? ISBN { get; set; }

    [Required]
    public required string Format { get; set; }

    public string? Language { get; set; }

    [Required]
    [Range(0, 999999.99)]
    public decimal Price { get; set; }

    public decimal? DiscountPrice { get; set; }

    public bool OnSale { get; set; }

    [Required]
    [Range(0, 10000)]
    public int Stock { get; set; }

    public string? Description { get; set; }

    public IFormFile? CoverImage { get; set; }

    [Required]
    public required string CategoryName { get; set; }

    [Required]
    public required string PublisherName { get; set; }
}
}