using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Model;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;

        public DatingRepository(DataContext context)
        {
            _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.Include(p => p.Photos).OrderByDescending(u=>u.LastActive).AsQueryable();
            users = users.Where(u => u.Id != userParams.UserId);
            users = users.Where(u => u.Gender == userParams.Gender);

            if (userParams.Liker)
            {
                var liked = await GetUserLike(userParams.UserId, userParams.Liker);
                users = users.Where(u => liked.Contains(u.Id));
            }

            if (userParams.Likes)
            {
                var likees = await GetUserLike(userParams.UserId, userParams.Liker);
                users = users.Where(u => likees.Contains(u.Id));
            }

            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                users = userParams.OrderBy switch
                {
                    "created" => users.OrderBy(u => u.Created),
                    _ => users.OrderBy(u => u.LastActive),
                };
            }

            return await PagedList<User>.CreateAsync(users ,userParams.PageNumber, userParams.PageSize);
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(p=>p.Photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);

            return photo;
        }

        public async Task<Photo> GetMainPhoto(int userId)
        {
            return await _context.Photos.Where(p => p.UserId == userId).FirstOrDefaultAsync(u => u.IsMain);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes
                .FirstOrDefaultAsync(u=>u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var message = _context.Messages
                .Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(u => u.Receiver).ThenInclude(p => p.Photos).AsQueryable();

            switch (messageParams.MessageContent)
            {
                case "Inbox":
                    message = message.Where(u => u.ReceiverId == messageParams.UserId && u.ReceiverDelete == false);
                    break;
                case "Outbox":
                    message = message.Where(u => u.SenderId == messageParams.UserId && u.SenderDelete == false);
                    break;
                default:
                    message = message.Where(u =>
                        u.ReceiverId == messageParams.UserId && u.IsRead == false && u.ReceiverDelete == false);
                    break;
            }

            message.OrderByDescending(u => u.MessageSent);

            return await PagedList<Message>.CreateAsync(message,messageParams.PageNumber,messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
                .Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(u => u.Receiver).ThenInclude(p => p.Photos)
                .Where(m => m.SenderId == userId && m.ReceiverId == recipientId && m.SenderDelete == false
                            || m.SenderId == recipientId && m.ReceiverId == userId && m.ReceiverDelete == false)
                .OrderByDescending(u => u.MessageSent)
                .ToListAsync();

            return messages;
        }

        public async Task<IEnumerable<int>> GetUserLike(int id, bool liker)
        {
            var users = await _context.Users
                .Include(u => u.Liker)
                .Include(u => u.Likees)
                .FirstOrDefaultAsync(u => u.Id == id);
            if (liker)
            {
                return users.Liker.Where(u => u.LikeeId == id).Select(u => u.LikerId);
            }
            else
            {
                return users.Likees.Where(u => u.LikerId == id).Select(u => u.LikeeId);
            }
        }

    }
}
