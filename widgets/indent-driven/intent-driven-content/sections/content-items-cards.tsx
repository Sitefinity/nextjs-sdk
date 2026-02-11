/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { ContentListItem, modifySfUrl, RenderSectionProps } from './common';

export function ContentItemsCardsSection({sectionData, isLoading, cssClassName}: RenderSectionProps<ContentListItem[]>) {
    if (isLoading) {
        return (<div className="skeleton-loader d-flex justify-content-center mb-4">
          <svg width="915" height="111" viewBox="0 0 915 111" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="628" height="38" fill="#F0F0F0"/>
            <rect y="65" width="915" height="16" fill="#F0F0F0"/>
            <rect y="95" width="696" height="16" fill="#F0F0F0"/>
          </svg>
        </div>);
    }

    if (!Array.isArray(sectionData) || sectionData.length === 0) {
        return null;
    }

    return (
      <section className={`container mt-4 mb-4 ${cssClassName}`}>
        <div className="row row-cols-1 row-cols-md-3">
          {sectionData.map((item, index) => (
            <div className="col mb-4" key={index}>
              <div className="card">
                <img src={modifySfUrl(item.image?.url)} className="card-img-top"
                  alt={item.title} title={item.title} />
                <div className="card-body">
                  <h4 className="card-title">{item.title}</h4>
                  <p className="card-text">{item.content}</p>
                  <a href={modifySfUrl(item.url)} type="button" target="_blank" className="btn btn-outline-dark">Learn more</a>
                </div>
              </div>
            </div>
                ))}
        </div>
      </section>
    );
}
