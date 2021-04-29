using DataAccess.Data;
using DataAccess.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebService.Helpers;
using WebService.Models;

namespace WebService.Controllers
{
    public partial class AdministratorController
    {
        // GET: api/Administrator/flights
        [HttpGet("flights")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<AdministratorFlightDTO>>> GetFlights(int currencyId)
        {
            var exchangeRate = context.Currencies.Find(currencyId)?.ExchangeRate ?? 1;
            return await context.Flights
                .Include(f => f.Prices)
                .Select(f => new AdministratorFlightDTO(f, currencyId, exchangeRate))
                .ToListAsync();
        }

        // GET: api/Administrator/flights/5
        [HttpGet("flights/{id}")]
        [Authorize]
        public async Task<ActionResult<AdministratorFlightDTO>> GetFlight(int id, int currencyId)
        {
            var exchangeRate = context.Currencies
                .FindAsync(currencyId)
                .Result
                ?.ExchangeRate ?? 1;

            var flight = await context.Flights
                .Include(f => f.Prices)
                .Where(f => f.Id == id)
                .FirstOrDefaultAsync();

            if (flight == null)
            {
                return NotFound();
            }

            return new AdministratorFlightDTO(flight, currencyId, exchangeRate);
        }

        // PUT: api/Administrator/flights/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("flights/{id}")]
        [Authorize(Role.Admin)]
        public async Task<IActionResult> PutFlight(int id, AdministratorFlightDTO flight)
        {
            if (id != flight.Id)
            {
                return BadRequest();
            }

            var flightDb = context.Flights
                .Include(f => f.Prices)
                .Where(f => f.Id == id)
                .FirstOrDefaultAsync();

            if (flightDb == null)
            {
                return NotFound();
            }

            CreateOrUpdateFlightDb(flight, await flightDb);

            await context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Administrator/flights
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("flights")]
        [Authorize(Role.Admin)]
        public async Task<ActionResult<AdministratorFlightDTO>> PostFlight(AdministratorFlightDTO flight)
        {
            var flightDb = CreateOrUpdateFlightDb(flight);

            context.Flights.Add(flightDb);

            await context.SaveChangesAsync();

            flight.Id = flightDb.Id;

            return CreatedAtAction("PostFlight", new { id = flight.Id }, flight);
        }

        // DELETE: api/Administrator/flights/5
        [HttpDelete("flights/{id}")]
        [Authorize(Role.Admin)]
        public async Task<IActionResult> DeleteFlight(int id)
        {
            var flight = await context.Flights
                .Include(f => f.Prices)
                .Where(f => f.Id == id)
                .FirstOrDefaultAsync();

            if (flight == null)
            {
                return NotFound();
            }

            context.FlightPrices.RemoveRange(flight.Prices);
            context.Flights.Remove(flight);
            await context.SaveChangesAsync();

            return NoContent();
        }


        private Flight CreateOrUpdateFlightDb(AdministratorFlightDTO flight, Flight flightDb = null)
        {
            if (flightDb == null)
            {
                flightDb = new Flight();
            }
            else
            {
                context.FlightPrices.RemoveRange(flightDb.Prices);
                context.SaveChanges();
            }

            flightDb.AircraftId = flight.AircraftId;
            flightDb.ArrivalDateTime = flight.ArrivalDateTime;
            flightDb.CarrierId = flight.CarrierId;
            flightDb.DepartureDateTime = flight.DepartureDateTime;
            flightDb.DestinationAirportId = flight.DestinationAirportId;
            flightDb.OriginAirportId = flight.OriginAirportId;
            flightDb.Prices = new List<FlightPrice>();

            var currency = context.Currencies.Find(flight.CurrencyId);
            if (currency != null)
            {
                foreach (var price in flight.Prices)
                {
                    var flightPrice = new FlightPrice
                    {
                        Price = price.Price * (currency.IsDefault ? 1 : currency.ExchangeRate),
                        TravelClass = price.TravelClass,
                        TravelerType = price.TravelerType
                    };
                    flightDb.Prices.Add(flightPrice);
                }
            }

            return flightDb;
        }

        private bool FlightExists(int id)
        {
            return context.Flights.Any(e => e.Id == id);
        }
    }
}
