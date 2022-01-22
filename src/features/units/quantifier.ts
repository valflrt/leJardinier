const quantify = (base: string | number) => {
  base = base.toString();

  let mega = /(?<=\d+)\d{6}$/;
  let kilo = /(?<=\d+)\d{3}$/;

  if (mega.test(base)) base = base.replace(mega, "M");
  if (kilo.test(base)) base = base.replace(kilo, "K");

  return base;
};

export default quantify;
