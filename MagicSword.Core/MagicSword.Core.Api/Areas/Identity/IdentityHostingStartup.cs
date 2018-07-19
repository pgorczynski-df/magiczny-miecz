using System;
using MagicSword.Core.Api.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

[assembly: HostingStartup(typeof(MagicSword.Core.Api.Areas.Identity.IdentityHostingStartup))]
namespace MagicSword.Core.Api.Areas.Identity
{
    public class IdentityHostingStartup : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder)
        {
            builder.ConfigureServices((context, services) => {
                services.AddDbContext<MagicSwordCoreApiContext>(options =>
                    options.UseSqlServer(
                        context.Configuration.GetConnectionString("MagicSwordCoreApiContextConnection")));

                services.AddDefaultIdentity<Player>()
                    .AddEntityFrameworkStores<MagicSwordCoreApiContext>();
            });
        }
    }
}