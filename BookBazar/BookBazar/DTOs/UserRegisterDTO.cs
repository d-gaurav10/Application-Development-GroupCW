using System.ComponentModel.DataAnnotations;

namespace BookBazzar.DTOs
{
    public class UserRegisterDTO
    {
        [Required]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        [RegularExpression("^(Admin|Staff|Member)$", ErrorMessage = "Role must be Admin, Staff, or Member")]
        public string Role { get; set; }
    }
}