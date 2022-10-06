const db = require("../dbConn");
const Movimento = require("../models/Movimento");
const Query = require("../models/Query");

exports.getMovimenti = async (req, res) => {
  try {
    console.log("params:", req.query);
    const dataDa = req.query.da ? req.query.da : "19000101";
    const dataA = req.query.a ? req.query.a : "30000101";
    //console.log("GET MOVS");
    const { rows } = await db.query(
      `select Movimenti.id,TipologieMovimenti.id as tipo, TipologieMovimenti.nome as tipoDSC, fromCC.nome, toCC.nome, Movimenti.amount,  to_char(Movimenti.dataMov, 'YYYYMMDD') as dataMov,
      fromCC.colore as coloreFrom, fromCC.nome as nomeFrom, fromCC.icona as iconaFrom, fromCC.iconfamily as iconafamilyFrom,
      toCC.colore as coloreTo, toCC.nome as nomeTo, toCC.icona as iconaTo, toCC.iconfamily as iconfamilyTo, toCC.id as idTo, fromCC.id as idFrom, Movimenti.descrizione
      from Movimenti
      join TipologieMovimenti on (Movimenti.tipoMovID = TipologieMovimenti.id)
      join ContiCategorie as fromCC on (Movimenti.da = fromCC.id)
      join ContiCategorie as toCC on (Movimenti.a = toCC.id)  
      where Movimenti.datamov between $1 and $2
      order by Movimenti.datamov desc    
    `,
      [dataDa, dataA]
    );

    const { rows: sums } = await db.query(
      `select 
      'Spese' as tipoDESC,
      1 as tipo,
      sum(amount) as tot
      from movimenti
      where Movimenti.datamov between $1 and $2
      and movimenti.tipomovid  = 1
      union 
      select 
      'Entrate' as tipoDESC,
      2 as tipo,
      sum(amount) as tot
      from movimenti
      where Movimenti.datamov between $1 and $2
      and movimenti.tipomovid  = 2
    `,
      [dataDa, dataA]
    );
    //console.log(sums);
    let totIn, totOut;
    for (let i = 0; i < sums.length; i++) {
      //console.log(sums[i]);
      if (sums[i].tipo === 1) {
        totOut = sums[i].tot;
      }
      if (sums[i].tipo === 2) {
        totIn = sums[i].tot;
      }
    }
    const res = {
      data: group(rows),
      totIn: totIn,
      totOut: totOut,
    };
    console.log(res);
    return res;
  } catch (error) {
    //pass error to next()
    throw error;
  }
};

exports.getDatiCCNewMov = async (req, res) => {
  try {
    const { rows: cc } = await db.query(
      `select
      conticategorie.id,
      conticategorie.nome,
      conticategorie.colore,
      conticategorie.icona,
      conticategorie.amount,
      conticategorie.tipocontoid,
      conticategorie.descrizione,
      conticategorie.conto,
      conticategorie.iconfamily
      from conticategorie
      where conticategorie.conto = 'S'
      and conticategorie.tipocontoid = 3
      order by  conticategorie.amount desc   
    `,
      []
    );

    const { rows: catSpese } = await db.query(
      `select
      conticategorie.id,
      conticategorie.nome,
      conticategorie.colore,
      conticategorie.icona,
      conticategorie.amount,
      conticategorie.tipocontoid,
      conticategorie.descrizione,
      conticategorie.conto,
      conticategorie.iconfamily
      from conticategorie
      where conticategorie.conto = 'N' 
      and conticategorie.tipocontoid = 1
      order by conticategorie.id
    `,
      []
    );
    const { rows: catEntrate } = await db.query(
      `select
      conticategorie.id,
      conticategorie.nome,
      conticategorie.colore,
      conticategorie.icona,
      conticategorie.amount,
      conticategorie.tipocontoid,
      conticategorie.descrizione,
      conticategorie.conto,
      conticategorie.iconfamily
      from conticategorie
      where conticategorie.conto = 'N' 
      and conticategorie.tipocontoid = 2
      order by conticategorie.id
    `,
      []
    );
    const res = {
      cc,
      catSpese,
      catEntrate,
    };
    console.log(res);
    return res;
  } catch (error) {
    //pass error to next()
    throw error;
  }
};

const group = (rows) => {
  let res = {};
  let current = null;
  for (let i = 0; i < rows.length; i++) {
    if (!current || current != rows[i].datamov) {
      current = rows[i].datamov;
      if (!res[rows[i].datamov]) res[rows[i].datamov] = [];
    }
    res[rows[i].datamov].push(rows[i]);
  }
  // list di {id: yyyymmdd, data []}
  const ret = [];
  Object.keys(res).map((k) => {
    ret.push({ id: k, data: res[k] });
  });
  return ret;
};

