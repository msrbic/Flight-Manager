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
        // GET: api/Administrator/aircrafts
        [HttpGet("aircrafts")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Aircraft>>> GetAircrafts()
        {
            return await context.Aircrafts.ToListAsync();
        }

        // GET: api/Administrator/aircrafts/5
        [HttpGet("aircrafts/{id}")]
        [Authorize]
        public async Task<ActionResult<Aircraft>> GetAircraft(int id)
        {
            var aircraft = await context.Aircrafts.FindAsync(id);

            if (aircraft == null)
            {
                return NotFound();
            }

            return aircraft;
        }

        // PUT: api/Administrator/aircrafts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("aircrafts/{id}")]
        [Authorize(Role.Admin)]
        public async Task<IActionResult> PutAircraft(int id, Aircraft aircraft)
        {
            if (id != aircraft.Id)
            {
                return BadRequest();
            }

            context.Entry(aircraft).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AircraftExists(id))
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

        // POST: api/Administrator/aircrafts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("aircrafts")]
        [Authorize(Role.Admin)]
        public async Task<ActionResult<Aircraft>> PostAircraft(Aircraft aircraft)
        {
            context.Aircrafts.Add(aircraft);
            await context.SaveChangesAsync();

            return CreatedAtAction("GetAircraft", new { id = aircraft.Id }, aircraft);
        }

        // DELETE: api/Administrator/aircrafts/5
        [HttpDelete("aircrafts/{id}")]
        [Authorize(Role.Admin)]
        public async Task<IActionResult> DeleteAircraft(int id)
        {
            var aircraft = await context.Aircrafts.FindAsync(id);
            if (aircraft == null)
            {
                return NotFound();
            }

            context.Aircrafts.Remove(aircraft);
            await context.SaveChangesAsync();

            return NoContent();
        }

        private bool AircraftExists(int id)
        {
            return context.Aircrafts.Any(e => e.Id == id);
        }
    }
}
