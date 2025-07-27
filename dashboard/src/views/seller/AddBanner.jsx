//src\views\seller\AddBanner.jsx
import { useEffect, useState } from "react";
import { FaRegImage, FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { add_banner, get_banner, messageClear, update_banner } from "../../store/Reducers/bannerReducer";
import toast from "react-hot-toast";

const AddBanner = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const { loader, successMessage, errorMessage, banner } = useSelector((state) => state.banner);

  const [imageShow, setImageShow] = useState("");
  const [image, setImage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  const imageHandle = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setImage(files[0]);
      setImageShow(URL.createObjectURL(files[0]));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setImage(files[0]);
      setImageShow(URL.createObjectURL(files[0]));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const add = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("mainban", image);
    dispatch(add_banner(formData));
  };

  const update = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("mainban", image);
    dispatch(update_banner({ info: formData, bannerId: banner._id }));
  };

  useEffect(() => {
    dispatch(get_banner(productId));
  }, [productId, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {banner ? "Update Your Banner" : "Create Your Banner"}
          </h1>
          <p className="text-gray-600">
            Upload a stunning banner image to showcase your product
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Current Banner Display */}
          {banner && (
            <div className="relative group">
              <img
                className="w-full h-64 object-cover"
                src={banner.banner}
                alt="Current Banner"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-medium">Current Banner</p>
                  <p className="text-xs opacity-90">Click below to update</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-8">
            <form onSubmit={banner ? update : add}>
              {/* Upload Area */}
              <div className="mb-8">
                <label
                  className={`
                    relative flex flex-col items-center justify-center w-full h-64 
                    border-2 border-dashed rounded-2xl cursor-pointer
                    transition-all duration-300 group
                    ${isDragging 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }
                  `}
                  htmlFor="image"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  {!imageShow ? (
                    <>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className={`
                          p-4 rounded-full mb-4 transition-all duration-300
                          ${isDragging 
                            ? 'bg-blue-100 scale-110' 
                            : 'bg-gray-100 group-hover:bg-blue-100 group-hover:scale-105'
                          }
                        `}>
                          <FaCloudUploadAlt className={`
                            w-12 h-12 transition-colors duration-300
                            ${isDragging ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}
                          `} />
                        </div>
                        <p className="mb-2 text-lg font-medium text-gray-700">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG or WEBP (MAX. 10MB)
                        </p>
                        <p className="mt-3 text-xs text-gray-400">
                          Recommended: 1200x400px for best results
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="relative w-full h-full group">
                      <img 
                        className="w-full h-full object-cover rounded-xl" 
                        src={imageShow} 
                        alt="Preview" 
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                        <div className="text-center text-white">
                          <FaRegImage className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm font-medium">Click to change image</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <input 
                    required 
                    onChange={imageHandle} 
                    className="hidden" 
                    type="file" 
                    id="image" 
                    accept="image/*"
                  />
                </label>
              </div>

              {/* Success Indicator */}
              {imageShow && (
                <div className="mb-6 flex items-center justify-center text-green-600">
                  <FaCheckCircle className="mr-2" />
                  <span className="text-sm font-medium">Image ready to upload</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                disabled={loader}
                className={`
                  w-full py-4 px-6 rounded-xl font-semibold text-white
                  transition-all duration-300 transform
                  ${loader 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                  }
                `}
              >
                {loader ? (
                  <div className="flex items-center justify-center">
                    <CircularProgress size={24} className="text-white mr-2" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    {banner ? "Update Banner" : "Upload Banner"}
                  </span>
                )}
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Need help? Check our{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  banner guidelines
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="mt-6 bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Pro Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Use high-quality images with good lighting for best results
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Keep important content in the center - edges might be cropped on mobile
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Avoid text-heavy banners - let your product shine
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddBanner;
