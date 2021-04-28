using Microsoft.EntityFrameworkCore;
using Library.Models;

namespace Library.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Book>().ToTable("Books");

            builder.Entity<Book>()
                .HasKey(b => b.Id);

            builder.Entity<Book>()
                .HasOne(b => b.Category)
                .WithMany(c => c.Books)
                .HasForeignKey(c => c.CategoryId)
                .IsRequired();

            builder.Entity<Book>()
                .HasMany(b => b.BorrowRequestDetails)
                .WithOne(b => b.Book)
                .HasForeignKey(b => b.BookId)
                .IsRequired();

            //--------------------------------------

            builder.Entity<User>().ToTable("Users");

            builder.Entity<User>()
                .HasKey(u => u.Id);

            //--------------------------------------

            builder.Entity<Category>().ToTable("Categories");

            builder.Entity<Category>()
                .HasMany(c => c.Books)
                .WithOne(b => b.Category)
                .HasForeignKey(b => b.CategoryId)
                .IsRequired();

            builder.Entity<Category>()
                .HasKey(c => c.Id);

            //--------------------------------------

            builder.Entity<BorrowRequest>().ToTable("BorrowRequests");

            builder.Entity<BorrowRequest>()
                .HasKey(b => b.Id);

            builder.Entity<BorrowRequest>()
                .HasOne(b => b.User)
                .WithMany(u => u.BorrowRequests)
                .HasForeignKey(u => u.UserId)
                .IsRequired();

            builder.Entity<BorrowRequest>()
                .HasMany(b => b.BorrowRequestDetails)
                .WithOne(brd => brd.BorrowRequest)
                .HasForeignKey(brd => brd.BorrowRequestId)
                .IsRequired();

            //--------------------------------------

            builder.Entity<BorrowRequestDetail>().ToTable("BorrowRequestDetails");

            builder.Entity<BorrowRequestDetail>()
                .HasKey(b => new { b.BorrowRequestId, b.BookId });

            builder.Entity<BorrowRequestDetail>()
                .HasOne(br => br.Book)
                .WithMany(b => b.BorrowRequestDetails)
                .HasForeignKey(b => b.BookId)
                .IsRequired();

            builder.Entity<BorrowRequestDetail>()
                .HasOne(brd => brd.BorrowRequest)
                .WithMany(br => br.BorrowRequestDetails)
                .HasForeignKey(br => br.BorrowRequestId)
                .IsRequired();
        }
    }
}