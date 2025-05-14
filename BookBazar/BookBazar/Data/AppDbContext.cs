using Microsoft.EntityFrameworkCore;
using BookBazzar.Models;

namespace BookBazzar.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<User> Users { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Publisher> Publishers { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Whitelist> Whitelists { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<DiscountCode> DiscountCodes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relationships
            modelBuilder.Entity<Book>()
                .HasOne(b => b.Category)
                .WithMany(c => c.Books)
                .HasForeignKey(b => b.CategoryId);

            modelBuilder.Entity<Book>()
                .HasOne(b => b.Publisher)
                .WithMany(p => p.Books)
                .HasForeignKey(b => b.PublisherId);

            modelBuilder.Entity<Whitelist>()
                .HasIndex(w => new { w.UserId, w.BookId })
                .IsUnique();

            modelBuilder.Entity<CartItem>()
                .HasOne(c => c.Book)
                .WithMany()
                .HasForeignKey(c => c.BookId);

            modelBuilder.Entity<CartItem>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId);

            // Seed Categories
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Fiction" },
                new Category { Id = 2, Name = "Non-Fiction" },
                new Category { Id = 3, Name = "Self-Help" },
                new Category { Id = 4, Name = "Science" },
                new Category { Id = 5, Name = "History" },
                new Category { Id = 6, Name = "Technology" },
                new Category { Id = 7, Name = "Biography" },
                new Category { Id = 8, Name = "Children" }
            );

            // Seed Publishers
            modelBuilder.Entity<Publisher>().HasData(
                new Publisher { Id = 1, Name = "Penguin Random House" },
                new Publisher { Id = 2, Name = "HarperCollins" },
                new Publisher { Id = 3, Name = "Simon & Schuster" },
                new Publisher { Id = 4, Name = "Macmillan Publishers" },
                new Publisher { Id = 5, Name = "Hachette Book Group" }
            );
        }
    }
}
