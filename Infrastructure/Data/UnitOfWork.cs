using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly StoreContext _context;
        private Hashtable _repositories;
        public UnitOfWork(StoreContext context)
        {
            _context = context;
        }
        public async Task<int> Complete()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            //the method checks if we have already created a hashtable because we created another instance of another repo
            if(_repositories == null) _repositories = new Hashtable();
            //checks the name of the Tentity
            var type = typeof(TEntity).Name;
            //checks if the hashtable already contains a repo with this type
            if(!_repositories.ContainsKey(type))
            {
                var repositoryType = typeof(GenericRepository<>);
                //create an instance of the repo
                var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), _context);
                //the hashtable is going to store all of the repos in use inside the unit of work
                _repositories.Add(type, repositoryInstance);
            }
            return(IGenericRepository<TEntity>)_repositories[type];
        }
    }
}