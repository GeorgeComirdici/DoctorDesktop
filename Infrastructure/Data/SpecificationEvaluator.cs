using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class SpecificationEvaluator<TEntity> where TEntity : BaseEntity
    {
        //apply the specifications to the input query and return the modified query
        public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> inputQuery, ISpecification<TEntity> spec)
        {
            var query = inputQuery;
            // apply filtering criteria if specified in the spec
            if (spec.Criteria != null)
            {
                query = query.Where(spec.Criteria);
            }
            //apply ordering if specified in the spec
            if (spec.OrderBy != null)
            {
                query = query.OrderBy(spec.OrderBy);
            }
            //apply descending ordering if specified in the spec
            if (spec.OrderByDescending != null)
            {
                query = query.OrderByDescending(spec.OrderByDescending);
            }
            //apply paging if enabled in the spec
            if (spec.isPagingEnabled)
            {
                query = query.Skip(spec.Skip).Take(spec.Take);
            }
            //apply eager loading of the entities specified in the spec
            query = spec.Includes.Aggregate(query, (current, include) => current.Include(include));
            //return the modified query
            return query;
        }
    }
}