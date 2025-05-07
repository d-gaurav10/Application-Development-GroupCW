using BookBazzar.DTOs;
using BookBazzar.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookBazzar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Member")]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrderController(OrderService orderService)
        {
            _orderService = orderService;
        }

        private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        // ✅ POST: api/order/place
        [HttpPost("place")]
        public async Task<IActionResult> PlaceOrder([FromBody] ClaimCodeSearchDto claimCodeDto)
        {
            var userId = GetUserId();
            try
            {
                var order = await _orderService.PlaceOrderAsync(userId, claimCodeDto?.ClaimCode);
                if (order == null) return BadRequest(new { message = "Cart is empty." });

                return Ok(order);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ GET: api/order
        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            var orders = await _orderService.GetUserOrdersAsync(GetUserId());
            return Ok(orders);
        }

        // ✅ GET: api/order/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id, GetUserId());
            if (order == null) return NotFound();

            return Ok(order);
        }
    }
}
