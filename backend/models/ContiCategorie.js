//User constructor
function ContiCategorie(
  id,
  nome,
  colore,
  icona,
  iconFamily,
  amount,
  tipocontoid,
  descrizione,
  conto,
  amount_effettivo
) {
  this.id = id;
  this.nome = nome;
  this.colore = colore;
  this.icona = icona;
  this.iconFamily = iconFamily;
  this.amount = amount;
  this.tipocontoid = tipocontoid;
  this.descrizione = descrizione;
  this.conto = conto;
  this.amount_effettivo = amount_effettivo;
}

module.exports = ContiCategorie;
