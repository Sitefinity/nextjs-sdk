'use client';

import React from 'react';
import { NavigationItem } from '../../../rest-sdk/dto/navigation-item';

export function AccordionLink(props: NavigationItem) {
    const handleMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
        (event.target as HTMLAnchorElement).parentElement!.removeAttribute('data-bs-toggle');
    };
    return ( <a onMouseDown={handleMouseDown} title={props.Title} className="nav-link sc-accordion-link p-0 text-truncate"
      href={props.Url} target={props.LinkTarget}>
      {props.Title}
    </a>
    );
}
