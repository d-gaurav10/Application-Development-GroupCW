using BookBazzar.DTOs;
using BookBazzar.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookBazzar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AdminDashboardService _dashboardService;

        public AdminController(AdminDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        // ✅ Get Enhanced Dashboard Summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            var summary = await _dashboardService.GetEnhancedSummaryAsync();
            return Ok(summary);
        }

         [HttpGet("orders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _dashboardService.GetAllOrdersAsync();
            return Ok(orders);
}

        // ✅ Update Order Status
        [HttpPatch("order/{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromQuery] string status)
        {
            var result = await _dashboardService.UpdateOrderStatus(orderId, status);
            if (!result) return NotFound(new { message = "Order not found or update failed." });

            return Ok(new { message = $"Order status updated to '{status}'." });
        }

        [HttpPost("discount")]
public async Task<IActionResult> AddDiscountCode([FromBody] DiscountCodeDto dto)
{
    if (string.IsNullOrWhiteSpace(dto.Code) || dto.Discount <= 0)
        return BadRequest(new { message = "Invalid discount code or value." });

    var success = await _dashboardService.AddDiscountCodeAsync(dto.Code, dto.Discount);
    if (!success) return Conflict(new { message = "Discount code already exists." });

    return Ok(new { message = "Discount code added successfully." });
}

[HttpDelete("discount/{code}")]
public async Task<IActionResult> DeleteDiscountCode(string code)
{
    var result = await _dashboardService.DeleteDiscountCodeAsync(code);
    if (!result) return NotFound(new { message = "Discount code not found." });

    return Ok(new { message = "Discount code deleted successfully." });
}

[HttpGet("discounts")]
public async Task<IActionResult> GetAllDiscountCodes()
{
    var discounts = await _dashboardService.GetAllDiscountCodesAsync();
    return Ok(discounts);
}


[HttpGet("users")]
public async Task<IActionResult> GetAllUsers()
{
    var users = await _dashboardService.GetAllUsersAsync();
    return Ok(users);
}

[HttpPost("users")]
public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
{
    var result = await _dashboardService.CreateUserAsync(dto);
    if (!result) return Conflict(new { message = "User with the same email already exists." });

    return Ok(new { message = "User created successfully." });
}

[HttpPut("users/{id}")]
public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserDto dto)
{
    var result = await _dashboardService.UpdateUserAsync(id, dto);
    if (!result) return NotFound(new { message = "User not found." });

    return Ok(new { message = "User updated successfully." });
}

[HttpDelete("users/{id}")]
public async Task<IActionResult> DeleteUser(Guid id)
{
    var result = await _dashboardService.DeleteUserAsync(id);
    if (!result) return NotFound(new { message = "User not found." });

    return Ok(new { message = "User deleted successfully." });
}



        // ✅ Add Announcement
        [HttpPost("announcement")]
        public async Task<IActionResult> AddAnnouncement([FromBody] AnnouncementDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Message))
                return BadRequest(new { message = "Title and message are required." });

            var success = await _dashboardService.AddAnnouncementAsync(dto.Title, dto.Message, dto.StartTime, dto.EndTime);
            if (!success) return StatusCode(500, new { message = "Failed to add announcement." });

            return Ok(new { message = "Announcement added successfully." });
        }

        // ✅ Delete Announcement
        [HttpDelete("announcement/{id}")]
        public async Task<IActionResult> DeleteAnnouncement(int id)
        {
            var success = await _dashboardService.DeleteAnnouncementAsync(id);
            if (!success) return NotFound(new { message = "Announcement not found." });

            return Ok(new { message = "Announcement deleted successfully." });
        }
    }
}
