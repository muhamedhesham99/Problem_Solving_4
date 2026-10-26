create database store_db;
use store_db;

create table suppliers (
id int primary key auto_increment,
name varchar(50) not null,
contact_number varchar(12) not null unique check (
	contact_number like "010%" or
	contact_number like "011%" or
	contact_number like "012%" or
	contact_number like "015%" 
)
);

create table products (
id int primary key auto_increment,
name varchar(50) not null unique,
price decimal(10,2) not null check (price >= 0) default 0,
stock_quantity int not null check (stock_quantity >= 0) default 0,
supplier_id int not null,
constraint fk_products_supplier foreign key (supplier_id) references suppliers(id)
);

create table sales (
id int primary key auto_increment,
product_id int not null,
sold_quantity int not null check (sold_quantity > 0) default 1,
sale_date date default (CURRENT_DATE),
constraint fk_sales_products foreign key (product_id) references products(id)
);

alter table products
drop foreign key fk_products_supplier;

alter table products
add constraint fk_products_supplier
foreign key (supplier_id)
references suppliers(id)
on delete cascade
on update cascade;

alter table sales drop foreign key fk_sales_products;

alter table sales add constraint fk_sales_products foreign key (product_id) references products(id) on update cascade;

alter table sales modify sale_date date;

truncate sales;
SET SQL_SAFE_UPDATES = 0;
delete from suppliers;
delete from products;
SET suppliers = 1;

alter table products drop foreign key fk_products_supplier;
alter table sales drop foreign key fk_sales_products;
truncate products;
truncate suppliers;

alter table sales add constraint fk_sales_products foreign key (product_id) references products(id) on update cascade;
alter table products add constraint fk_products_supplier foreign key (supplier_id) references suppliers(id) on delete cascade on update cascade;
SHOW GRANTS FOR 'Mohamed'@'localhost';