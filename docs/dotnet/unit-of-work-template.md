# Unit of Work Pattern

The unit of work pattern is a way to manage the state of multiple objects in a single transaction. This pattern is useful when you need to update multiple objects in a single transaction, and you need to ensure that all of the objects are updated successfully or none of them are updated.

A common way of implementing the unit of work pattern is to use a repository class that manages the state of multiple objects. The repository class is responsible for managing the state of the objects and for committing the changes to the database. The repository class is also responsible for ensuring that all of the objects are updated successfully or none of them are updated.

A generic repository class can be used in most cases, and where not possible it can be extended into a more specific repository class. The following example shows a generic repository class that can be used to manage the state of multiple objects.

```csharp title="GenericRepository.cs"
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

public class GenericRepository < TEntity > where TEntity: class 
{
    internal CMSContext _context;
    internal DbSet < TEntity > _dbSet;

    public GenericRepository(CMSContext context) 
    {
        _context = context;
        _dbSet = context.Set < TEntity > ();
    }

    public virtual async Task < IEnumerable < TEntity >> GetAsync(
        Expression < Func < TEntity, bool >> ? filter = null,
        Func < IQueryable < TEntity > , IOrderedQueryable < TEntity >> ? orderBy = null,
        string includeProperties = "") 
        {
        IQueryable < TEntity > query = _dbSet;

        if (filter != null) 
        {
            query = query.Where(filter);
        }

        foreach(var includeProperty in includeProperties.Split(new char[] 
        {
            ','
        }, StringSplitOptions.RemoveEmptyEntries)) {
            query = query.Include(includeProperty);
        }

        if (orderBy != null) 
        {
            return await orderBy(query).ToListAsync();
        } else 
        {
            return await query.ToListAsync();
        }
    }

    public virtual async Task < TEntity ? > GetByIdAsync(object id) 
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async Task InsertAsync(TEntity entity) 
    {
        await _dbSet.AddAsync(entity);
    }

    public virtual async Task < bool > DeleteAsync(object id) 
    {
        TEntity ? entityToDelete = await _dbSet.FindAsync(id);
        if (entityToDelete != null) 
        {
            Delete(entityToDelete);
            return true;
        }
        return false;
    }

    public virtual void DeleteRange(ICollection < TEntity > entitiesToDelete) 
    {
        foreach(TEntity entity in entitiesToDelete) 
        {
            Delete(entity);
        }
    }

    public virtual void Delete(TEntity entityToDelete) {
        if (_context.Entry(entityToDelete).State == EntityState.Detached) 
        {
            _dbSet.Attach(entityToDelete);
        }
        _dbSet.Remove(entityToDelete);
    }

    public virtual void Update(TEntity entityToUpdate) 
    {
        _dbSet.Attach(entityToUpdate);
        _context.Entry(entityToUpdate).State = EntityState.Modified;
    }

    public virtual async Task < bool > AnyAsync(
        Expression < Func < TEntity, bool >> ? filter = null
    ) 
    {
        IQueryable < TEntity > query = _dbSet;

        if (filter != null) 
        {
            query = query.Where(filter);
        }

        return await query.AnyAsync();
    }
}
```

The following example shows a Unit of Work class that uses the generic repository class to manage the state of multiple objects.

```csharp title="UnitOfWork.cs"
public class UnitOfWork: IDisposable, IUnitOfWork 
{
    private bool disposedValue;
    private readonly CMSContext _context;

    private GenericRepository < User > ? _userRepository;

    public UnitOfWork(CMSContext context) 
    {
        _context = context;
    }

    public GenericRepository < User > UserRepository 
    {
        get 
        {
            _userRepository ??= new GenericRepository < User > (_context);
            return _userRepository;
        }
    }

    public async Task SaveChangesAsync() 
    {
        await _context.SaveChangesAsync();
    }

    protected virtual void Dispose(bool disposing) 
    {
        if (!disposedValue) 
        {
            if (disposing) 
            {
                _context.Dispose();
            }

            disposedValue = true;
        }
    }

    public void Dispose() 
    {
        // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
        Dispose(disposing: true);
        GC.SuppressFinalize(this);
    }
}
```

::: tip

Add extra repositories for each model you have in your source code. For example, if you have a `Item` model, add a `ItemRepository` property to the `UnitOfWork` class.

:::

The following example shows the interface for the Unit of Work class, this should be used when setting up dependency injection.

```csharp title="IUnitOfWork.cs"
public interface IUnitOfWork : IDisposable
{
    GenericRepository<User> UserRepository { get; }
        
    Task SaveChangesAsync();
}
```