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
        // GET: api/Administrator/carriers
        [HttpGet("carriers")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Carrier>>> GetCarriers()
        {
            return await context.Carriers.ToListAsync();
        }

        // GET: api/Administrator/carriers/5
        [HttpGet("carriers/{id}")]
        [Authorize]
        public async Task<ActionResult<Carrier>> GetCarrier(int id)
        {
            var carrier = await context.Carriers.FindAsync(id);

            if (carrier == null)
            {
                return NotFound();
            }

            return carrier;
        }

        // PUT: api/Administrator/carriers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("carriers/{id}")]
        [Authorize(Role.Admin)]
        public async Task<IActionResult> PutCarrier(int id, Carrier carrier)
        {
            if (id != carrier.Id)
            {
                return BadRequest();
            }

            context.Entry(carrier).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CarrierExists(id))
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

        // POST: api/Administrator/carriers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("carriers")]
        [Authorize(Role.Admin)]
        public async Task<ActionResult<Carrier>> PostCarrier(Carrier carrier)
        {
            context.Carriers.Add(carrier);
            await context.SaveChangesAsync();

            return CreatedAtAction("GetCarrier", new { id = carrier.Id }, carrier);
        }

        // DELETE: api/Administrator/carriers/5
        [HttpDelete("carriers/{id}")]
        [Authorize(Role.Admin)]
        public async Task<IActionResult> DeleteCarrier(int id)
        {
            var carrier = await context.Carriers.FindAsync(id);
            if (carrier == null)
            {
                return NotFound();
            }

            context.Carriers.Remove(carrier);
            await context.SaveChangesAsync();

            return NoContent();
        }

        private bool CarrierExists(int id)
        {
            return context.Carriers.Any(e => e.Id == id);
        }
    }
}
