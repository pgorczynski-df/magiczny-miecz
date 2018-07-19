using System;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace MagicSword.Core.Api.Security
{
    public static class SignInManagerExtensions
    {
        private static readonly SigningCredentials SigningCreds = new SigningCredentials(Startup.SecurityKey, SecurityAlgorithms.HmacSha256);
        private static readonly JwtSecurityTokenHandler TokenHandler = new JwtSecurityTokenHandler();

        public static async Task<string> GetJwtToken<TUser>(this SignInManager<TUser> signInManager, TUser user) where TUser : class
        {
            var principal = await signInManager.CreateUserPrincipalAsync(user);
            var token = new JwtSecurityToken(
                "SignalRAuthenticationSample",
                "SignalRAuthenticationSample",
                principal.Claims,
                expires: DateTime.UtcNow.AddDays(30),
                signingCredentials: SigningCreds);
            return TokenHandler.WriteToken(token);
        }
    }
}