exports.creaMovimento = async (req, res) => {
  const { da, a, amount, tipomovid, descrizione, datamov } = req.body;
  try {
    console.log(req.body);
    const movimento = new Movimento(
      undefined,
      da,
      a,
      amount,
      tipomovid,
      descrizione,
      datamov
    );
    console.log("datamov:", datamov);
    const arrayTextParams = addMovimentoTransactionQuery(movimento);
    //console.log(arrayTextParams);
    await db.queryTransaction(arrayTextParams);

    return movimento;
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

exports.updateMovimento = async (req) => {
  try {
    const id = req.params.id;
    console.log("id:", id);

    const { rows } = await db.query(`select * from movimenti where id = $1`, [
      id,
    ]);
    if (rows.length <= 0)
      throw new Error("id non presente! Impossibile eliminare il movimento");
    console.log("ROWS:", rows);
    const mov = rows[0];
    const movimentoVecchio = new Movimento(
      mov.id,
      mov.da,
      mov.a,
      mov.amount,
      mov.tipomovid,
      mov.descrizione,
      mov.datamov
    );

    const arrayTextParams = undoMovimentoTransactionQuery(movimentoVecchio);

    const { da, a, amount, tipomovid, descrizione, datamov } = req.body;
    console.log(req.body);
    const movimento = new Movimento(
      id,
      da,
      a,
      amount,
      tipomovid,
      descrizione,
      datamov
    );

    const arrayTextParams2 = addMovimentoTransactionQuery(movimento);
    arrayTextParams.push(...arrayTextParams2);
    await db.queryTransaction(arrayTextParams);

    return "Updated Movement with id:" + id;
  } catch (error) {
    throw error;
  }
};

exports.deleteMovimento = async (id) => {
  try {
    console.log("id:", id);

    const { rows } = await db.query(`select * from movimenti where id = $1`, [
      id,
    ]);
    if (rows.length <= 0)
      throw new Error("id non presente! Impossibile eliminare il movimento");
    console.log("ROWS:", rows);
    const mov = rows[0];
    const movimento = new Movimento(
      mov.id,
      mov.da,
      mov.a,
      mov.amount,
      mov.tipomovid,
      mov.descrizione,
      mov.datamov
    );

    const arrayTextParams = undoMovimentoTransactionQuery(movimento);

    await db.queryTransaction(arrayTextParams);

    return "Deleted Movement with id:" + id;
  } catch (error) {
    throw error;
  }
};

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("");
}

const addMovimentoTransactionQuery = (movimento) => {
  let arrayTextParams = [];
  //console.log("movimento:", movimento);
  const oggi = new Date();
  if (!movimento.id) {
    arrayTextParams.push(
      new Query(
        `insert into Movimenti (id,da,a,amount,tipoMovID,descrizione,dataMov) 
  VALUES (nextval('serialMovimenti'), $1, $2, $3, $4, $5, $6)`,
        [
          movimento.da,
          movimento.a,
          movimento.amount,
          movimento.tipomovid,
          movimento.descrizione,
          movimento.datamov ? movimento.datamov : formatDate(oggi),
        ]
      )
    );
  } else {
    arrayTextParams.push(
      new Query(
        `insert into Movimenti (id,da,a,amount,tipoMovID,descrizione,dataMov) 
  VALUES ($6, $1, $2, $3, $4, $5, $7)`,
        [
          movimento.da,
          movimento.a,
          movimento.amount,
          movimento.tipomovid,
          movimento.descrizione,
          movimento.id,
          movimento.datamov ? movimento.datamov : formatDate(oggi),
        ]
      )
    );
  }

  if (movimento.tipomovid != 2) {
    //TRANSFER o SPESA -> TOLGO DAL CONTO DA
    arrayTextParams.push(
      new Query(
        `update ContiCategorie set amount = amount - $1 where id = $2`,
        [movimento.amount, movimento.da]
      )
    );
  }
  if (movimento.tipomovid != 1) {
    //ENTRATA -> AGGIUNGO AL CONTO DA
    //TRANSFER -> AGGIUNGO AL CONTO A
    const idCC = movimento.tipomovid == 2 ? movimento.da : movimento.a;

    arrayTextParams.push(
      new Query(
        `update ContiCategorie set amount = amount + $1 where id = $2`,
        [movimento.amount, idCC]
      )
    );
  }

  //console.log(arrayTextParams);
  return arrayTextParams;
};

const undoMovimentoTransactionQuery = (movimento) => {
  let arrayTextParams = [];
  console.log("movimento:", movimento);
  arrayTextParams.push(
    new Query(`delete from movimenti where id = $1`, [movimento.id])
  );

  if (movimento.tipomovid != 2) {
    //UNDO TRANSFER o SPESA -> AGGIUNGO AL CONTO DA
    arrayTextParams.push(
      new Query(
        `update ContiCategorie set amount = amount + $1 where id = $2`,
        [movimento.amount, movimento.da]
      )
    );
  }
  if (movimento.tipomovid != 1) {
    // UNDO ENTRATA -> TOLGO AL CONTO DA
    //UNDO TRANSFER -> TOLGO AL CONTO A
    const idCC = movimento.tipomovid == 2 ? movimento.da : movimento.a;
    arrayTextParams.push(
      new Query(
        `update ContiCategorie set amount = amount - $1 where id = $2`,
        [movimento.amount, idCC]
      )
    );
  }

  return arrayTextParams;
};
