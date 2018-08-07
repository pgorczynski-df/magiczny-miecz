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
        public async Task GetOpenGamesRequest()
        {
            var userId = CallingUserId;
            var games = await _context.Games.Where(g => g.Participants.Any(p => p.PlayerId != userId)).ToListAsync();
            var dtos = games.Select(g => CreateListDto(g, userId));

            await RespondCaller(nameof(GetOpenGamesRequest), dtos);
        }

        [Authorize]
        public async Task GetMyGamesRequest()
        {
            var userId = CallingUserId;
            var games = await _context.Games.Where(g => g.Participants.Any(p => p.PlayerId == userId)).ToListAsync();
            var dtos = games.Select(g => CreateListDto(g, userId));

            await RespondCaller(nameof(GetMyGamesRequest), dtos);
        }

        [Authorize]
        public async Task JoinGameRequest(int gameId)
        {
            var userId = CallingUserId;
            var game = await GetGame(gameId);

            if (game.Participants.All(p => p.PlayerId != userId))
            {
                game.Participants.Add(new GamePlayer{ GameId = gameId, PlayerId = userId});
                await _context.SaveChangesAsync();
            }

            var group = GetGameGroup(gameId);
            await Groups.AddToGroupAsync(Context.ConnectionId, group);

            await Clients.Group(group).SendAsync("NewEvent", new Event
            {
                GameId = game.Id,
                EventType = EventType.PlayerJoined,
                Data = new {id = userId, name = Context.User.Identity.Name}
            });

            await RespondCaller(nameof(JoinGameRequest), new {});
        }
        
        [Authorize]
        public async Task Publish(Event ev)
        {
            //switch (@event.Type)
            //{

            //}
            var game = await GetGame(ev.GameId);
            var playerId = CallingUserId;
            if (!game.IsParticipant(playerId))
            {
                throw new ArgumentException("Player id = " + playerId + " is not participant of game id = " + game.Id);
            }

            ev.SourcePlayerId = playerId;

            var group = GetGameGroup(ev.GameId);

            await Clients.Group(group).SendAsync("NewEvent", ev);
        }

        private string GetGameGroup(int gameId)
        {
            return "Game_" + gameId;
        }

        private async Task<Model.Game> GetGame(int gameId)
        {
            var game = await _context.Games.Include(g => g.Participants).SingleOrDefaultAsync(g => g.Id == gameId);
            if (game == null)
            {
                throw new ArgumentException("Cannot find game with id = " + gameId);
            }

            return game;
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
