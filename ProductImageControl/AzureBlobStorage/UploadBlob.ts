import { BlobServiceClient, BlockBlobParallelUploadOptions, ContainerClient} from '@azure/storage-blob';

export interface IBlobConfig {
  storageName: string;
  storagePath: string;
  sasToken: string;
}

/**
 * Uploads an image stored in azure blob storage. 
 * Returns none if operation was successful
 */
const createBlobInContainer = async (containerClient: ContainerClient, file: File, productGUID: string) => {
  
  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(productGUID + '_' + file.name);

  // set mimetype as determined from browser with file upload control
  var options : BlockBlobParallelUploadOptions = { blobHTTPHeaders: { blobContentType: file.type } };

  // upload file
  await blobClient.uploadData(file, options);
}

/**
 * Uploads an image stored in azure blob storage. 
 * Returns blob URL if operation was successful
 */
const uploadFileToBlob = async (file: File | null, productGUID: string, blobConfig: IBlobConfig): Promise<string> => {
  if (!file) return await Promise.resolve("");

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${blobConfig.storageName}.blob.core.windows.net/?${blobConfig.sasToken}`
  );

  const containerClient: ContainerClient = blobService.getContainerClient(blobConfig.storagePath);

  // upload file
  await createBlobInContainer(containerClient, file, productGUID);

  return await Promise.resolve(`https://${blobConfig.storageName}.blob.core.windows.net/${blobConfig.storagePath}/${productGUID}_${file.name}`);
};

export default uploadFileToBlob;

