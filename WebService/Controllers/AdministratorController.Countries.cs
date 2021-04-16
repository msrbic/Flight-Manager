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
        // GET: api/Administrator/countries
        [HttpGet("countries")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Country>>> GetCountries()
        {
            return await context.Countries.ToListAsync();
        }

        // GET: api/Administrator/countries/5
        [HttpGet("countries/{id}")]
        [Authorize]
        public async Task<ActionResult<Country>> GetCountry(int id)
        {
            var country = await context.Countries.FindAsync(id);

            if (country == null)
            {
                return NotFound();
            }

            return country;
        }

        // PUT: api/Administrator/countries/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("countries/{id}")]
        [Authorize(Role.Admin)]
        public async Task<IActionResult> PutCountry(int id, Country country)
        {
            if (id != country.Id)
            {
                return BadRequest();
            }

            context.Entry(country).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CountryExists(id))
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

        // POST: api/Administrator/countries
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("countries")]
        [Authorize(Role.Admin)]
        public async Task<ActionResult<Country>> PostCountry(Country country)
        {
            context.Countries.Add(country);
            await context.SaveChangesAsync();

            return CreatedAtAction("GetCountry", new { id = country.Id }, country);
        }

        // DELETE: api/Administrator/countries/5
        [HttpDelete("countries/{id}")]
        [Authorize(Role.Admin)]
        public async Task<IActionResult> DeleteCountry(int id)
        {
            var country = await context.Countries.FindAsync(id);
            if (country == null)
            {
                return NotFound();
            }

            context.Countries.Remove(country);
            await context.SaveChangesAsync();

            return NoContent();
        }

        private bool CountryExists(int id)
        {
            return context.Countries.Any(e => e.Id == id);
        }
    }
}
