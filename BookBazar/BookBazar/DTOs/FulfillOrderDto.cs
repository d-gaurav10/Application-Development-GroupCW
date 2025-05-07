using System;

namespace BookBazzar.DTOs
{
    public class FulfillOrderDto
    {
        public string ClaimCode { get; set; }
        public Guid UserId { get; set; }
    }
}
