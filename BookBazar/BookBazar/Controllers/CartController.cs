using BookBazzar.DTOs;
using BookBazzar.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookBazzar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Member")]
    public class CartController : ControllerBase
    {
        private readonly CartService _cartService;

        public CartController(CartService cartService)
        {
            _cartService = cartService;
        }

        private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        // GET: api/cart
        [HttpGet]
        public async Task<IActionResult> GetMyCart()
        {
            var userId = GetUserId();
            var cart = await _cartService.GetUserCartAsync(userId);
            return Ok(cart);
        }

        // POST: api/cart
        [HttpPost]
        public async Task<IActionResult> AddToCart(AddToCartDto dto)
        {
            var userId = GetUserId();
            var added = await _cartService.AddToCartAsync(userId, dto);
            if (added == null)
                return BadRequest(new { message = "Invalid book or quantity." });

            return Ok(added);
        }

        // DELETE: api/cart/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var userId = GetUserId();
            var removed = await _cartService.RemoveCartItemAsync(id, userId);
            if (!removed) return NotFound();

            return Ok(new { message = "Item removed from cart." });
        }
    }
}
