using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DataAccess.Data;
using DataAccess.Enums;
using WebService.Helpers;

namespace WebService.Controllers
{

    public partial class AdministratorController
    {
        // GET: api/Administrator/currencies
        [HttpGet("currencies")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Currency>>> GetCurrencies()
        {
            return await context.Currencies.ToListAsync();
        }

        // GET: api/Administrator/currencies/5
        [HttpGet("currencies/{id}")]
        [Authorize]
        public async Task<ActionResult<Currency>> GetCurrency(int id)
        {
            var currency = await context.Currencies.FindAsync(id);

            if (currency == null)
            {
                return NotFound();
            }

            return currency;
        }

        // PUT: api/Administrator/currencies/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("currencies/{id}")]
        [Authorize(Role.Admin)]
        public async Task<IActionResult> PutCurrency(int id, Currency currency)
        {
            if (id != currency.Id)
            {
                return BadRequest();
            }

            context.Entry(currency).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CurrencyExists(id))
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

        // POST: api/Administrator/currencies
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("currencies")]
        [Authorize(Role.Admin)]
        public async Task<ActionResult<Currency>> PostCurrency(Currency currency)
        {
            context.Currencies.Add(currency);
            await context.SaveChangesAsync();

            return CreatedAtAction("GetCurrency", new { id = currency.Id }, currency);
        }

        // DELETE: api/Administrator/currencies/5
        [HttpDelete("currencies/{id}")]
        [Authorize(Role.Admin)]
        public async Task<IActionResult> DeleteCurrency(int id)
        {
            var currency = await context.Currencies.FindAsync(id);
            if (currency == null)
            {
                return NotFound();
            }

            context.Currencies.Remove(currency);
            await context.SaveChangesAsync();

            return NoContent();
        }

        private bool CurrencyExists(int id)
        {
            return context.Currencies.Any(e => e.Id == id);
        }
    }
}
