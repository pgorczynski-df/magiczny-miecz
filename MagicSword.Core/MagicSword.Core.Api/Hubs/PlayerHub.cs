using System;
using System.Threading.Tasks;
using MagicSword.Core.Api.Controllers;
using MagicSword.Core.Api.Model;
using MagicSword.Core.Api.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace MagicSword.Core.Api.Hubs
{
    public class PlayerHub : Hub
    {
        private readonly SignInManager<Player> _signInManager;
        private readonly ILogger _logger;

        public PlayerHub(SignInManager<Player> signInManager, ILogger<AccountController> logger)
        {
            _signInManager = signInManager;
            _logger = logger;
        }

        public async Task Token(string email, string password)
        {
            if (String.IsNullOrEmpty(email))
            {
                throw new ArgumentException("email cannot be empty", nameof(email));
            }
            if (String.IsNullOrEmpty(password))
            {
                throw new ArgumentException("password cannot be empty", nameof(password));
            }

            var user = await _signInManager.UserManager.FindByEmailAsync(email);
            if (user == null)
            {
                await Clients.Caller.SendAsync("TokenResponse", new LoginResponse
                {
                    Success = false,
                    Error = "Nieznany użytkownik",
                });
                return;
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, password, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                var token = await _signInManager.GetJwtToken(user);
                await Clients.Caller.SendAsync("TokenResponse", new LoginResponse
                {
                    Success = true,
                    Token = token,
                });
                return;
            }
            else
            {
                await Clients.Caller.SendAsync("TokenResponse", new LoginResponse
                {
                    Success = false,
                    Error = result.IsLockedOut ? "User is locked out" : "Login failed",
                });
            }
        }
    }
}
