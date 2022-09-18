exports.getTranslateMonth = (month) => {
  //console.log("month", month);
  //console.log("month:", month);
  if (isNaN(month)) return "N.D.";
  month = Number(month);

  switch (month) {
    case 1:
      return "Gennaio";
    case 2:
      return "Febbraio";
    case 3:
      return "Marzo";
    case 4:
      return "Aprile";
    case 5:
      return "Maggio";
    case 6:
      return "Giugno";
    case 7:
      return "Luglio";
    case 8:
      return "Agosto";
    case 9:
      return "Settembre";
    case 10:
      return "Ottobre";
    case 11:
      return "Novembre";
    case 12:
      return "Dicembre";
    default:
      return "N.D.";
  }
};

exports.parseDateyyyymmdd = (stringDate) => {
  const year = stringDate.substring(0, 4);
  const month = Number(stringDate.substring(4, 6));
  const day = stringDate.substring(6, 8);
  //console.log(year, month - 1, day);

  const dd = new Date(year, month - 1, day);

  return {
    year: dd.getFullYear(),
    month: dd.getMonth() + 1,
    day: dd.getDate(),
    dayWeek: getDayWeek(dd.getDay()),
  };
};

const getDayWeek = (day) => {
  switch (day) {
    case 0:
      return "DOMENICA";
    case 1:
      return "LUNEDÌ";
    case 2:
      return "MARTEDÌ";
    case 3:
      return "MERCOLEDÌ";
    case 4:
      return "GIOVEDÌ";
    case 5:
      return "VENERDÌ";
    case 6:
      return "SABATO";
    default:
      return "N.D.";
  }
};
