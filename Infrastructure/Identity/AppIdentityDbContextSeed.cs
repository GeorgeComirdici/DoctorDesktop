using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "George",
                    Email = "george2@email.com",
                    UserName = "george2@email.com",
                    Address = new Address {
                        FirstName = "George",
                        LastName = "Comirdici",
                        Street = "13 Ion Neculce",
                        City = "Ploiesti",
                        State = "PH",
                        ZipCode = "100359"
                    }
                };
                await userManager.CreateAsync(user, "Passw0rd!Strong");
            }
        }
    }
}