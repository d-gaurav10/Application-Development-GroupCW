using BookBazzar.Data;
using BookBazzar.DTOs;
using BookBazzar.Models;
using Microsoft.EntityFrameworkCore;

namespace BookBazzar.Services
{
    public class BookService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public BookService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<Book> CreateBookAsync(BookCreateDto dto)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Name.ToLower() == dto.CategoryName.ToLower())
                ?? new Category { Name = dto.CategoryName };

            if (category.Id == 0)
            {
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
            }

            var publisher = await _context.Publishers
                .FirstOrDefaultAsync(p => p.Name.ToLower() == dto.PublisherName.ToLower())
                ?? new Publisher { Name = dto.PublisherName };

            if (publisher.Id == 0)
            {
                _context.Publishers.Add(publisher);
                await _context.SaveChangesAsync();
            }

            var book = new Book
            {
                Title = dto.Title,
                Author = dto.Author,
                ISBN = dto.ISBN,
                Format = dto.Format,
                Language = dto.Language,
                Price = dto.Price,
                DiscountPrice = dto.DiscountPrice,
                OnSale = dto.OnSale,
                Stock = dto.Stock,
                Description = dto.Description,
                CategoryId = category.Id,
                PublisherId = publisher.Id
            };

            if (dto.CoverImage != null)
            {
                var uploadPath = _config["FileStorage:ImageUploadPath"]
                    ?? throw new InvalidOperationException("Image upload path not configured");

                Directory.CreateDirectory(uploadPath);
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.CoverImage.FileName)}";
                var filePath = Path.Combine(uploadPath, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await dto.CoverImage.CopyToAsync(stream);

                book.CoverImage = fileName;
            }

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return book;
        }

        public async Task<Book?> GetBookByIdAsync(int id)
        {
            return await _context.Books
                .Include(b => b.Category)
                .Include(b => b.Publisher)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<IEnumerable<Book>> GetAllBooksAsync()
        {
            return await _context.Books
                .Include(b => b.Category)
                .Include(b => b.Publisher)
                .ToListAsync();
        }

        public async Task<bool> UpdateBookAsync(int id, BookCreateDto dto)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return false;

            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Name.ToLower() == dto.CategoryName.ToLower()) 
                ?? new Category { Name = dto.CategoryName };

            var publisher = await _context.Publishers
                .FirstOrDefaultAsync(p => p.Name.ToLower() == dto.PublisherName.ToLower()) 
                ?? new Publisher { Name = dto.PublisherName };

            book.CategoryId = category?.Id ?? 0;
            book.PublisherId = publisher?.Id ?? 0;

            if (dto.CoverImage != null)
            {
                var uploadPath = _config["FileStorage:ImageUploadPath"] 
                    ?? throw new InvalidOperationException("Image upload path not configured.");

                Directory.CreateDirectory(uploadPath);
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.CoverImage.FileName)}";
                var filePath = Path.Combine(uploadPath, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await dto.CoverImage.CopyToAsync(stream);

                book.CoverImage = fileName;
            }


            book.Title = dto.Title;
            book.Author = dto.Author;
            book.ISBN = dto.ISBN;
            book.Format = dto.Format;
            book.Language = dto.Language;
            book.Price = dto.Price;
            book.DiscountPrice = dto.DiscountPrice;
            book.OnSale = dto.OnSale;
            book.Stock = dto.Stock;
            book.Description = dto.Description;
            book.CategoryId = category.Id;
            book.PublisherId = publisher.Id;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Book>> SearchBooksAsync(string query)
{
        return await _context.Books
            .Include(b => b.Category)
            .Include(b => b.Publisher)
            .Where(b => b.Title.Contains(query) || b.Author.Contains(query)) // Search by title or author
            .ToListAsync();
}

        public async Task<bool> DeleteBookAsync(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return false;

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
