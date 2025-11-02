export type StrapiLike = {
  log: { info: Function; warn: Function; debug: Function };
  query: (uid: string) => {
    findOne: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
  };
};
