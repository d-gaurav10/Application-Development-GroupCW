using System;
using System.ComponentModel.DataAnnotations;

namespace BookBazzar.DTOs
{
    public class FulfillOrderDto
    {
        [Required]
        public string ClaimCode { get; set; } = null!;

        [Required]
        public Guid UserId { get; set; }
    }
}