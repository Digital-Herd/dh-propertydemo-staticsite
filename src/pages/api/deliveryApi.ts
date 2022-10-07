import { fetchAPI } from "./apiClient";
import { Asset, Property, PropertyListItem, PublicLink } from "./model";

export async function getAllProperties(soldOnGt: Date): Promise<PropertyListItem[]> {
  const data = await fetchAPI(`
    { 
      allDh_Property(where: {
        publishedToWebsite_eq: true,
        OR: [
          { sold_eq: false },
          { soldOn_eq: null },
          { soldOn_gt: "${soldOnGt.toDateString()}"}
        ]
      }) {
        results {
          id
          slug
        }
      }
    }
  `);
  
  return mapToPropertyListItems(data);
}

export async function getProperty(slug: string): Promise<Property | null> {
  const data = await fetchAPI(`
    {
      allDh_Property(where: {
        slug_eq: "${slug}"
      }) {
        results {
          id
          title
          description
          publishedToWebsite
          price
          type
          built
          sold
          soldOn
          address
          cityState
          zIP
          slug
          dhPropertyToMainImage {
            id
            fileName
            assetToPublicLink {
              results {
                id
                status
                relativeUrl
                resource
                expirationDate
                versionHash
              }
            }
          }
          dhPropertyToImages {
            results {
              id
              fileName
              assetToPublicLink {
                results {
                  id
                  status
                  relativeUrl
                  resource
                  expirationDate
                  versionHash
                }
              }
            }
          }
          dhPropertyToDocuments {
            results {
              id
              fileName
              assetToPublicLink {
                results {
                  id
                  status
                  relativeUrl
                  resource
                  expirationDate
                  versionHash
                }
              }
            }
          }
        }
      }
    }
  `);
  
  return mapToProperty(data);
}

function mapToPropertyListItems(data?: any): PropertyListItem[] {
  const results = data?.allDh_Property?.results;

  if (!results) {
     return [];
  }

  return results.map((r: any) => (
     {...r}
  ))
}

function mapToProperty(data?: any): (Property | null) {
  const results = data?.allDh_Property?.results;

  if (!results || results.length === 0) {
     return null;
  }

  if (results.length > 1) {
    throw new Error('More than 1 item returned for slug.');
  }

  const property = results[0];

  const result: Property = {
    ...property,
    propertyToMainImage: mapAsset(property.dhPropertyToMainImage),
    propertyToImages: mapAssets(property.dhPropertyToImages),
    propertyToDocuments: mapAssets(property.dhPropertyToDocuments)
  };

  // Make sure the main image is the first image in the array.
  const mainImageArr = result.propertyToImages.filter(p => p.id === result.propertyToMainImage?.id);
  if (mainImageArr.length > 0) {
    const mainImage = mainImageArr[0];
    result.propertyToImages.splice(result.propertyToImages.indexOf(mainImage), 1);
    result.propertyToImages.splice(0, 0, mainImage);
  }

  return result;
}

function mapAssets(data?: any) {
  if (!data) {
     return [];
  }

  return data.results.map((r: any) => mapAsset(r));
}

function mapAsset(data?: any): (Asset | null) {
  if (!data) {
     return null;
  }

  let publicLinks: PublicLink[] = data.assetToPublicLink?.results?.map((p: any) => {
      return { ...p }
  }) || [];

  publicLinks = publicLinks.map(p => ({
    ...p,
    href: `${process.env.PUBLIC_LINK_URL}${p.relativeUrl}?v=${p.versionHash}`
  }));

  const thumbnails = publicLinks.filter(p => p.resource === "thumbnail");
  const previews = publicLinks.filter(p => p.resource === "preview");
  const downloadOriginal = publicLinks.filter(p => p.resource === "downloadOriginal");

  return {
    id: data.id,
    fileName: data.fileName,
    thumbnail: thumbnails.length > 0 ? thumbnails[0] : null,
    preview: previews.length > 0 ? previews[0] : null,
    downloadOriginal: downloadOriginal.length > 0 ? downloadOriginal[0] : null
  };
}