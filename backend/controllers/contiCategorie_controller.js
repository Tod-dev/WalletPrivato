const db = require("../dbConn");
const ContiCategorie = require("../models/ContiCategorie");
//const Query = require("../models/Query");

exports.getConti = async (req, res) => {
  try {
    //console.log("GET MOVS");
    const { rows } = await db.query(
      `select
      ContiCategorie.*,
      TipologieContiCategorie.nome as tipologia
      from
      ContiCategorie
    join TipologieContiCategorie on
      (ContiCategorie.tipoContoID = TipologieContiCategorie.id)
    where
      ContiCategorie.conto = 'S'
    ORDER BY amount DESC`,
      []
    );
    const { rows: tot } = await db.query(
      `select
    sum(ContiCategorie.amount) as tot
  from
    ContiCategorie
  join TipologieContiCategorie on
    (ContiCategorie.tipoContoID = TipologieContiCategorie.id)
  where
    ContiCategorie.conto = 'S'`,
      []
    );
    //console.log(rows);
    const result = {
      totConti: tot[0].tot,
      data: rows,
    };
    return result;
  } catch (error) {
    //pass error to next()
    throw error;
  }
};

exports.getCat = async (req, res, tipo) => {
  try {
    const anno = req.query.anno ? req.query.anno : new Date().getFullYear(); // YYYY
    const mese = req.query.mese ? req.query.mese : new Date().getMonth() + 1; // 0-11 +1
    const tipologia =
      tipo == "entrate" ? "Entrate" : tipo == "uscite" ? "Spese" : "N.D.";

    const tipomovid = tipo == "entrate" ? 2 : tipo == "uscite" ? 1 : -1;
    //console.log("GET MOVS");
    const { rows } = await db.query(
      `select
      $1 as anno,
      $2 as mese,
      ContiCategorie.id,
      ContiCategorie.nome,
      ContiCategorie.colore,
      ContiCategorie.icona,
      ContiCategorie.iconFamily,
      ContiCategorie.descrizione,
      sum(movimenti.amount)
    from
      ContiCategorie
    join TipologieContiCategorie on
      (ContiCategorie.tipoContoID = TipologieContiCategorie.id)
    left join movimenti on (
      movimenti.a = ContiCategorie.id
      and movimenti.tipomovid = $4
      and extract(MONTH FROM movimenti.dataMov)= $2
      and extract(year FROM movimenti.dataMov) = $1
    )
    where
      ContiCategorie.conto = 'N'
      and TipologieContiCategorie.nome = $3
    group by ContiCategorie.id,
    ContiCategorie.nome,
    ContiCategorie.colore,
    ContiCategorie.icona`,
      [anno, mese, tipologia, tipomovid]
    );
    //console.log(rows);
    const arrayCategories = rows;
    const { rows: totali } = await db.query(
      `select
      (
      select
        sum(movimenti.amount)
      from
        ContiCategorie
      join TipologieContiCategorie on
        (ContiCategorie.tipoContoID = TipologieContiCategorie.id)
      left join movimenti on
        (
      movimenti.a = ContiCategorie.id
          and movimenti.tipomovid = 2
          and extract(month
        from
          movimenti.dataMov)= $2
          and extract(year
        from
          movimenti.dataMov) = $1
    )
      where
        ContiCategorie.conto = 'N'
        and TipologieContiCategorie.nome = 'Entrate') as totInMonth,
      (
      select
        sum(movimenti.amount)
      from
        ContiCategorie
      join TipologieContiCategorie on
        (ContiCategorie.tipoContoID = TipologieContiCategorie.id)
      left join movimenti on
        (
      movimenti.a = ContiCategorie.id
          and movimenti.tipomovid = 1
          and extract(month
        from
          movimenti.dataMov)= $2
          and extract(year
        from
          movimenti.dataMov) = $1
    )
      where
        ContiCategorie.conto = 'N'
        and TipologieContiCategorie.nome = 'Spese') as totOutMonth`,
      [anno, mese]
    );
    console.log("totali:", totali);
    const totInMonth = totali[0].totinmonth;
    const totOutMonth = totali[0].totoutmonth;
    const result = {
      totInMonth,
      totOutMonth,
      data: arrayCategories,
      anno: anno,
      mese: mese,
    };
    return result;
  } catch (error) {
    //pass error to next()
    throw error;
  }
};

exports.creaConto = async (req, res) => {
  const { nome, colore, icona, iconFamily, amount, descrizione } = req.body;
  try {
    console.log(req.body);
    const cc = new ContiCategorie(
      undefined,
      nome,
      colore,
      icona,
      iconFamily,
      amount,
      3,
      descrizione,
      "S"
    );

    const { rows } = await db.query(
      `insert into conticategorie (id,nome,colore,icona,amount,tipoContoID,descrizione,conto,iconFamily) values 
      (nextval('serialContiCategorie'),$1,$2,$3,$4,3,$5,'S',$6)`,
      [cc.nome, cc.colore, cc.icona, cc.amount, cc.descrizione, cc.iconFamily]
    );

    return cc;
  } catch (error) {
    const errorToThrow = new Error();
    switch (error?.code) {
      case "23505":
        errorToThrow.message = "User already exists";
        errorToThrow.statusCode = 403;
        break;
      default:
        errorToThrow.statusCode = 500;
    }
    //pass error to next()
    throw errorToThrow;
  }
};

