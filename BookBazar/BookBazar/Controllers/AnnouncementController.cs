using BookBazzar.Models;
using BookBazzar.Services;
using BookBazzar.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookBazzar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnnouncementController : ControllerBase
    {
        private readonly AnnouncementService _announcementService;
        private readonly ILogger<AnnouncementController> _logger;

        public AnnouncementController(AnnouncementService announcementService, ILogger<AnnouncementController> logger)
        {
            _announcementService = announcementService;
            _logger = logger;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] AnnouncementDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var announcement = new Announcement
                {
                    Title = model.Title,
                    Message = model.Message,
                    StartTime = model.StartTime,
                    EndTime = model.EndTime,
                };

                var result = await _announcementService.CreateAsync(announcement);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating announcement");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpGet]
public async Task<IActionResult> GetAll()
{
    try
    {
        var announcements = await _announcementService.GetAllAsync();
        return Ok(announcements);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error fetching announcements");
        return StatusCode(500, new { message = "Internal server error", error = ex.Message });
    }
}

[HttpGet("active")]
public async Task<IActionResult> GetActive()
{
    try
    {
        var announcements = await _announcementService.GetActiveAnnouncementsAsync();
        return Ok(announcements);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error fetching active announcements");
        return StatusCode(500, new { message = "Internal server error", error = ex.Message });
    }
}

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