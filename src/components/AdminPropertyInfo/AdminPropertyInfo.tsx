import PhotoGallery from "../PhotoGallery/PhotoGallery";

const AdminPropertyInfo = ({ data }: any) => {

  return (
    <>
      <div className="row">
        <div className="col">
          <PhotoGallery photos={data?.photos} />
        </div>
      </div>

      <div className="row my-3">
        <div
          className="col"
          dangerouslySetInnerHTML={{
            __html: data?.description || "---",
          }}
        ></div>
      </div>
    </>
  );
};

export default AdminPropertyInfo;
