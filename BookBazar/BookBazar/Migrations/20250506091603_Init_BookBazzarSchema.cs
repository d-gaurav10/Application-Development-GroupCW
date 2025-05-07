using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BookBazar.Migrations
{
    /// <inheritdoc />
    public partial class Init_BookBazzarSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Publishers");

            migrationBuilder.DropColumn(
                name: "Author",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "Discount",
                table: "Books");

            migrationBuilder.RenameColumn(
                name: "PublisherId",
                table: "Publishers",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "CategoryId",
                table: "Categories",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "BookId",
                table: "Books",
                newName: "Id");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Books",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "Books",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Books",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CoverImage",
                table: "Books",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountPrice",
                table: "Books",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Format",
                table: "Books",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ISBN",
                table: "Books",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "Books",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "OnSale",
                table: "Books",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "Publishers",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Penguin Random House" },
                    { 2, "HarperCollins" },
                    { 3, "Simon & Schuster" },
                    { 4, "Macmillan Publishers" },
                    { 5, "Hachette Book Group" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Publishers",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Publishers",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Publishers",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Publishers",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Publishers",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DropColumn(
                name: "CoverImage",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "DiscountPrice",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "Format",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "ISBN",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "Language",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "OnSale",
                table: "Books");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Publishers",
                newName: "PublisherId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Categories",
                newName: "CategoryId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Books",
                newName: "BookId");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Publishers",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Books",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "Books",
                type: "numeric(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Books",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "Author",
                table: "Books",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Books",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "Discount",
                table: "Books",
                type: "numeric(18,2)",
                nullable: true);
        }
    }
}
