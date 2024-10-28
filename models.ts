export interface SwiftPackage {
  id: string;
  version: string;
  resources: SwiftPackageResource[];
  metadata: Record<string, unknown>;
  publishedAt: string;
}

export interface SwiftPackageMetadata {
  author?: {
    name: string;
    email?: string;
    description?: string;
    organization?: {
      name: string;
      email?: string;
      description?: string;
      url?: string;
    };
    url?: string;
  };
  description?: string;
  licenseURL?: string;
  originalPublicationTime?: string;
  readmeURL?: string;
  repositoryURLs?: string[];
}

export interface SwiftPackageResource {
  name: string;
  type: string;
  checksum: string;
}
