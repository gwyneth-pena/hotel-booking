import { Dialog } from "primereact/dialog";
import axios from "axios";
import clsx from "clsx";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import config from "../../config";
import ImageUploading from "react-images-uploading";
import { supabase } from "../../utils/supabase";
import "./EditProperty.css";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const EditProperty = ({ hideModal, emitSavedData, data }: any) => {
  const apiUrl = config.apiUrl;
  const toast: any = useRef(null);

  const [images, setImages] = useState<any>([]);
  const [formState, setFormState] = useState({
    name: "",
    type: "",
    description: "",
    city: "",
    address: "",
    rating: 5,
    isLoading: false,
  });
  const [toDeletedInBucket, setToBeDeletedInBucket] = useState<any>([]);

  const propertyTypeOptions = [
    "Hotel",
    "Apartment",
    "Resort",
    "Villa",
    "Holiday Home",
    "Campsite",
    "Condo",
  ];

  useEffect(() => {
    initializeFormData(data);
  }, [data]);

  const initializeFormData = (data: any) => {
    setFormState((prev) => ({
      ...prev,
      name: data.name || "",
      type: data.type || "",
      description: data.description || "",
      city: data.city || "",
      address: data.address || "",
      rating: data.rating ?? 5,
    }));
    setImages(data.photos);
  };

  const onImageUpload = (imageList: any[]) => {
    setImages(imageList);
  };

  const onImageRemove = (index: number) => {
    const image = images[index];
    if (!image.file) {
      const url = image.substring(image.indexOf("uploads"));
      setToBeDeletedInBucket((prevItems: any) => [...prevItems, url]);
    }
    const updatedImages = images.filter((_: any, i: any) => i !== index);
    setImages(updatedImages);
  };

  const uploadImage = async (file: File) => {
    try {
      if (!file) return;

      const time = new Date().getTime();
      const filePath = `uploads/${time}-${file.name}`;

      const { data, error } = await supabase.storage
        .from("photos")
        .upload(filePath, file, {
          upsert: true,
        });
      if (error) {
        console.error(error);
        return;
      } else {
        return data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteImageFromBucket = async (url: string) => {
    try {
      if (!url) return;

      const { error } = await supabase.storage.from("photos").remove([url]);

      if (error) {
        console.error(error);
        return;
      } else {
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const submit = async (e: Event) => {
    e.preventDefault();

    try {
      setFormState((prev) => ({ ...prev, isLoading: true }));

      const uploadPromises = images
        .filter((img: any) => img.file)
        .map((imageWrapper: any) => {
          return uploadImage(imageWrapper.file);
        });

      const deleteImagesPromises = toDeletedInBucket.map((url: string) => {
        return deleteImageFromBucket(url);
      });

      const supabaseUrl = config.supabaseUrl;
      const uploadedImages = (
        await Promise.all([...uploadPromises, ...deleteImagesPromises])
      )
        .filter((img: any) => img?.fullPath)
        .map((img: any) => `${supabaseUrl}/storage/v1/object/${img?.fullPath}`);

      const propertyData = {
        photos: images.filter((img: any) => !img.file).concat(uploadedImages),
        name: formState.name,
        description: formState.description,
        address: formState.address,
        city: formState.city,
        rating: formState.rating,
        type: formState.type,
      };

      const hotelRes = await axios.patch(`${apiUrl}/hotels/${data._id}`, {
        ...propertyData,
      });
      if (hotelRes.status === 200) {
        toast.current.show({
          severity: "success",
          detail: "Property updated successfully.",
          life: 3000,
        });
        setTimeout(() => {
          emitSavedData();
          hideModal();
        }, 500);
      }
    } catch (e) {
      console.error(e);
      toast.current.show({
        severity: "error",
        detail: "Something went wrong.",
        life: 5000,
      });
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <>
      <Dialog
        visible={true}
        className="dialog-75"
        onHide={() => {
          hideModal();
        }}
      >
        <div className="row px-3 w-100">
          <div className="col-12 mx-3">
            <h4 className="fw-bold mb-5">Edit Property</h4>
          </div>
          <form
            className="px-5 edit-property"
            onSubmit={(e: any) => {
              submit(e);
            }}
          >
            <div className="row">
              <div className="form-group mb-4 col-6">
                <label htmlFor="name" className="fw-bold mb-2">
                  Name
                </label>
                <input
                  value={formState.name}
                  type="name"
                  className="form-control"
                  name="name"
                  id="name"
                  placeholder="Enter property name"
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group mb-4 col-6">
                <label htmlFor="type" className="fw-bold mb-2">
                  Type
                </label>
                <select
                  value={formState.type}
                  className="form-control"
                  name="type"
                  id="type"
                  onChange={(e) =>
                    setFormState({ ...formState, type: e.target.value })
                  }
                  required
                >
                  <option value="">Select property type</option>
                  {propertyTypeOptions.map((propertyType: any, idx: number) => {
                    return (
                      <option key={idx} value={propertyType}>
                        {propertyType}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-group mb-4 col-12">
                <label htmlFor="description" className="fw-bold mb-2">
                  Description
                </label>
                <ReactQuill
                  theme="snow"
                  value={formState.description}
                  id="description"
                  placeholder="Edit description"
                  onChange={(value) =>
                    setFormState({ ...formState, description: value })
                  }
                />
              </div>
              <div className="form-group mb-4 col-4">
                <label htmlFor="Location" className="fw-bold mb-2">
                  Location
                </label>
                <input
                  value={formState.city}
                  className="form-control"
                  name="location"
                  id="location"
                  placeholder="Enter location (e.g. Tagaytay, Manila, Boracay) "
                  onChange={(e) =>
                    setFormState({ ...formState, city: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group mb-4 col-4">
                <label htmlFor="address" className="fw-bold mb-2">
                  Address
                </label>
                <input
                  value={formState.address}
                  className="form-control"
                  name="address"
                  id="address"
                  placeholder="Enter Address"
                  onChange={(e) =>
                    setFormState({ ...formState, address: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group mb-4 col-4">
                <label htmlFor="rating" className="fw-bold mb-2">
                  Rating
                </label>
                <input
                  value={formState.rating}
                  type="number"
                  min={0}
                  max={5}
                  step={0.01}
                  className="form-control"
                  name="rating"
                  id="rating"
                  placeholder="Enter Rating"
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      rating: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div className="form-group mb-4 col-12">
                <label htmlFor="Photos" className="fw-bold mb-2">
                  Photos
                </label>
                <ImageUploading
                  multiple
                  value={images}
                  onChange={onImageUpload}
                  dataURLKey="data_url"
                >
                  {({ imageList, onImageUpload }) => (
                    <div>
                      <button
                        type="button"
                        className="btn btn-secondary photo mb-2"
                        onClick={onImageUpload}
                      >
                        Add
                      </button>
                      <div className="d-flex flex-wrap gap-3">
                        {imageList.map((image, index) => (
                          <div key={index} className="text-center">
                            <img
                              src={image.data_url || image}
                              alt={image.file?.name}
                              style={{
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                            <br />
                            <button
                              type="button"
                              className="btn photo mt-1"
                              onClick={() => onImageRemove(index)}
                            >
                              <i className="ti ti-x"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </ImageUploading>
              </div>
            </div>

            <button
              className={clsx("btn btn-dark-blue mb-5 w-100", {
                "p-2": formState.isLoading,
              })}
              type="submit"
              disabled={formState.isLoading}
            >
              {formState.isLoading ? (
                <img className="loader" src="/images/loader.gif" />
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
        <Toast className="p-4" ref={toast} />
      </Dialog>
    </>
  );
};

export default EditProperty;
