const quantify = {
  fromString: (toParse: string): string => {
    let number = Number.parseFloat(toParse);

    let mega = /(?<=\d+)\d{6}$/;
    let kilo = /(?<=\d+)\d{3}$/;

    if (mega.test(toParse)) {
      let rounded = Math.round(number * 10 ** -6) * 10 ** 6;
      return rounded.toString().replace(mega, "M");
    } else if (kilo.test(toParse)) {
      let rounded = Math.round(number * 10 ** -3) * 10 ** 3;
      return rounded.toString().replace(kilo, "K");
    } else return toParse;
  },

  fromNumber: (toParse: number): string => {
    let string = toParse.toString();

    let mega = /(?<=\d+)\d{6}$/;
    let kilo = /(?<=\d+)\d{3}$/;

    if (mega.test(string)) {
      let rounded = Math.round(toParse * 10 ** -6) * 10 ** 6;
      return rounded.toString().replace(mega, "M");
    } else if (kilo.test(string)) {
      let rounded = Math.round(toParse * 10 ** -3) * 10 ** 3;
      return rounded.toString().replace(kilo, "K");
    } else return string;
  },
};

export default quantify;
