export interface SwiftPackageReleases {
  releases: Record<string, { url: string }>;
}

export interface SwiftPackage {
  id: string;
  version: string;
  resources: SwiftPackageResource[];
  metadata: SwiftPackageMetadata;
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

export function getReleasesFromPackages(
  packages: SwiftPackage[],
  baseUrl: string,
): SwiftPackageReleases {
  return {
    releases: packages.reduce((acc, pkg) => {
      acc[pkg.version] = {
        url: `${baseUrl}/${pkg.version}`,
      };
      return acc;
    }, {} as Record<string, string>),
  };
}
