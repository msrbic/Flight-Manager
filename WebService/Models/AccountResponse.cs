using DataAccess.Data;
using System;

namespace WebService.Models
{
    public class AccountResponse
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }
        public bool IsVerified { get; set; }

        public AccountResponse()
        {
            
        }

        public AccountResponse(Account account)
        {
            Id = account.Id;
            FirstName = account.FirstName;
            LastName = account.LastName;
            Email = account.Email;
            Role = account.Role.ToString();
            Created = account.Created;
            Updated = account.Updated;
            IsVerified = account.IsVerified;
        }
    }
}
