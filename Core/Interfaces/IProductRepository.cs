using System.Threading.Tasks;
using Core.Entities;


namespace Core.Interfaces
{
    public interface IProductRepository
    {
        //method used to get a product by it's id; will return a Product object
        Task<Product>GetProductByIdAsync(int id);
        //get the product list; will return a read-only list of Product type objects
        Task<IReadOnlyList<Product>>GetProductsAsync();
        //get the product brands list; will return a read-only list of ProductBrand objects
        Task<IReadOnlyList<ProductBrand>>GetProductBrandsAsync();
        //get the product types list; will return a read-only list of ProductType objects
        Task<IReadOnlyList<ProductType>>GetProductTypesAsync();
    }
}