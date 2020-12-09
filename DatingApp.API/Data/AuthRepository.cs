using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Model;
using Microsoft.AspNetCore.Components.RenderTree;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations.Operations;

namespace DatingApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;

        public AuthRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<User> Register(User user, string password)
        { 
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordSalt, out passwordHash);

            user.PasswordSalt = passwordSalt;
            user.PasswordHash = passwordHash;

            await _context.AddAsync(user);
            await _context.SaveChangesAsync();
            
            return user;

        }

        private void CreatePasswordHash(string password, out byte[] passwordSalt, out byte[] passwordHash)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<User> LogIn(string username, string password)
        {
            var user = await _context.Users.Include(p=>p.Photos).FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
                return null;

            if (!validatePasswordHash(password, user.PasswordSalt, user.PasswordHash))
                return null;

            return user;
        }

        private bool validatePasswordHash(string password, byte[] userPasswordSalt, byte[] userPasswordHash)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(userPasswordSalt))
            {
                var compute = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < compute.Length; i++)
                {
                    if (compute[i] != userPasswordHash[i]) return false;
                }

            }

            return true;
        }

        public async Task<bool> UserExists(string username)
        {
            if (await _context.Users.AnyAsync(u => u.Username == username))
                return true;

            return false;
        }
    }
}
