using BookBazzar.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookBazzar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Member")]
    public class WhitelistController : ControllerBase
    {
        private readonly WhitelistService _whitelistService;

        public WhitelistController(WhitelistService whitelistService)
        {
            _whitelistService = whitelistService;
        }

        private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        // GET: api/whitelist
        [HttpGet]
        public async Task<IActionResult> GetMyWhitelist()
        {
            var list = await _whitelistService.GetUserWhitelistAsync(GetUserId());
            return Ok(list);
        }

        // POST: api/whitelist?bookId=5
        [HttpPost]
        public async Task<IActionResult> AddToWhitelist([FromQuery] int bookId)
        {
            var result = await _whitelistService.AddToWhitelistAsync(GetUserId(), bookId);
            if (!result)
                return BadRequest(new { message = "Book already in whitelist." });

            return Ok(new { message = "Book added to whitelist." });
        }

        // DELETE: api/whitelist/5
        [HttpDelete("{bookId}")]
        public async Task<IActionResult> RemoveFromWhitelist(int bookId)
        {
            var result = await _whitelistService.RemoveFromWhitelistAsync(GetUserId(), bookId);
            if (!result)
                return NotFound(new { message = "Book not found in your whitelist." });

            return Ok(new { message = "Book removed from whitelist." });
        }
    }
}
