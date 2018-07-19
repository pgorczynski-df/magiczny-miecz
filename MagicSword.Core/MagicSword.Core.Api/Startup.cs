using MagicSword.Core.Api.Hubs;
using MagicSword.Core.Api.Model;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MagicSword.Core.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //var connection = @"Server=.\SQLEXPRESS;Initial Catalog=MagicSword;Trusted_Connection=True;ConnectRetryCount=0;Integrated Security=True";
            //services.AddDbContext<GameServerContext>(options => options.UseSqlServer(connection));

            //services.AddDbContext<MagicSwordCoreApiContext>(options =>
            //    options.UseSqlServer(
            //        context.Configuration.GetConnectionString("MagicSwordCoreApiContextConnection")));

            //services.AddDefaultIdentity<MagicSwordCoreApiUser>()
            //    .AddEntityFrameworkStores<MagicSwordCoreApiContext>();

            var policy = new CorsPolicy();
            policy.Headers.Add("*");
            policy.Methods.Add("*");
            policy.Origins.Add("*");
            policy.SupportsCredentials = true;

            services.AddCors(x => x.AddPolicy("corsGlobalPolicy", policy));

            services.AddDbContext<MagicSwordCoreApiContext>(options =>
                options.UseSqlServer(
                    Configuration.GetConnectionString("MagicSwordCoreApiContextConnection")));

            services.AddDefaultIdentity<Player>(o =>
                {
                    o.SignIn.RequireConfirmedEmail = false;
                    o.Password.RequireNonAlphanumeric = false;
                    o.Password.RequireUppercase = false;
                    o.Password.RequireLowercase = false;
                    o.Password.RequiredLength = 6;
                })
                .AddEntityFrameworkStores<MagicSwordCoreApiContext>();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
                .AddRazorPagesOptions(options =>
                {
                    options.AllowAreas = true;
                    options.Conventions.AuthorizeAreaFolder("Identity", "/Account/Manage");
                    options.Conventions.AuthorizeAreaPage("Identity", "/Account/Logout");
                });

            services.ConfigureApplicationCookie(options =>
            {
                options.LoginPath = $"/Identity/Account/Login";
                options.LogoutPath = $"/Identity/Account/Logout";
                options.AccessDeniedPath = $"/Identity/Account/AccessDenied";
            });

            // using Microsoft.AspNetCore.Identity.UI.Services;
            //services.AddSingleton<IEmailSender, EmailSender>();

            services.AddSignalR();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseCors("corsGlobalPolicy");

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseAuthentication();

            app.UseSignalR(routes => { routes.MapHub<GameHub>("/gameHub"); });

            app.UseMvc();
        }
    }
}