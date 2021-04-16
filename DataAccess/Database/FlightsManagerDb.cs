using DataAccess.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace DataAccess.Database
{
    public class FlightsManagerDb : DbContext
    {
        public FlightsManagerDb(DbContextOptions<FlightsManagerDb> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }

            modelBuilder.Entity<Account>().HasIndex(a => a.Email).IsUnique();
            modelBuilder.Entity<Aircraft>().HasIndex(a => a.Code).IsUnique();
            modelBuilder.Entity<Airport>().HasIndex(a => a.IataCode).IsUnique();
            modelBuilder.Entity<Carrier>().HasIndex(c => c.Code).IsUnique();
            modelBuilder.Entity<City>().HasIndex(c => c.IataCode).IsUnique();
            modelBuilder.Entity<Country>().HasIndex(c => c.Name).IsUnique();
            modelBuilder.Entity<Currency>().HasIndex(c => c.ISOCode).IsUnique();
            modelBuilder.Entity<CustomParameter>().HasIndex(cp => cp.Key).IsUnique();
            modelBuilder.Entity<FlightPrice>().HasIndex(fp => new { fp.FlightId, fp.TravelClass, fp.TravelerType }).IsUnique();

            FlightsManagerDbInitializer.Seed(modelBuilder);
        }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseSqlServer(@"Server=(localdb)\\mssqllocaldb;Database=FlightsManager;Trusted_Connection=True;MultipleActiveResultSets=true");
        //}

        public DbSet<Account> Accounts { get; set; }
        public DbSet<Aircraft> Aircrafts { get; set; }
        public DbSet<Airport> Airports { get; set; }
        public DbSet<Carrier> Carriers { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<CustomParameter> CustomParameters { get; set; }
        public DbSet<Flight> Flights { get; set; }
        public DbSet<FlightPrice> FlightPrices { get; set; }
    }
}
