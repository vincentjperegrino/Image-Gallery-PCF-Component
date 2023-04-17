# Image-Gallery-PCF-Component

# **Backup Plan**

<br />

> Powerapps Environment: **_Kation D365 Sales Enterprise Sandbox_** 
1. Export the following Dataverse Tables:  
   - **Products**  
   - **Product Image**
1. Export the following Solution:  
   - **MOO Hub**

<br />

> Azure Active Directory: **_KTIMOO WebAPI_** 
1. On the Azure Portal, navigate to **Azure Active Directory > App registrations > KTIMOO WebAPI > Authentication**.
1. Backup the **Redirect URIs** under **Single-Page Application**.

<br />

> Azure Blob Storage: **_ktimoostorage_** 
1. On the Azure Portal, navigate to **Storage Accounts > ktimoostorage > Containers**, backup the following container:  
   - **product-image**  
1. Back to the Azure Portal, navigate to **Storage Accounts > ktimoostorage > Resource Sharing (CORS)**, backup the **Blob Service** CORS rules.

<br />

# **Implementation Plan**

<br />

> Azure Active Directory: Configuration
1. On the Azure Portal, navigate to **Azure Active Directory > App registrations > KTIMOO WebAPI > Authentication**.
1. Add the following **Redirect URIs** under **Single-Page Application**:  

    ```
    https://ktisalessandbox.crm5.dynamics.com/main.aspx  
    ```
   This is the home page URL of your Model-Driven App
1. Then click **Save** for changes to take effect.

<br />

> Azure Blob Storage: Configuration
1. On the Azure Portal, navigate to **Storage Accounts > ktimoostorage > + container**.
1. Enter the following details to create a new container:

   | **Name** | **Public access level** |  
   |-----------|:-----------:|
   | **product-image** | **Private (no anonymous access)** |
   Then click **Create**.
1. Back to the Azure Portal, navigate to **Storage Accounts > ktimoostorage > Resource Sharing (CORS)**
1. Enter the following details to under the **Blob Service** tab:

   | **Allowed origins** | **Allowed methods** | **Allowed headers** | **Exposed headers** | **Max age** |
   |-----------|:-----------:|-----------|:-----------:|:-----------:|
   | **https://ktisalessandbox.crm5.dynamics.com** | **DELETE, OPTIONS, PUT** | **content-type,x-ms-blob-content-type,x-ms-blob-type,x-ms-client-request-id,x-ms-version,x-ms-delete-snapshots** | **x-ms-request-id,x-ms-client-request-id,Server,x-ms-version,x-ms-content-crc64,Content-MD5,Last-Modified,ETag,x-ms-request-server-encrypted,Content-Length,Date,Transfer-Encoding** | **200** |
   Then click **Save**.

<br />

> Publish PCF Component
1. Open source code in VS Code and open up a new terminal, then type the following command:  

    ```
    pac auth create --name ImageGallery --url https://ktisalessandbox.crm5.dynamics.com/
    ```
    This will create an authentication profile to the CDS instance.
1. And then type the following command to push the code components to the CDS instance:  
    ```
    pac pcf push --publisher-prefix 'Image Gallery'  
    ```

<br />

> Import and add PCF Component to Model-Driven App
1. On the Powerapps Environment: **_Kation D365 Sales Enterprise Sandbox_**, Navigate to **Solutions > MOO Hub > Product > Forms > Product Information**
1. On the sidebar, Navigate to **Components > Get More Components**
1. Select **_Image Gallery_** from the list and then click the **Add** button.
1. Click **Images** tab on the form and then drag the **_Image Gallery_** component to the form.
1. Click **Save**, then **Publish** to finalize changes.

<br />

> Testing Deployed Component in the CRM Environment
1. On the Powerapps Environment: **_Kation D365 Sales Enterprise Sandbox_**, Navigate to **Apps > MOO Hub**. This will redirect you to another tab on the browser.
1. On the **MOO Hub** Application, Navigate to **Products > Add Product > Images**. There should be no images shown from the list because there is no Product ID yet from the **Summary** tab.

<br />

# **Rollback Plan**

<br />

> Powerapps Environment: **_Kation D365 Sales Enterprise Sandbox_** 
1. Import the following Dataverse Tables from the backup you created:  
   - **Products**  
   - **Product Image**
1. Import the following Solution from the backup you created:  
   - **MOO Hub**

<br />

> Azure Active Directory: **_KTIMOO WebAPI_** 
1. On the Azure Portal, navigate to **Azure Active Directory > App registrations > KTIMOO WebAPI > Authentication**.
1. Insert the previously backed up **Redirect URIs** under **Single-Page Application**.

<br />

> Azure Blob Storage: **_ktimoostorage_** 
1. On the Azure Portal, navigate to **Storage Accounts > ktimoostorage > Containers**, delete then re-create the following container with the previously backed up container:  
   - **product-image**  
1. Back to the Azure Portal, navigate to **Storage Accounts > ktimoostorage > Resource Sharing (CORS)**, modify the **Blob Service** CORS rules with the previously backed up values.

<br />