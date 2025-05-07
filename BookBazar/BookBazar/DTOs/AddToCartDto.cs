namespace BookBazzar.DTOs
{
    public class AddToCartDto
    {
        public int BookId { get; set; }
        public int Quantity { get; set; } = 1;
    }
}
