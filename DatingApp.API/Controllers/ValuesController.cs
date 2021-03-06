﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {

        private readonly DataContext _context;

        public ValuesController(DataContext context)
        {
            _context = context;
        }
        // GET api/values
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetValue()
        {
            var value = await _context.Values.ToListAsync();
            
            return Ok(value);
        }

        //Get api/values/5
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetValue(int id)
        {
            var value = await _context.Values.SingleOrDefaultAsync(v => v.Id == id);

            return Ok(value);
        }

        // Post api/value
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }


        // Put api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        //Delete api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}