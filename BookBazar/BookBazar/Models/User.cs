using System.ComponentModel.DataAnnotations;

namespace BookBazzar.Models
{
    public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string Email { get; set; }

    [Required]
    public string PasswordHash { get; set; }

    [Required]
    public string FullName { get; set; }

    [Required]
    public string Role { get; set; } // No default value
}
}