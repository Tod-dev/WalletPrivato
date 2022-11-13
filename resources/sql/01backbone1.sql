CREATE TABLE TipologieContiCategorie (
	id int primary key not null,
    nome varchar(255)
);

Create Table ContiCategorie (
	id int primary key not null,
    nome varchar(255),
    colore varchar(255),
	icona varchar(255),
	iconFamily varchar(255),
	amount float(50),
	tipoContoID int,
    descrizione varchar(255),
	conto char(1) not null,
	CONSTRAINT fk_tipologia foreign key(tipoContoID) references TipologieContiCategorie (id)
);


CREATE TABLE TipologieMovimenti (
	id int primary key not null,
    nome varchar(255)
);

CREATE TABLE Movimenti (
	id int primary key not null,
    da int not null,
    a int not null,
	amount float(50),
	tipoMovID int,
    descrizione varchar(255),
	dataMov timestamp,
	CONSTRAINT fk_da foreign key(da) references ContiCategorie (id),
	CONSTRAINT fk_a foreign key(a) references ContiCategorie (id),
	CONSTRAINT fk_tipologia foreign key(tipoMovID) references TipologieMovimenti (id)
);

CREATE SEQUENCE serialContiCategorie START 8;
CREATE SEQUENCE serialMovimenti START 4;			
----------------------------------------------------------------------------------------
delete from ContiCategorie;
delete  from TipologieContiCategorie;

delete from TipologieMovimenti;

insert into TipologieContiCategorie (id,nome) values (1, 'Spese'),(2,'Entrate'),(3,'Conto Standard');

insert into ContiCategorie (id,nome,colore,icona,amount,tipoContoID,descrizione,conto) values 
						   (1,'N26','#607d8b','FaRegCreditCard',700.80,3,'','S'),
						   (2,'Hype','#00bcd4','FaRegCreditCard',340.34,3,'','S'),
						   (3,'Paypal','#e91e63','FaPaypal',110.3,3,'','S'),
						   (4,'Ristorante','#3f51b5','FaUtensils',null,1,'','N'),
						   (5,'Sport','#ff5722','FaSwimmer',null,1,'','N'),
						   (6,'Work','#673ab7','FaSuitcase',null,2,'','N'),
						   (7,'Ripetizioni','#ff5722','FaFileSignature',null,2,'','N');

insert into TipologieMovimenti (id,nome) values (1, 'Spesa'),(2,'Entrata'),(3,'Trasferimento');

insert into Movimenti (id,da,a,amount,tipoMovID,descrizione,dataMov) values 
				      (1, 1, 6,1530.5,2,'Busta Maggio 2022','2022-07-05 10:00:05'),
					  (2, 1, 4,22.5,1,'Cena sushi con amici',now()),
					  (3, 1, 1,50,3,'Transfer momentaneo',now());

	
--SELECT nextval('serialContiCategorie');		
----------------------------------------------------------------------------------------------------
--TODO:
	--movimenti futuri
----------------------------------------------------------------------------------------------------

ALTER TABLE ContiCategorie ADD COLUMN amount_effettivo float(50) null;