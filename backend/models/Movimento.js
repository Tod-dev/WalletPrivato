//User constructor
function Movimento(id, da, a, amount, tipomovid, descrizione, datamov) {
  this.id = id;
  this.da = da;
  this.a = a;
  this.amount = amount;
  this.tipomovid = tipomovid;
  this.descrizione = descrizione;
  this.datamov = datamov;
}

module.exports = Movimento;
