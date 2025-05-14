using BookBazzar.DTOs;
using BookBazzar.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookBazzar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }
            [HttpPost("register")]
            public async Task<IActionResult> Register(UserRegisterDTO dto)
            {
                Console.WriteLine($"Received registration request for role: {dto.Role}");
                var result = await _authService.Register(dto);
                return Ok(new { message = result });
            }

        [HttpPost("login")]
        public IActionResult Login(UserLoginDTO dto)
        {
            var result = _authService.Login(dto);
            if (result == null)
                return Unauthorized(new { message = "Invalid credentials" });

            // ✅ Return the object your service already built:
            //      { token: "<jwt-string>", userDetails: { ... } }
            return Ok(result);
        }

    }
}
