using BookBazzar.DTOs;
using BookBazzar.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookBazzar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookController : ControllerBase
    {
        private readonly BookService _bookService;

        public BookController(BookService bookService)
        {
            _bookService = bookService;
        }

        // ✅ CREATE: POST /api/book
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateBook([FromForm] BookCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var book = await _bookService.CreateBookAsync(dto);
                return CreatedAtAction(nameof(GetBookById), new { id = book.Id }, book);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // ✅ READ SINGLE: GET /api/book/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBookById(int id)
        {
            var book = await _bookService.GetBookByIdAsync(id);
            if (book == null)
                return NotFound();

            return Ok(book);
        }

        // ✅ READ ALL: GET /api/book
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await _bookService.GetAllBooksAsync();
            return Ok(books);
        }

        // ✅ UPDATE: PUT /api/book/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateBook(int id, [FromForm] BookCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var success = await _bookService.UpdateBookAsync(id, dto);
                if (!success) return NotFound();

                return Ok(new { message = "Book updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // ✅ DELETE: DELETE /api/book/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            try
            {
                var deleted = await _bookService.DeleteBookAsync(id);
                if (!deleted) return NotFound();

                return Ok(new { message = "Book deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchBooks([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest(new { message = "Query parameter is required." });

            var books = await _bookService.SearchBooksAsync(query);
            return Ok(books);
}

    }
}
