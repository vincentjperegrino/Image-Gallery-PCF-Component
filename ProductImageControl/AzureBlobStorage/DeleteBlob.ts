import { BlobServiceClient, BlobDeleteOptions, ContainerClient} from '@azure/storage-blob';

export interface IBlobConfig {
  storageName: string;
  storagePath: string;
  sasToken: string;
}

/**
 * Deletes the blob image stored in azure blob storage. 
 * Returns none if operation was successful
 */
const deleteBlobIfItExists = async (containerClient: ContainerClient, blobName: string) => {
    // include: Delete the base blob and all of its snapshots.
    // only: Delete only the blob's snapshots and not the blob itself.
    const options: BlobDeleteOptions = {
        deleteSnapshots: 'include' // or 'only'
    }
    // Create blob client from container client
    const blockBlobClient = await containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.deleteIfExists(options);
}

/**
 * Deletes the blob image stored in azure blob storage. 
 * Returns empty promise string[] if operation was successful
 */
const deleteFromBlob = async (blobName: string | null, blobConfig: IBlobConfig): Promise<string[]> => {
  if (!blobName) return [];

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${blobConfig.storageName}.blob.core.windows.net/?${blobConfig.sasToken}`
  );

  const containerClient: ContainerClient = blobService.getContainerClient(blobConfig.storagePath);

  // upload file
  await deleteBlobIfItExists(containerClient, blobName);

  return [];
};

export default deleteFromBlob;

