using BookBazzar.DTOs;
using BookBazzar.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookBazzar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Staff")]
    public class FulfillmentController : ControllerBase
    {
        private readonly FulfillmentService _fulfillmentService;

        public FulfillmentController(FulfillmentService fulfillmentService)
        {
            _fulfillmentService = fulfillmentService;
        }

        // GET: api/fulfillment/search?code=ABC123
        [HttpGet("search")]
        public async Task<IActionResult> SearchByClaimCode([FromQuery] string code)
        {
            var order = await _fulfillmentService.FindOrderByClaimCodeAsync(code);
            if (order == null) return NotFound(new { message = "Order not found or already fulfilled." });

            return Ok(order);
        }

        

        // POST: api/fulfillment/complete
        [HttpPost("complete")]
        public async Task<IActionResult> FulfillOrder([FromBody] FulfillOrderDto dto)
        {
            var result = await _fulfillmentService.FulfillOrderAsync(dto);
            if (!result) return BadRequest(new { message = "Invalid claim code or order already completed." });

            return Ok(new { message = "Order marked as completed." });
        }
    }
}
