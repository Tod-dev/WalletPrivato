/*CRUD CONTICATEGORIE*/
--FETCH CATEGORIE Spese
select *
from ContiCategorie 
join TipologieContiCategorie on (ContiCategorie.tipoContoID = TipologieContiCategorie.id)
where ContiCategorie.conto = 'N'
and TipologieContiCategorie.nome = 'Spese'


--FETCH CATEGORIE Entrate
select *
from ContiCategorie 
join TipologieContiCategorie on (ContiCategorie.tipoContoID = TipologieContiCategorie.id)
where ContiCategorie.conto = 'N'
and TipologieContiCategorie.nome = 'Entrate'

--FETCH CONTI
select *
from ContiCategorie 
join TipologieContiCategorie on (ContiCategorie.tipoContoID = TipologieContiCategorie.id)
where ContiCategorie.conto = 'S'

--CREATE CONTI_CATEGORIE SPESE/ENTRATE/CONTI
insert into conticategorie (id,nome,colore,icona,amount,tipoContoID,descrizione,conto) values 
(nextval('serialContiCategorie'),'@nome','@colore','@icona','@amount','@tipo','@descrizione','@contoFlag')
	--TEST
	insert into ContiCategorie (id,nome,colore,icona,amount,tipoContoID,descrizione,conto) values 
   (nextval('serialContiCategorie'),'Satispay','#607d8b','FaRegCreditCard',90.5,3,'','S');

--UPDATE CONTI_CATEGORIE SPESE/ENTRATE/CONTI
update conticategorie 
set nome = '@nome', colore = '@colore', icona = '@icona', amount = '@amount', tipocontoid = '@tipo', descrizione = '@descrizione' , conto = '@contoFlag'
where id = '@id'
	--TEST
	update conticategorie 
	set nome = 'Satispay2', colore = '#607d8b2', icona = 'FaRegCreditCard2', amount = 290.5, tipocontoid = 3, descrizione = 'test2' , conto = 'S'
	where id = '8'

--DELETE CONTI_CATEGORIE SPESE/ENTRATE/CONTI
delete from conticategorie where id = '@id'
	--TEST
	delete from conticategorie where id = '8'