exports.deleteConto = async (id) => {
  try {
    console.log("cancello conto id:", id);

    const { rows } = await db.query(
      `select * from conticategorie where id = $1`,
      [id]
    );
    if (rows.length <= 0)
      throw new Error("id non presente! Impossibile eliminare il conto");
    console.log("ROWS:", rows);
    const cc = rows[0];
    const conto = new ContiCategorie(
      cc.id,
      cc.nome,
      cc.colore,
      cc.icona,
      cc.iconFamily,
      cc.amount,
      3,
      cc.descrizione,
      "S"
    );

    await db.query(`delete from conticategorie where id = $1 `, [cc.id]);

    return "Deleted Conto with id:" + id;
  } catch (error) {
    throw error;
  }
};

exports.updateConto = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("modifico conto id:", id);

    const { rows } = await db.query(
      `select * from conticategorie where id = $1`,
      [id]
    );
    if (rows.length <= 0)
      throw new Error("id non presente! Impossibile modificare il conto");
    const cc = req.body;
    console.log("req.body:", req.body);
    const conto = new ContiCategorie(
      id,
      cc.nome,
      cc.colore,
      cc.icona,
      cc.iconFamily,
      cc.amount,
      3,
      cc.descrizione,
      "S"
    );
    console.log("CONTO:", conto);

    await db.query(
      `update conticategorie 
    set nome = $2, 
    colore = $3,
    icona = $4,
    iconFamily = $5,
    amount = $6,
    descrizione = $7
    where id = $1 `,
      [
        conto.id,
        conto.nome,
        conto.colore,
        conto.icona,
        conto.iconFamily,
        conto.amount,
        conto.descrizione,
      ]
    );

    return conto;
  } catch (error) {
    throw error;
  }
};

exports.creaCategoria = async (req, res) => {
  const { nome, colore, icona, iconFamily, descrizione, isSpesa } = req.body;
  try {
    console.log(req.body);
    const cc = new ContiCategorie(
      undefined,
      nome,
      colore,
      icona,
      iconFamily,
      null,
      isSpesa ? 1 : 2,
      descrizione,
      "N"
    );

    await db.query(
      `insert into conticategorie (id,nome,colore,icona,amount,tipoContoID,descrizione,conto,iconFamily) values 
      (nextval('serialContiCategorie'),$1,$2,$3,$4,$7,$5,'N',$6)`,
      [
        cc.nome,
        cc.colore,
        cc.icona,
        cc.amount,
        cc.descrizione,
        cc.iconFamily,
        cc.tipocontoid,
      ]
    );

    return cc;
  } catch (error) {
    const errorToThrow = new Error();
    switch (error?.code) {
      case "23505":
        errorToThrow.message = "User already exists";
        errorToThrow.statusCode = 403;
        break;
      default:
        errorToThrow.statusCode = 500;
    }
    //pass error to next()
    throw errorToThrow;
  }
};

exports.deleteCategoria = async (id) => {
  try {
    console.log("cancello cat id:", id);

    const { rows } = await db.query(
      `select * from conticategorie where id = $1`,
      [id]
    );
    if (rows.length <= 0)
      throw new Error("id non presente! Impossibile eliminare il conto");
    console.log("ROWS:", rows);
    const cc = rows[0];
    const conto = new ContiCategorie(
      cc.id,
      cc.nome,
      cc.colore,
      cc.icona,
      cc.iconFamily,
      cc.amount,
      cc.tipocontoid,
      cc.descrizione,
      "N"
    );
    await db.query(`delete from conticategorie where id = $1 `, [cc.id]);
    return "Deleted Categoria with id:" + id;
  } catch (error) {
    throw error;
  }
};

exports.updateCategoria = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("modifico cat id:", id);

    const { rows } = await db.query(
      `select * from conticategorie where id = $1`,
      [id]
    );
    if (rows.length <= 0)
      throw new Error("id non presente! Impossibile modificare il conto");
    const cc = req.body;
    console.log("req.body:", req.body);
    const conto = new ContiCategorie(
      id,
      cc.nome,
      cc.colore,
      cc.icona,
      cc.iconFamily,
      null,
      cc.isSpesa ? 1 : 2,
      cc.descrizione,
      "N"
    );
    console.log("CONTO:", conto);

    await db.query(
      `update conticategorie 
    set nome = $2, 
    colore = $3,
    icona = $4,
    iconFamily = $5,
    tipocontoid = $6,
    descrizione = $7
    where id = $1 `,
      [
        conto.id,
        conto.nome,
        conto.colore,
        conto.icona,
        conto.iconFamily,
        conto.tipocontoid,
        conto.descrizione,
      ]
    );

    return conto;
  } catch (error) {
    throw error;
  }
};
