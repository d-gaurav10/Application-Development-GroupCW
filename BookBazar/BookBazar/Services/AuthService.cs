using BookBazzar.Data;
using BookBazzar.DTOs;
using BookBazzar.Models;
using BookBazzar.Enums;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BookBazzar.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }
       public async Task<string> Register(UserRegisterDTO dto)
{
    // Check if the email already exists
    if (_context.Users.Any(u => u.Email == dto.Email))
        return "User already exists";

    // Validate the role
    if (!Enum.TryParse<UserRole>(dto.Role, true, out var role))
    {
        return "Invalid role specified";
    }

    // Create the user
    var user = new User
    {
        FullName = dto.FullName,
        Email = dto.Email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
        Role = role.ToString() // Assign the validated role
    };

    Console.WriteLine($"Registering user with role: {user.Role}"); // Debug log

    _context.Users.Add(user);
    await _context.SaveChangesAsync();
    return "User registered successfully";
}

        public object Login(UserLoginDTO dto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return new { message = "Invalid email or password" };

            var token = GenerateJwtToken(user);

            return new
            {
                token,
                userDetails = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.Role
                }
            };
        }
                

        private string GenerateJwtToken(User user)
{
    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role),

        // Ensure uniqueness per token
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

        // Issued at time
        new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _config["Jwt:Issuer"],
        audience: _config["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddDays(1),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}

    }
}
