import { ClickScrollPlugin, OverlayScrollbars } from 'overlayscrollbars';
import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsComponentProps,
} from 'overlayscrollbars-react';
import React from 'react';

OverlayScrollbars.plugin([ClickScrollPlugin]);

export const Scrollbar = ({
  defer,
  style,
  options,
  children,
  ...props
}: OverlayScrollbarsComponentProps) => {
  return (
    <OverlayScrollbarsComponent
      defer={defer ?? true}
      options={
        options ?? {
          scrollbars: {
            theme: 'os-theme-light',
            clickScroll: true,
            dragScroll: true,
          },
        }
      }
      className='dark:[&_.os-scrollbar]:os-theme-dark'
      style={style ?? { height: '100vh', width: '100vw' }}
      {...props}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
};
