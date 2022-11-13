const db = require("../dbConn");

exports.getDatiGrafico = async (req, res) => {
  try {
    console.log("params:", req.query);
    const dataDa = req.query.da ? req.query.da : "19000101";
    const dataA = req.query.a ? req.query.a : "30000101";

    const { rows: sums } = await db.query(
      `with recursive mesi as(
        select 1 as n
        union all 
        select n+1
        from mesi
        where n <= 11
        )
        select * from (
        select 
          mesi.n as mese,
          'Spese' as tipoDESC,
          1 as tipo,
          coalesce(sum(amount),0) as tot
          from mesi left join movimenti on (mesi.n = extract(MONTH FROM Movimenti.dataMov) and  Movimenti.datamov between $1 and $2 and movimenti.tipomovid  = 1 )
          group by mesi.n
          union 
          select 
           mesi.n as mese,
          'Entrate' as tipoDESC,
          2 as tipo,
          coalesce(sum(amount),0) as tot
          from mesi left join movimenti on (mesi.n = extract(MONTH FROM Movimenti.dataMov) and  Movimenti.datamov between $1 and $2 and movimenti.tipomovid  = 2 )
          group by  mesi.n
          union 
          select 
          mesi.n as mese,
          'Differenza' as tipoDESC,
          -1 as tipo,
          sum( case when movimenti.tipomovid  = 1 then coalesce(-amount,0)  when movimenti.tipomovid  = 3 then 0  else coalesce(amount,0) end) as tot
          from mesi 
          left join movimenti on (mesi.n = extract(MONTH FROM Movimenti.dataMov) and  Movimenti.datamov between $1 and $2 )
          group by  mesi.n
        )A 
        order by mese,tipo
    `,
      [dataDa, dataA]
    );
    //console.log(sums);
    let tot = 0;
    for (let i = 0; i < sums.length; i++) {
      if (sums[i].tipo === -1) {
        //SOMMO LE DIFFERENZE MENSILI PER SAPERE IL RISULTATO FINALE
        tot += sums[i].tot;
      }
    }

    const differenze = sums.filter((c) => c.tipo == -1);
    const spese = sums.filter((c) => c.tipo == 1);
    const entrate = sums.filter((c) => c.tipo == 2);

    const res = {
      differenze,
      spese,
      entrate,
      tot,
    };
    console.log(res);
    return res;
  } catch (error) {
    //pass error to next()
    throw error;
  }
};

exports.getDatiMensile = async (req, res) => {
  try {
    console.log("params:", req.query);
    const anno = req.query.anno ? req.query.anno : new Date().getFullYear();
    const mese = req.query.mese ? req.query.mese : (new Date().getMonth() + 1);

    const { rows: sums } = await db.query(
      `select
        movimenti.tipomovid,
        movimenti.a,
        conticategorie.nome , conticategorie.colore ,
        sum(movimenti.amount) as tot_categoria
      from
        movimenti
      join conticategorie on (movimenti.a = conticategorie.id)
      where
        extract(year
      from
        movimenti.dataMov) = $1
        and extract(month
      from
        movimenti.dataMov)= $2
      group by movimenti.a, movimenti.tipomovid ,conticategorie.nome , conticategorie.colore
    `,
      [anno, mese]
    );

    const spese = sums.filter((c) => c.tipomovid == 1)
    const entrate = sums.filter((c) => c.tipomovid == 2);
    const transfer = sums.filter((c) => c.tipomovid == 3);

    const res = {
      anno,
      mese,
      spese: getTotPerCat(spese),
      entrate: getTotPerCat(entrate),
      transfer: getTotPerCat(transfer),
    };
    console.log(res);
    return res;
  } catch (error) {
    //pass error to next()
    throw error;
  }
}

const getTotPerCat = (arr) => {
  let s=0;
  for( k of arr){
    s+=k.tot_categoria;
  }
  return {
    data: arr,
    tot: s
  }
}