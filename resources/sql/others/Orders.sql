create table Orders(
	Id int primary key not null,
    Title varchar(255),
    Quantity int,
	Message varchar(255),
	City varchar(255)
)

insert into Orders values 
(1,'Ordine1',1,'Messaggio1','Citta1'),
(2,'Ordine2',2,'Messaggio2','Citta2'),
(3,'Ordine3',3,'Messaggio3','Citta3');