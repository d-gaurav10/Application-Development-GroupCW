using BookBazzar.Models;

namespace BookBazzar.Services
{
    public interface IEmailService
    {
        Task SendOrderConfirmationAsync(Order order);
    }
}