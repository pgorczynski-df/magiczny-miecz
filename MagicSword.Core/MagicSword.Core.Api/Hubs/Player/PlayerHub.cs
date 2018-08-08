using System;
using System.Linq;
using System.Threading.Tasks;
using MagicSword.Core.Api.Controllers;
using MagicSword.Core.Api.Dto;
using MagicSword.Core.Api.Hubs.Game;
using MagicSword.Core.Api.Model;
using MagicSword.Core.Api.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

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

            _logger.LogInformation("Starting PlayerHub");
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

            _logger.LogInformation("User {0} attempting to join game {1}", userId, gameId);

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

            await RespondCaller(nameof(JoinGameRequest), new GameStateDto
            {
                IsStarted = game.Data != null,
                Data = game.Data,
            });
        }

        [Authorize]
        public async Task Publish(Event ev)
        {
            var playerId = CallingUserId;

            _logger.LogInformation("Received event {0} from user {1}", ev.EventType, playerId);

            var game = await GetGame(ev.GameId);
            if (!game.IsParticipant(playerId))
            {
                throw new ArgumentException("Player id = " + playerId + " is not participant of game id = " + game.Id);
            }

            ev.SourcePlayerId = playerId;

            switch (ev.EventType)
            {
                case EventType.GameLoadResponse:
                    var data = ev.Data;
                    var serialized = JsonConvert.SerializeObject(data);

                    _logger.LogInformation("Updating game state from user {0}, length: {1}", playerId, serialized.Length);

                    game.Data = serialized;
                    await _context.SaveChangesAsync();
                    break;
                case EventType.ResetGameState:
                    game.Data = ev.Data.ToString();
                    await _context.SaveChangesAsync();
                    break;
                default:

                    //request updated state from sender
                    await SendEvent(Clients.Caller, new Event
                    {
                        GameId = game.Id,
                        EventType = EventType.GameLoadRequest,
                        Data = { },
                        SourcePlayerId = -1,
                    });

                    //notify others
                    var group = GetGameGroup(ev.GameId);
                    await SendEvent(Clients.Group(group), ev);
                    break;
            }
        }

        public static Task SendEvent(IClientProxy clientProxy, object arg1)
        {
            return clientProxy.SendAsync("NewEvent", arg1);
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
