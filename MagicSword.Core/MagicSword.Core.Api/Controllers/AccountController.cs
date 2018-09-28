using System;
using System.Linq;
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
        private readonly SignInManager<User> _signInManager;
        private readonly ILogger _logger;

        public AccountController(SignInManager<User> signInManager, ILogger<AccountController> logger)
        {
            _signInManager = signInManager;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody]LoginRequest loginRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var email = loginRequest.Email;
            var password = loginRequest.Password;

            var user = await _signInManager.UserManager.FindByEmailAsync(email);
            if (user == null)
            {
                return Json(new LoginResponse
                {
                    Success = false,
                    Error = "login_unknown_user_password",
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
                    Error = result.IsLockedOut ? "login_account_locked" : "login_unknown_user_password",
                });
            }
        }

        public async Task<IActionResult> Register([FromBody]RegisterRequest registerRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var email = registerRequest.Email;
            var password = registerRequest.Password;
            var nickname = registerRequest.Nickname;

            var user = new User
            {
                UserName = email,
                Email = email,
                Nickname = nickname,
            };

            var result = await _signInManager.UserManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                //var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                //var callbackUrl = Url.Page(
                //    "/Account/ConfirmEmail",
                //    pageHandler: null,
                //    values: new { userId = user.Id, code = code },
                //    protocol: Request.Scheme);

                //await _emailSender.SendEmailAsync(Input.Email, "Confirm your email",
                //    $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");

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
                    Error = string.Join("<br/>", result.Errors.Select(e => e.Description)),
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
            return Json(new { userId = CallingUserId });
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
