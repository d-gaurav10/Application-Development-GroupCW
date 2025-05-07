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

        // GET: api/admin/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetDashboard()
        {
            var summary = await _dashboardService.GetSummaryAsync();
            return Ok(summary);
        }
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers([FromQuery] string? role, [FromQuery] string? search)
        {
            var users = await _dashboardService.SearchUsersAsync(role, search);
            return Ok(users);
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders([FromQuery] string? status, [FromQuery] string? search)
        {
            var orders = await _dashboardService.SearchOrdersAsync(status, search);
            return Ok(orders);
        }

    }
}
