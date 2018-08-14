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
    public class GamesController : ControllerBase
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

        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<string>> Get(int id)
        {
            var game = await GetGame(id);
            return game.Data;
        }

        [HttpPost]
        public async Task<int> Post([FromBody] string value)
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

            return game.Id;
        }

        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] string value)
        {
            var game = await GetGame(id);
            game.Data = value;
            await _context.SaveChangesAsync();
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
                throw new ArgumentException("Cannot find game with id = " + gameId);
            }

            if (!game.IsParticipant(CallingUserId))
            {
                throw new ArgumentException($"Player id = {CallingUserId} is not participant of game id = ${gameId}");
            }

            return game;
        }
    }
}
