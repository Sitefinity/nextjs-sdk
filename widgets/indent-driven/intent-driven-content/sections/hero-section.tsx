import { RenderSectionProps } from './common';

 export function HeroSection({sectionData, isLoading, cssClassName}: RenderSectionProps<{ title: string, description: string, image: string }>) {
  if (isLoading) {
    return ( <div className="skeleton-loader d-flex justify-content-center mb-4">
      <svg width="915" height="111" viewBox="0 0 915 111" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="628" height="38" fill="#F0F0F0" />
        <rect y="65" width="915" height="16" fill="#F0F0F0" />
        <rect y="95" width="696" height="16" fill="#F0F0F0" />
      </svg>
    </div>);
  }

  if (!sectionData) {
      return null;
  }


    return (
      <section className={`container mt-5 mb-5 ${cssClassName}`}>
        <div className="text-center pt-4 pb-4">
          <h2>{sectionData.title}</h2>
          <p>{sectionData.description}</p>
        </div>
      </section>
          /* {sectionData.image && (
        <img
          src={sectionData.image}
          alt={sectionData.title}
          width={800}
          height={400}
          style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }}
                />
            )} */
    );
}
