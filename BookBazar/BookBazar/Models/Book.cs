using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookBazzar.Models
{
    public class Book
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string Author { get; set; } // New field for the author's name

        public string ISBN { get; set; }

        [Required]
        public string Format { get; set; }

        public string Language { get; set; }

        [Required]
        public decimal Price { get; set; }

        public decimal? DiscountPrice { get; set; }

        public bool OnSale { get; set; }

        public int Stock { get; set; }

        public string Description { get; set; }

        public string CoverImage { get; set; } // Field for image filename/path

        // Foreign Keys
        [ForeignKey("Category")]
        public int CategoryId { get; set; }

        [ForeignKey("Publisher")]
        public int PublisherId { get; set; }

        // Navigation Properties
        public Category Category { get; set; }
        public Publisher Publisher { get; set; }
    }
}