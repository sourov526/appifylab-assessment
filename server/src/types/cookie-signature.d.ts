declare module "cookie-signature" {
  const signature: {
    sign(value: string, secret: string): string;
    unsign(value: string, secret: string): string | false;
  };

  export default signature;
}
