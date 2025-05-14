using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using BookBazzar.Services;
using BookBazzar.DTOs;
using BookBazzar.Hubs;
using BookBazzar.Models;

namespace BookBazzar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Staff")]
    public class StaffController : ControllerBase
    {
        private readonly OrderService _orderService;
        private readonly IHubContext<OrderHub> _hubContext;

        public StaffController(OrderService orderService, IHubContext<OrderHub> hubContext)
        {
            _orderService = orderService;
            _hubContext = hubContext;
        }

        // GET: api/staff/search?code=ABC123
        [HttpGet("search")]
        public async Task<IActionResult> SearchByClaimCode([FromQuery] string code)
        {
            var order = await _orderService.FindOrderByClaimCodeAsync(code);
            if (order == null) 
                return NotFound(new { message = "Order not found or already fulfilled." });

            return Ok(order);
        }

        // GET: api/staff/pending-orders
        [HttpGet("pending-orders")]
        public async Task<IActionResult> GetPendingOrders()
        {
            var orders = await _orderService.GetPendingOrdersAsync();
            return Ok(orders);
        }

        // POST: api/staff/fulfill-order
        [HttpPost("fulfill-order")]
        public async Task<IActionResult> FulfillOrder([FromBody] FulfillOrderDto dto)
        {
            try
            {
                var order = await _orderService.FulfillOrderAsync(dto);
                if (order == null)
                    return BadRequest(new { message = "Invalid claim code or user ID" });

                // Notify admin dashboard
                await _hubContext.Clients.Group("Admins")
                    .SendAsync("OrderCompleted", new { 
                        OrderId = order.Id,
                        CompletedAt = DateTime.UtcNow
                    });

                return Ok(new { message = "Order fulfilled successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}