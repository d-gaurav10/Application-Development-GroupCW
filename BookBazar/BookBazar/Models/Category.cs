using System.ComponentModel.DataAnnotations;

namespace BookBazzar.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public ICollection<Book> Books { get; set; }
    }
}
