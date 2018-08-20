export class Collections {

  public static shuffle = (col: any[]) => {
    return col
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
  }

  public static remove = (col: any[], object: any) => {
    return col.filter(obj => obj !== object);
  }

}
