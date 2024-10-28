# Example

An example of a package manifest using the Swift Package Registry: [Package.swift](./Package.swift)

## Usage

1. Run registry server using [README.md](../README.md)
1. Add the registry as a dependency to your package

   ```sh
   swift package-registry set http://localhost:8000 --allow-insecure-http
   ```

1. Build the package

    ```bash
    swift build
    ```
