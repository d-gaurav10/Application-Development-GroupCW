using BookBazzar.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookBazzar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PublisherController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PublisherController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/publisher
        [HttpGet]
        public async Task<IActionResult> GetAllPublishers()
        {
            var publishers = await _context.Publishers.ToListAsync();
            return Ok(publishers);
        }

        // GET: api/publisher/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPublisherById(int id)
        {
            var publisher = await _context.Publishers.FindAsync(id);
            if (publisher == null) return NotFound();

            return Ok(publisher);
        }
    }
}
