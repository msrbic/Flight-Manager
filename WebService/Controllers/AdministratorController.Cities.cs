using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DataAccess.Data;
using WebService.Helpers;
using DataAccess.Enums;

namespace WebService.Controllers
{
    public partial class AdministratorController
    {
        // GET: api/Administrator/cities
        [HttpGet("cities")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<City>>> GetCities()
        {
            return await context.Cities.ToListAsync();
        }

        // GET: api/Administrator/cities/5
        [HttpGet("cities/{id}")]
        [Authorize]
        public async Task<ActionResult<City>> GetCity(int id)
        {
            var city = await context.Cities.FindAsync(id);

            if (city == null)
            {
                return NotFound();
            }

            return city;
        }

        // PUT: api/Administrator/cities/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("cities/{id}")]
        [Authorize(Role.Admin)]
        public async Task<IActionResult> PutCity(int id, City city)
        {
            if (id != city.Id)
            {
                return BadRequest();
            }

            context.Entry(city).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CityExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Administrator/cities
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("cities")]
        [Authorize(Role.Admin)]
        public async Task<ActionResult<City>> PostCity(City city)
        {
            context.Cities.Add(city);
            await context.SaveChangesAsync();

            return CreatedAtAction("GetCity", new { id = city.Id }, city);
        }

        // DELETE: api/Administrator/cities/5
        [HttpDelete("cities/{id}")]
        [Authorize(Role.Admin)]
        public async Task<IActionResult> DeleteCity(int id)
        {
            var city = await context.Cities.FindAsync(id);
            if (city == null)
            {
                return NotFound();
            }

            context.Cities.Remove(city);
            await context.SaveChangesAsync();

            return NoContent();
        }

        private bool CityExists(int id)
        {
            return context.Cities.Any(e => e.Id == id);
        }
    }
}
