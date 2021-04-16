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
        // GET: api/Administrator/airports
        [HttpGet("airports")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Airport>>> GetAirports()
        {
            return await context.Airports.ToListAsync();
        }

        // GET: api/Administrator/airports/5
        [HttpGet("airports/{id}")]
        [Authorize]
        public async Task<ActionResult<Airport>> GetAirport(int id)
        {
            var airport = await context.Airports.FindAsync(id);

            if (airport == null)
            {
                return NotFound();
            }

            return airport;
        }

        // PUT: api/Administrator/airports/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("airports/{id}")]
        [Authorize(Role.Admin)]
        public async Task<IActionResult> PutAirport(int id, Airport airport)
        {
            if (id != airport.Id)
            {
                return BadRequest();
            }

            context.Entry(airport).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AirportExists(id))
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

        // POST: api/Administrator/airports
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("airports")]
        [Authorize(Role.Admin)]
        public async Task<ActionResult<Airport>> PostAirport(Airport airport)
        {
            context.Airports.Add(airport);
            await context.SaveChangesAsync();

            return CreatedAtAction("GetAirport", new { id = airport.Id }, airport);
        }

        // DELETE: api/Administrator/airports/5
        [HttpDelete("airports/{id}")]
        [Authorize(Role.Admin)]
        public async Task<IActionResult> DeleteAirport(int id)
        {
            var airport = await context.Airports.FindAsync(id);
            if (airport == null)
            {
                return NotFound();
            }

            context.Airports.Remove(airport);
            await context.SaveChangesAsync();

            return NoContent();
        }

        private bool AirportExists(int id)
        {
            return context.Airports.Any(e => e.Id == id);
        }
    }
}
