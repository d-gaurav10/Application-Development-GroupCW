using System.Net.Mail;
using BookBazzar.Models;
using Microsoft.Extensions.Configuration;

namespace BookBazzar.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendOrderConfirmationAsync(Order order)
        {
            try
            {
                var smtpSettings = _configuration.GetSection("SmtpSettings");
                
                using var client = new SmtpClient(smtpSettings["Host"])
                {
                    Port = int.Parse(smtpSettings["Port"]),
                    Credentials = new System.Net.NetworkCredential(
                        smtpSettings["Username"], 
                        smtpSettings["Password"]
                    ),
                    EnableSsl = true
                };

                var message = new MailMessage
                {
                    From = new MailAddress(smtpSettings["From"]),
                    Subject = $"Order Confirmation - #{order.Id}",
                    Body = CreateEmailBody(order),
                    IsBodyHtml = true
                };

                message.To.Add(order.User.Email);
                await client.SendMailAsync(message);
            }
            catch (Exception ex)
            {
                // Log the error but don't throw to prevent order placement failure
                Console.WriteLine($"Failed to send email: {ex.Message}");
            }
        }

        private string CreateEmailBody(Order order)
        {
            return $@"
                <html>
                    <body>
                        <h2>Thank you for your order!</h2>
                        
                        <h3>Order Details:</h3>
                        <p>Order ID: {order.Id}</p>
                        <p>Claim Code: <strong>{order.ClaimCode}</strong></p>
                        <p>Total Amount: ${order.TotalAmount:F2}</p>
                        
                        <p>Please keep your claim code safe as you'll need it to collect your order.</p>
                        
                        <p>Best regards,<br>BookBazzar Team</p>
                    </body>
                </html>";
        }
    }
}