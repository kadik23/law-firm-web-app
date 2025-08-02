interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge: number;
  domain?: string;
  path: string;
}

export const getCookieConfig = (isProduction: boolean = false): CookieOptions => {
  const baseConfig: CookieOptions = {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };

  return baseConfig;
};

export const getClearCookieConfig = (isProduction: boolean = false): CookieOptions => {
  return {
    ...getCookieConfig(isProduction),
    maxAge: 0,
  };
}; 