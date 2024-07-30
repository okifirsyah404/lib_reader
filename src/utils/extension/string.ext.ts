String.prototype.toTitleCase = function (): string {
  return this.replace(/\w\S*/g, function (txt: string): string {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

String.prototype.capitalizeFirstWord = function (): string {
  return this.charAt(0).toUpperCase() + this.slice(1).toLocaleLowerCase();
};
