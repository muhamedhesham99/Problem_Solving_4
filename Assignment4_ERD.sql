create database musician;
use musician;

create table musician(
id int primary key auto_increment,
name varchar(50) not null,
street_addr varchar(100) not null,
city_addr varchar(100) not null,
phone varchar(12) not null 
check (
	phone like "010%" or
	phone like "011%" or
	phone like "012%" or
	phone like "015%" 
)
);

create table instrument (
instru_id int primary key auto_increment,
instru_key varchar(50) unique not null,
name varchar(50) unique not null
);

create table musician_albums (
album_id int primary key auto_increment,
title varchar(100) unique not null,
producer int not null,
copyright_date date,
identifier varchar(50) not null,

foreign key (producer) references musician(id)
);

create table album_songs(
song_id int primary key auto_increment,
title varchar(100) unique not null,
album_id int not null,
author varchar(50) not null,

foreign key (album_id) references musician_albums(album_id)
);

create table musicians_instruments(
musician_id int,
instrument_id int,

primary key (musician_id, instrument_id),
foreign key (musician_id) references musician(id),
foreign key (instrument_id) references instrument(instru_id)
);

create table musicians_songs(
songs_id int,
musician_id int,

primary key (songs_id, musician_id),
foreign key (songs_id) references album_songs(song_id),
foreign key (musician_id) references musician(id)
);

insert into musician(name, street_addr, city_addr, phone) 
values ("Ali", "11-st", "Cairo", "01525498666"),
	("Salam", "56-st", "Tanta", "01025641899"),
	("Amr", "88-st", "Ismalia", "01132625777"),
    ("Hazem", "23-st", "Borsaid", "01263536999"),
    ("Ziad", "5-st", "Damnhour", "01552114777");
    
    
insert into instrument (instru_key, name) 
values ("F-flat", "accordian"),
		("A-flat", "guitar"),
        ("C-flat", "drum"),
        ("D-flat", "violin"),
        ("E-flat", "saxophone");

alter table musician add constraint unique_phone unique (phone);

insert into musicians_instruments (musician_id, instrument_id) 
values (1,12),
		(1,13),
        (2,12),
        (3,13),
        (5,16);

select m.name as musician_name, city_addr as city, phone, i.name as instrument_name from musician as m 
	inner join musicians_instruments as mi
	on mi.musician_id = m.id 
    inner join instrument as i
    on mi.instrument_id = i.instru_id;
    
insert into musician_albums (title, producer, identifier) values ("album2011", 2, 'mohamed shabana');

alter table musician_albums modify column copyright_date date default (current_timestamp);

insert into musician_albums (title, producer, identifier) 
values ("album88", 2, 'mohamed farahat'),
		("album99", 4, 'Ezz ashour'),
        ("album105", 5, 'salam na3n3'),
        ("album66", 6, 'pola');
        
select 
	mb.title as album_name,
    m.name as producer_name,
    copyright_date,
    identifier,
    m.street_addr as producer_street_addr,
    m.city_addr as producer_city_addr,
    phone
 from musician_albums as mb 
inner join musician as m 
on mb.producer = m.id;

insert into album_songs (title, album_id, author) 
values ('Fenek mn zman', 3 ,'losha'),
		('S2lt nfsy', 12 ,'maher ezz'),
        ('elsheta', 13 ,'maher ezz'),
        ('kol da kan leh', 1 ,'fakry farouk'),
        ('3shank', 14 ,'tamim hamed');

insert into musicians_songs (songs_id, musician_id) 
values (1,1),
		(5,2),
        (11,3),
        (12,4),
        (13,5),
        (14,6),
        (15,1),
        (1,2),
        (5,3),
        (12,3),
        (13,3),
        (14,4),
        (15,4);
        
select 
m.name as musician_name,
m.phone as musician_phone,
bs.title as song_name,
mb.title as album_name
 from musicians_songs as ms
inner join album_songs as bs
on ms.songs_id = bs.song_id
inner join musician as m
on ms.musician_id = m.id
inner join musician_albums as mb
on bs.album_id = mb.album_id;


