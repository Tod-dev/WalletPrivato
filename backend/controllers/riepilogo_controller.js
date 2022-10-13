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
          group by all mesi.n
          union 
          select 
           mesi.n as mese,
          'Entrate' as tipoDESC,
          2 as tipo,
          coalesce(sum(amount),0) as tot
          from mesi left join movimenti on (mesi.n = extract(MONTH FROM Movimenti.dataMov) and  Movimenti.datamov between $1 and $2 and movimenti.tipomovid  = 2 )
          group by all  mesi.n
          union 
          select 
          mesi.n as mese,
          'Differenza' as tipoDESC,
          -1 as tipo,
          sum( case when movimenti.tipomovid  = 1 then coalesce(-amount,0)  when movimenti.tipomovid  = 3 then 0  else coalesce(amount,0) end) as tot
          from mesi 
          left join movimenti on (mesi.n = extract(MONTH FROM Movimenti.dataMov) and  Movimenti.datamov between $1 and $2 )
          group by all  mesi.n
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
