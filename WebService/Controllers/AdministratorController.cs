using DataAccess.Database;
using Microsoft.AspNetCore.Mvc;
using WebService.Helpers;
using DataAccess.Enums;

namespace WebService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public partial class AdministratorController : Controller
    {
        private FlightsManagerDb context;

        public AdministratorController(FlightsManagerDb context)
        {
            this.context = context;
        }
    }
}
