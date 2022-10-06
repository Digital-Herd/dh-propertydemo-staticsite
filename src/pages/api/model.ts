export interface PropertyListItem {
  id: string;
  slug: string;
}

export interface Property {
  title: MultiLanguageString;
  description: MultiLanguageString;
  price: number;
  type: string;
  built: number;
  sold: boolean;
  soldOn: Date;
  address: string;
  cityState: string;
  zIP: string;
  slug: string;
  propertyToMainImage: Asset;
  propertyToImages: Asset[];
  propertyToDocuments: Asset[];
}

export interface MultiLanguageString {
  [culture: string]: string
}

export interface Asset {
  id: string;
  fileName: string;
  thumbnail: PublicLink | null;
  preview: PublicLink | null;
  downloadOriginal: PublicLink | null;
}

export interface PublicLink {
  resource: string;
  relativeUrl: string;
  versionHash: string;
  status: string;
  href: string;
}
