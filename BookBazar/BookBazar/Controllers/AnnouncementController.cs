using BookBazzar.Models;
using BookBazzar.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookBazzar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnnouncementController : ControllerBase
    {
        private readonly AnnouncementService _announcementService;

        public AnnouncementController(AnnouncementService announcementService)
        {
            _announcementService = announcementService;
        }

        // GET: api/announcement
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetActive()
        {
            var announcements = await _announcementService.GetActiveAnnouncementsAsync();
            return Ok(announcements);
        }

        // POST: api/announcement
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] Announcement model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _announcementService.CreateAsync(model);
            return Ok(created);
        }

        // DELETE: api/announcement/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _announcementService.DeleteAsync(id);
            if (!result) return NotFound();

            return Ok(new { message = "Announcement deleted." });
        }
    }
}
