/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { ContentListItem, modifySfUrl, RenderSectionProps } from './common';

export function ContentItemsListSection({sectionData, isLoading, cssClassName}: RenderSectionProps<ContentListItem[]>) {
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
      <section className={`${cssClassName} container mt-4 mb-4`}>
        <div className="row">
          <div className="col-12">
            {sectionData.map((item, index) => (
              <React.Fragment key={index}>
                <div className="d-flex">
                  {item.image && (
                  <div className="flex-shrink-0">
                    <img src={modifySfUrl(item.image?.url)}
                      className="card-img-top" alt={item.title} title={item.title} style={{maxWidth: '500px'}} />
                  </div>)}
                  <div className="flex-grow-1 ms-3">
                    <h4>{item.title}</h4>
                    <p>{item.content}</p>
                    {item.url && <a className="btn btn-outline-dark" target="_blank" rel="noopener noreferrer" href={modifySfUrl(item.url)}>Learn more</a>}
                  </div>
                </div>
                <hr />
              </React.Fragment>
                        ))}
          </div>
        </div>
      </section>
    );
}
