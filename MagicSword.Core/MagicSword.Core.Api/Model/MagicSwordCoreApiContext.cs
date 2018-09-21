using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MagicSword.Core.Api.Model
{
    public class MagicSwordCoreApiContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public MagicSwordCoreApiContext(DbContextOptions<MagicSwordCoreApiContext> options)
            : base(options)
        {
        }
    }
}
