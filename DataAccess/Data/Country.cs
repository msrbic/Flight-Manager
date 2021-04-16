using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Data
{
    public class Country
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public List<City> Cities { get; set; }
    }
}
