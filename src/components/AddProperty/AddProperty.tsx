import { Dialog } from "primereact/dialog";
import { useRef, useState } from "react";
import ImageUploading from "react-images-uploading";
import "./AddProperty.css";
import { supabase } from "../../utils/supabase";
import config from "../../config";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";
import axios from "axios";
import { Toast } from "primereact/toast";
import clsx from "clsx";

const AddProperty = ({ hideModal, emitSavedData }: any) => {
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

  const propertyTypeOptions = [
    "Hotel",
    "Apartment",
    "Resort",
    "Villa",
    "Holiday Home",
    "Campsite",
    "Condo",
  ];

  const onImageUpload = (imageList: any[]) => {
    setImages(imageList);
  };

  const onImageRemove = (index: number) => {
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

  const submit = async (e: Event) => {
    e.preventDefault();

    try {
      setFormState((prev) => ({ ...prev, isLoading: true }));
      const uploadPromises = images.map((imageWrapper: any) => {
        return uploadImage(imageWrapper.file);
      });

      const supabaseUrl = config.supabaseUrl;
      const uploadedImages = (await Promise.all(uploadPromises)).map(
        (img: any) => `${supabaseUrl}/storage/v1/object/${img.fullPath}`
      );

      const propertyData = {
        photos: uploadedImages,
        name: formState.name,
        description: formState.description,
        address: formState.address,
        city: formState.city,
        rating: formState.rating,
        type: formState.type,
      };

      const hotelRes = await axios.post(`${apiUrl}/hotels`, {
        ...propertyData,
      });
      if (hotelRes.status === 200) {
        toast.current.show({
          severity: "success",
          detail: "Property added successfully.",
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
            <h4 className="fw-bold mb-5">Add Property</h4>
          </div>
          <form
            className="px-5 add-property"
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
                <textarea
                  value={formState.description}
                  className="form-control"
                  name="description"
                  id="description"
                  placeholder="Add description"
                  onChange={(e) =>
                    setFormState({ ...formState, description: e.target.value })
                  }
                  required
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
                              src={image.data_url}
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
      {formState.isLoading && <LoadingOverlay />}
    </>
  );
};

export default AddProperty;
