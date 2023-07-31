using Core.Entities;
using Core.Interfaces;
using StackExchange.Redis;
using System.Text.Json;

namespace Infrastructure.Data
{
    public class BasketRepository : IBasketRepository
    {
        private readonly IDatabase _database;
        // constructor that takes an instance of IConnectionMultiplexer (Redis connection) as a parameter
        public BasketRepository(IConnectionMultiplexer redis)
        {
            // get the default database from the Redis connection
            _database = redis.GetDatabase();
        }
        // method to delete a basket based on the provided basketId
        public async Task<bool> DeleteBasketAsync(string basketId)
        {
            // use the Redis database's method to delete the basket with the given ID
            return await _database.KeyDeleteAsync(basketId);
        }
        // method to retrieve a basket based on the basketId
        public async Task<CustomerBasket> GetBasketAsync(string basketId)
        {
            // use the Redis database's method to retrieve the serialized data of the basket
           var data = await _database.StringGetAsync(basketId);
           // if the retrieved data is null or empty, return null; otherwise, deserialize the data to a CustomerBasket object
           return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<CustomerBasket>(data);
        }
        // method to update a basket with the provided CustomerBasket object
        public async Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket)
        {
             // use the Redis database's method to store the serialized basket data with a specific expiration time (30 days)
            var created = await _database.StringSetAsync(basket.Id, JsonSerializer.Serialize(basket), TimeSpan.FromDays(30));
            // If the basket was not created successfully, return null; otherwise, retrieve and return the updated basket
            if(!created) return null;

            return await GetBasketAsync(basket.Id);
        }
    }
}