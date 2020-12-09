using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Model;

namespace DatingApp.API.Controllers
{

    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public MessageController(IDatingRepository repo , IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet("{id}",Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId , int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var message = await _repo.GetMessage(id);

            if (message == null)
                return NoContent();
            
            return Ok(message);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId,MessageForCreationDto messageForCreationDto)
        {
            var sender = await _repo.GetUser(userId);
         
            if (sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var receiver = await _repo.GetUser(messageForCreationDto.ReceiverId);
            if (receiver == null)
                return NotFound("کاربر مورد نظر وجود ندارد");

            var message = _mapper.Map<Message>(messageForCreationDto);

            _repo.Add(message);

            if (await _repo.SaveAll())
            {
                var messageToReturn = _mapper.Map<MessageForReturnDto>(message);
                return CreatedAtRoute("GetMessage", new {userId,message.Id}, messageToReturn);
            }
            return BadRequest();
        }
        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId,[FromQuery]MessageParams messageParams)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            messageParams.UserId = userId;

            var messages = await _repo.GetMessagesForUser(messageParams);

            var messageForReturn = _mapper.Map<IEnumerable<MessageForReturnDto>>(messages);

            Response.AddPagination(messages.CurrentPage,messages.TotalPages,messages.TotalCount,messages.PageSize);

            return Ok(messageForReturn);

        }

        [HttpGet("thread/{id}")]
        public async Task<IActionResult> GetUsersThread(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messages = await _repo.GetMessageThread(userId, id);

            var messageToReturn = _mapper.Map<IEnumerable<MessageForReturnDto>>(messages);

            return Ok(messageToReturn);
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int userId,int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var message = await _repo.GetMessage(id);

            if (message.SenderId == userId)
            {
                message.SenderDelete = true;
            }

            if (message.ReceiverId == userId)
            {
                message.ReceiverDelete = true;
            }

            if (message.ReceiverDelete == true && message.SenderDelete == true)
            {
                _repo.Delete(message);
            }

            if (await _repo.SaveAll())
                return NoContent();

            return BadRequest();
        }

        [HttpPost("{id}/read")]
        public async Task<IActionResult> SetAsRead(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messages = await _repo.GetMessage(id);

            if (messages.ReceiverId != userId)
                return Unauthorized();

            messages.IsRead = true;
            messages.DateRead = DateTime.Now;

            if (await _repo.SaveAll())
                return NoContent();

            return BadRequest();
        }
    }
}
