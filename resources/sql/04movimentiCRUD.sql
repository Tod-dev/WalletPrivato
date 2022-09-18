/*CRUD MOVIMENTI */

--CREATE MOVIMENTI

--0 INSERT MOVIMENTO TRASFERIMENTO 
insert into Movimenti (id,da,a,amount,tipoMovID,descrizione,dataMov) values 
(nextval('serialMovimenti'), '@da', '@a','@amount','@tipo','@descrizione',now());
--1 UPDATE CONTO DA TRASFERIMENTO
	update ContiCategorie set 
	ContiCategorie.amount = ContiCategorie.amount - '@amount'
	where ContiCategorie.conto = 'S' 
	and ContiCategorie.id = '@da'
--2 UPDATE CONTO A TRASFERIMENTO
	update ContiCategorie set 
	ContiCategorie.amount = ContiCategorie.amount + '@amount'
	where ContiCategorie.conto = 'S' 
	and ContiCategorie.id = '@a'

--UPDATE MOVIMENTO ....
	
--DELETE MOVIMENTO
delete from movimenti where id = '@id'	
	--TEST
	delete from movimenti where id = '4'


--FETCH MOVIMENTI
select Movimenti.id,TipologieMovimenti.id as tipo, TipologieMovimenti.nome as tipoDSC, fromCC.nome, toCC.nome, Movimenti.amount, Movimenti.dataMov
from Movimenti
join TipologieMovimenti on (Movimenti.tipoMovID = TipologieMovimenti.id)
join ContiCategorie as fromCC on (Movimenti.da = fromCC.id)
join ContiCategorie as toCC on (Movimenti.a = toCC.id)

--SOMMA DELLE SPESE NEL MESE CORRENTE
select sum(Movimenti.amount) as totSpeseMese
from Movimenti
join TipologieMovimenti on (Movimenti.tipoMovID = TipologieMovimenti.id)
where TipologieMovimenti.nome = 'Spesa'
and extract(MONTH FROM Movimenti.dataMov) =  extract(MONTH FROM now())

--SOMMA DELLE ENTRATE NEL MESE CORRENTE
select sum(Movimenti.amount) as totEntrateMese
from Movimenti
join TipologieMovimenti on (Movimenti.tipoMovID = TipologieMovimenti.id)
where TipologieMovimenti.nome = 'Entrata'
and extract(MONTH FROM Movimenti.dataMov) =  extract(MONTH FROM now())

--SOMMA DELLE SPESE NEL MESE CORRENTE PER OGNI CATEGORIA
select toCC.id,toCC.nome,sum(Movimenti.amount) as totSpeseMeseCategoria
from Movimenti
join TipologieMovimenti on (Movimenti.tipoMovID = TipologieMovimenti.id)
join ContiCategorie as toCC on (Movimenti.a = toCC.id)
where TipologieMovimenti.nome = 'Spesa'
and extract(MONTH FROM Movimenti.dataMov) =  extract(MONTH FROM now())
group by toCC.id,toCC.nome

--SOMMA DELLE ENTRATE NEL MESE CORRENTE PER OGNI CATEGORIA
select toCC.id,toCC.nome,sum(Movimenti.amount) as totSpeseMeseCategoria
from Movimenti
join TipologieMovimenti on (Movimenti.tipoMovID = TipologieMovimenti.id)
join ContiCategorie as toCC on (Movimenti.a = toCC.id)
where TipologieMovimenti.nome = 'Entrata'
and extract(MONTH FROM Movimenti.dataMov) =  extract(MONTH FROM now())
group by toCC.id,toCC.nome

--SOMMA DELLE SPESE DI UNA SPECIFICA CATEGORIA NEL MESE CORRENTE
select sum(Movimenti.amount) as totSpeseMeseCategoria
from Movimenti
join TipologieMovimenti on (Movimenti.tipoMovID = TipologieMovimenti.id)
where TipologieMovimenti.nome = 'Spesa'
and extract(MONTH FROM Movimenti.dataMov) =  extract(MONTH FROM now())
and Movimenti.a = 4 -- @IDCAT

--SOMMA DELLE ENTRATE DI UNA SPECIFICA CATEGORIA NEL MESE CORRENTE
select sum(Movimenti.amount) as totEntrateMeseCategoria
from Movimenti
join TipologieMovimenti on (Movimenti.tipoMovID = TipologieMovimenti.id)
where TipologieMovimenti.nome = 'Entrata'
and extract(MONTH FROM Movimenti.dataMov) =  extract(MONTH FROM now())
and Movimenti.a = 6 -- @IDCAT

