import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLng, intlCookie, languages } from './app/i18n/settings';

acceptLanguage.languages(languages);

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};

export function middleware(req: NextRequest) {
  let lng: string | undefined | null;

  if (req.cookies.has(intlCookie)) {
    lng = req.cookies.get(intlCookie)?.value;
  }

  if (!lng) {
    lng = acceptLanguage.get(req.headers.get('Accept-Language') || '');
  }

  if (!lng || !languages.includes(lng)) {
    lng = fallbackLng;
  }

  if (!languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`))) {
    const redirectUrl = new URL(`/${lng}${req.nextUrl.pathname}`, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  const currentLngInPath = req.nextUrl.pathname.split('/')[1];
  if (currentLngInPath !== lng) {
    const response = NextResponse.next();
    response.cookies.set(intlCookie, currentLngInPath, { path: '/' });
    return response;
  }

  if (lng && lng !== req.cookies.get(intlCookie)?.value) {
    const response = NextResponse.next();
    response.cookies.set(intlCookie, lng, { path: '/' });
    return response;
  }

  return NextResponse.next();
}
