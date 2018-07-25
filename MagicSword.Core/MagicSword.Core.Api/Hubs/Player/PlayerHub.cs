using System;
using System.Linq;
using System.Threading.Tasks;
using MagicSword.Core.Api.Controllers;
using MagicSword.Core.Api.Hubs.Game;
using MagicSword.Core.Api.Model;
using MagicSword.Core.Api.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace MagicSword.Core.Api.Hubs
{
    public class PlayerHub : Hub
    {
        private readonly SignInManager<Player> _signInManager;
        private readonly MagicSwordCoreApiContext _context;
        private readonly ILogger _logger;

        public PlayerHub(SignInManager<Player> signInManager, MagicSwordCoreApiContext context, ILogger<AccountController> logger)
        {
            _signInManager = signInManager;
            _context = context;
            _logger = logger;
        }

        [Authorize]
        public async Task GetMyGamesRequest()
        {
            var id = CallingUserId;
            var games = await _context.Games.Where(g => g.Participants.Any(p => p.PlayerId == id)).ToListAsync();
            var dtos = games.Select(g => CreateListDto(g, id));

            await RespondCaller(nameof(GetMyGamesRequest), dtos);
        }

        [Authorize]
        public async Task CreateGameRequest()
        {
            var user = Context.User.Identity.Name;
            var player = await _context.Users.FirstOrDefaultAsync(u => u.Email == user);

            var game = new Model.Game
            {
                OwnerId = player.Id
            };
            game.Participants.Add(new GamePlayer{ Game = game, Player = player});

            _context.Games.Add(game);
            await _context.SaveChangesAsync();

            var gameDto = CreateListDto(game, CallingUserId);

            await RespondCaller(nameof(CreateGameRequest), gameDto);
        }

        private async Task RespondCaller(string requestMethodName, object arg)
        {
            await Clients.Caller.SendAsync(requestMethodName.Replace("Request", "Response"), arg);
        }

        private GameListDto CreateListDto(Model.Game game, int callerId)
        {
            return new GameListDto
            {
                Id = game.Id,
                IsOwner = game.OwnerId == callerId,
            };
        }

        public async Task TokenRequest(string email, string password)
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
                await RespondCaller(nameof(TokenRequest), new LoginResponse
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
                await RespondCaller(nameof(TokenRequest), new LoginResponse
                {
                    Success = true,
                    Token = token,
                });
                return;
            }
            else
            {
                await RespondCaller(nameof(TokenRequest), new LoginResponse
                {
                    Success = false,
                    Error = result.IsLockedOut ? "User is locked out" : "Login failed",
                });
            }
        }

        private int CallingUserId
        {
            get
            {
                var id = int.Parse(_signInManager.UserManager.GetUserId(Context.User));
                return id;
            }
        }


    }
}
