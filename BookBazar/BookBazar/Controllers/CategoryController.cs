using BookBazzar.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookBazzar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoryController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/category
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(categories);
        }

        // GET: api/category/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();

            return Ok(category);
        }
    }
}
