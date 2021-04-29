using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using WebService.Input;
using WebService.Models;
using WebService.Services;
using WebService.Helpers;
using System.Collections.Generic;
using System.Linq;

namespace WebService.Controllers
{
    [Authorize]
    [ApiController]
    public class SearchFlightsController : Controller
    {
        private readonly AmadeusService amadeusService;
        private readonly FlightManagerService flightManagerService;

        public SearchFlightsController(AmadeusService amadeusService, FlightManagerService flightManagerService)
        {
            this.amadeusService = amadeusService;
            this.flightManagerService = flightManagerService;
        }

        // POST: api/SearchFlights
        [Route("api/[controller]")]
        [HttpPost]
        public async Task<ActionResult<FlightDTO>> SearchFlights(SearchFlightsInput input)
        {
            var result = await flightManagerService.SearchFlights(input);

            if (input.ShouldIncludeAmadeusFlights)
            {
                result.AddRange(await amadeusService.SearchFlights(input));
            }

            return Ok(result);
        }

        // GET: api/GetIataCode
        [Route("api/[controller]/GetIataCodes")]
        [HttpGet]
        public async Task<ActionResult<LocationDTO>> GetIataCodes(string keyword, bool includeOnlyLocal = false)
        {
            var result = await flightManagerService.GetIataCodes(keyword);

            if (!includeOnlyLocal)
            {
                result.ForEach(l => l.Id = null);

                try
                {
                    result.AddRange(await amadeusService.GetIataCodes(keyword));
                }
                catch (Exception)
                {

                }
            }

            var distinct = result.Distinct().ToList();
            return Ok(distinct);
        }
    }
}
