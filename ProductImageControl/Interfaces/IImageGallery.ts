interface IImageGallery {
    image: {
        odata_context?: string;
        odata_etag?: string;
        kti_imagename: string;
        _owningbusinessunit_value?: string;
        _ownerid_value?: string;
        statuscode?: string;
        _kti_product_value: string;
        _createdby_value?: string;
        _modifiedby_value?: string;
        _owninguser_value?: string;
        createdon?: string;
        versionnumber?: number;
        kti_producturl: string;
        kti_primaryimage: boolean;
        kti_productimageid: string;
        modifiedon?: string;
        statecode?: number;
        importsequencenumber?: number;
        overriddencreatedon?: string;
        _owningteam_value?: string;
        timezoneruleversionnumber?: number;
        _modifiedonbehalfby_value?: string;
        utcconversiontimezonecode?: string;
        _createdonbehalfby_value?: string;
    }[]
};

export default IImageGallery;