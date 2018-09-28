using System.ComponentModel.DataAnnotations;

namespace MagicSword.Core.Api.Dto
{
    public class RegisterRequest
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Nickname { get; set; }
    }
}
