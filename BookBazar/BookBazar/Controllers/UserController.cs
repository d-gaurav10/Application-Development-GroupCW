using BookBazzar.Data;
using BookBazzar.DTOs;
using BookBazzar.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookBazzar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Get all users (Admin only)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        // ✅ Get user by ID (Admin or Self)
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && currentUserId != id.ToString())
                return Forbid();

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            return Ok(new {
                user.Id,
                user.FullName,
                user.Email,
                user.Role
            });
        }


        // ✅ Get own profile (for profile settings)
    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetOwnProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var user = await _context.Users.FindAsync(Guid.Parse(userId));
        if (user == null) return NotFound();

        return Ok(new {
            fullName = user.FullName,
            email = user.Email
        });
    }

        // ✅ Update own profile
       [HttpPut("profile")]
[Authorize]
public async Task<IActionResult> UpdateOwnProfile([FromBody] UpdateProfileDto dto)
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId == null) return Unauthorized();

    var user = await _context.Users.FindAsync(Guid.Parse(userId));
    if (user == null) return NotFound();

    // Update name/email
    user.FullName = dto.FullName;


    // Verify current password if changing
    if (!string.IsNullOrWhiteSpace(dto.NewPassword))
    {
        // you may want to check dto.CurrentPassword matches the hash before allowing change
        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
            return BadRequest(new { message = "Current password is incorrect" });

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
    }

    await _context.SaveChangesAsync();
    return Ok(new { message = "Profile updated successfully" });
}

        // ✅ Change user role (Admin only)
        [HttpPatch("{id}/role")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUserRole(Guid id, [FromQuery] string role)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.Role = role;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User role updated to {role}" });
        }

        // ✅ Delete user (Admin only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully" });
        }
    }
}
