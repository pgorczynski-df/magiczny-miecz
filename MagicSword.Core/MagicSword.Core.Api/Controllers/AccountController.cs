using System;
using System.Threading.Tasks;
using MagicSword.Core.Api.Dto;
using MagicSword.Core.Api.Model;
using MagicSword.Core.Api.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MagicSword.Core.Api.Controllers
{
    [Route("[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly SignInManager<Player> _signInManager;
        private readonly ILogger _logger;

        public AccountController(SignInManager<Player> signInManager, ILogger<AccountController> logger)
        {
            _signInManager = signInManager;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Login(string email, string password)
        {
            if (String.IsNullOrEmpty(email))
            {
                return BadRequest("email cannot be empty");
            }
            if (String.IsNullOrEmpty(password))
            {
                return BadRequest("password cannot be empty");
            }

            var user = await _signInManager.UserManager.FindByEmailAsync(email);
            if (user == null)
            {
                return Json(new LoginResponse
                {
                    Success = false,
                    Error = "Nieznany użytkownik",
                });
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, password, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                var token = await _signInManager.GetJwtToken(user);
                return Json(new LoginResponse
                {
                    Success = true,
                    Token = token,
                });
            }
            else
            {
                return Json(new LoginResponse
                {
                    Success = false,
                    Error = result.IsLockedOut ? "User is locked out" : "Login failed",
                });
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            _logger.LogInformation("User logged out.");
            return RedirectToPage("/Index");
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> ValidateToken()
        {
            return Json(new {userId = CallingUserId});
        }

        private int CallingUserId
        {
            get
            {
                var id = int.Parse(_signInManager.UserManager.GetUserId(User));
                return id;
            }
        }
    }
}
