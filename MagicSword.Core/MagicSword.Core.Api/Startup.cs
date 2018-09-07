using System;
using System.Threading.Tasks;
using MagicSword.Core.Api.Model;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace MagicSword.Core.Api
{
    public class Startup
    {
        //TODO change
        // We use a key generated on this server during startup to secure our tokens.
        // This means that if the app restarts, existing tokens become invalid. It also won't work
        // when using multiple servers.
        //public static readonly SymmetricSecurityKey SecurityKey = new SymmetricSecurityKey(Guid.NewGuid().ToByteArray());
        public static readonly SymmetricSecurityKey SecurityKey = new SymmetricSecurityKey(Guid.Empty.ToByteArray());

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

            services.AddAuthentication(options =>
                {
                    // Identity made Cookie authentication the default.
                    // However, we want JWT Bearer Auth to be the default.
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    // Configure JWT Bearer Auth to expect our security key
                    options.TokenValidationParameters =
                        new TokenValidationParameters
                        {
                            LifetimeValidator = (before, expires, token, param) => expires > DateTime.UtcNow,
                            ValidateAudience = false,
                            ValidateIssuer = false,
                            ValidateActor = false,
                            ValidateLifetime = true,
                            IssuerSigningKey = SecurityKey
                        };

                    // We have to hook the OnMessageReceived event in order to
                    // allow the JWT authentication handler to read the access
                    // token from the query string when a WebSocket or 
                    // Server-Sent Events request comes in.
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];

                            // If the request is for our hub...
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) /*TODO && path.StartsWithSegments("/gameHub")*/)
                            {
                                // Read the token out of the query string
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };
                });

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

            services.AddLogging(logging =>
            {
                logging.AddConfiguration(Configuration.GetSection("Logging"));
                logging.AddConsole();
                logging.AddDebug();
                logging.AddFile("Logs/myapp-{Date}.txt", LogLevel.Information);
            });
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

            app.UseMvc();
        }
    }
}