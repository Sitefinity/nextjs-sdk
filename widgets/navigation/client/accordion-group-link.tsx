'use client';

import React from 'react';
import { NavigationItem } from '../../../rest-sdk/dto/navigation-item';

export function AccordionGroupLink(props: NavigationItem) {
    const handleClick = (event: React.MouseEvent<HTMLSpanElement>)=> {
        event.preventDefault();
    };

    return ( <span onClick={handleClick} title={props.Title}
      className="nav-link sc-accordion-link sf-group p-0 text-truncate">
      {props.Title}
    </span>
    );
}
