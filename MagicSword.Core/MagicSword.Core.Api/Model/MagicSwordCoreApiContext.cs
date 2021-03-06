﻿using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MagicSword.Core.Api.Model
{
    public class MagicSwordCoreApiContext : IdentityDbContext<Player, IdentityRole<int>, int>
    {
        public MagicSwordCoreApiContext(DbContextOptions<MagicSwordCoreApiContext> options)
            : base(options)
        {
        }
        public DbSet<Game> Games { get; set; }

        //public DbSet<Player> Player { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }

            //modelBuilder.Entity<MagicSwordCoreApiUser>().HasKey(e => e.Id);

            modelBuilder.Entity<GamePlayer>()
                .HasKey(t => new { t.GameId, t.PlayerId });

            modelBuilder.Entity<GamePlayer>()
                .HasOne(pt => pt.Game)
                .WithMany(p => p.Participants)
                .HasForeignKey(pt => pt.GameId);

            modelBuilder.Entity<GamePlayer>()
                .HasOne(pt => pt.Player)
                .WithMany(t => t.ParticipatedGames)
                .HasForeignKey(pt => pt.PlayerId);
        }
    }
}
