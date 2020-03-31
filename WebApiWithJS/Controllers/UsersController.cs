using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiWithJS.Models;

namespace WebApiWithJS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly UsersContext db;
        public UsersController(UsersContext usersContext)
        {
            db = usersContext;

            if (!db.Users.Any())
            {
                db.Users.Add(new User { Name = "Tom", Age = 26 });
                db.Users.Add(new User { Name = "Alice", Age = 31 });
                db.Users.Add(new User { Name = "Andry", Age = 21 });
                db.Users.Add(new User { Name = "Morgan", Age = 11 });
                db.SaveChanges();
            }
        }

      
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> Get()
        {
            var result = await db.Users.ToListAsync();
            return result;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(int id)
        {
            User user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);

            if(user == null)
            {
                return NotFound();
            }
            return new ObjectResult(user);
        }

        [HttpPost]
        public async Task<ActionResult<User>> Post([FromBody]User user)
        {
            if (user == null)
            {
                return BadRequest();
            }

            db.Users.Add(user);
            await db.SaveChangesAsync();
            return Ok(user);
        }

        [HttpPut]
        public async Task<ActionResult<User>> Put([FromBody]User user)
        {
            if (user == null)
            {
                return BadRequest();
            }
            if (!db.Users.Any(x => x.Id == user.Id))
            {
                return NotFound();
            }

            db.Update(user);
            await db.SaveChangesAsync();
            return Ok(user);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<User>> Delete(int id)
        {
            User user = db.Users.FirstOrDefault(x => x.Id == id);
            if (user == null)
            {
                return NotFound();
            }
            db.Users.Remove(user);
            await db.SaveChangesAsync();
            return Ok(user);
        }
    }
}
