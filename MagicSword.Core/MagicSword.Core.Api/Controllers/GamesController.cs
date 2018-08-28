using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MagicSword.Core.Api.Hubs.Game;
using MagicSword.Core.Api.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace MagicSword.Core.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GamesController : Controller
    {
        private readonly SignInManager<Player> _signInManager;
        private readonly MagicSwordCoreApiContext _context;
        private readonly ILogger _logger;

        public GamesController(SignInManager<Player> signInManager, MagicSwordCoreApiContext context, ILogger<AccountController> logger)
        {
            _signInManager = signInManager;
            _context = context;
            _logger = logger;
        }

        [HttpGet("MyGames")]
        public async Task<ActionResult<IEnumerable<GameListDto>>> GetMyGames()
        {
            var userId = CallingUserId;
            var games = await _context.Games.Where(g => g.Participants.Any(p => p.PlayerId == userId)).ToListAsync();
            var dtos = games.Select(g => CreateListDto(g, userId));

            return Json(dtos);
        }

        [HttpGet("OpenGames")]
        public async Task<ActionResult<IEnumerable<GameListDto>>> GetOpenGames()
        {
            var userId = CallingUserId;
            var games = await _context.Games.Where(g => g.Participants.Any(p => p.PlayerId != userId)).ToListAsync();
            var dtos = games.Select(g => CreateListDto(g, userId));

            return Json(dtos);
        }

        [HttpPost("CreateGame")]
        public async Task<ActionResult<GameListDto>> CreateGame()
        {
            var user = User.Identity.Name;
            var player = await _context.Users.FirstOrDefaultAsync(u => u.Email == user);

            var game = new Model.Game
            {
                OwnerId = player.Id
            };
            game.Participants.Add(new GamePlayer { Game = game, Player = player });

            _context.Games.Add(game);
            await _context.SaveChangesAsync();

            var gameDto = CreateListDto(game, CallingUserId);

            return Json(gameDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<string>> Get(int id)
        {
            var game = await GetGame(id);

            if (game == null)
            {
                return BadRequest("Cannot find game with id = " + id);
            }

            return game.Data;
        }

        [HttpPost]
        public async Task<int> Post([FromBody] dynamic request)
        {
            var user = User.Identity.Name;
            var player = await _context.Users.FirstOrDefaultAsync(u => u.Email == user);

            var game = new Model.Game
            {
                OwnerId = player.Id,
                Data = request.data,
            };
            game.Participants.Add(new GamePlayer { Game = game, Player = player });

            _context.Games.Add(game);
            await _context.SaveChangesAsync();

            return game.Id;
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult> Patch(int id, [FromBody] dynamic request)
        {
            var game = await GetGame(id);

            if (game == null)
            {
                return BadRequest("Cannot find game with id = " + id);
            }

            game.Data = request.data;
            await _context.SaveChangesAsync();
            return Ok(game.Id);
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        private GameListDto CreateListDto(Model.Game game, int callerId)
        {
            return new GameListDto
            {
                Id = game.Id,
                IsOwner = game.OwnerId == callerId,
            };
        }

        private int CallingUserId
        {
            get
            {
                var id = int.Parse(_signInManager.UserManager.GetUserId(User));
                return id;
            }
        }

        private async Task<Model.Game> GetGame(int gameId)
        {
            var game = await _context.Games.Include(g => g.Participants).SingleOrDefaultAsync(g => g.Id == gameId);
            if (game == null)
            {
                return null;
            }

            if (!game.IsParticipant(CallingUserId))
            {
                throw new ArgumentException($"Player id = {CallingUserId} is not participant of game id = ${gameId}");
            }

            return game;
        }
    }
}
