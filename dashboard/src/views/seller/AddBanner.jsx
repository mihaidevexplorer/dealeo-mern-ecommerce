import { useEffect, useState } from "react";
import { FaRegImage } from "react-icons/fa";
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
    <div className="px-4 py-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-gray-800 font-semibold text-2xl mb-6 text-center">Add or Update Banner</h1>
      <div className="border border-gray-200 rounded-lg p-6">
        {!banner && (
          <form onSubmit={add}>
            <div className="mb-6">
              <label
                className="flex justify-center items-center flex-col h-48 w-full cursor-pointer border border-dashed hover:border-blue-500 bg-gray-100 rounded-md"
                htmlFor="image"
              >
                <span className="text-6xl text-blue-500 mb-2"> 
                  <FaRegImage />
                </span>
                <span className="text-blue-700 font-medium text-lg">Select Banner Image</span> 
              </label>
              <input required onChange={imageHandle} className="hidden" type="file" id="image" />
            </div>

            {imageShow && (
              <div className="mb-6">
                <img className="w-full h-48 object-cover rounded-md shadow-md" src={imageShow} alt="Preview" />
              </div>
            )}

            <button
              disabled={loader}
              className="bg-blue-600 w-full text-white rounded-md px-6 py-3 hover:bg-blue-700 disabled:bg-gray-400 text-lg font-medium"
            >
              {loader ? <CircularProgress className="w-6 h-6 mx-auto" /> : "Add Banner"} 
            </button>
          </form>
        )}

        {banner && (
          <div>
            <div className="mb-6">
              <img
                className="w-full h-48 object-cover rounded-md shadow-md"
                src={banner.banner}
                alt="Current Banner"
              />
            </div>

            <form onSubmit={update}>
              <div className="mb-6">
                <label
                  className="flex justify-center items-center flex-col h-48 w-full cursor-pointer border border-dashed hover:border-blue-500 bg-gray-100 rounded-md"
                  htmlFor="image"
                >
                  <span className="text-6xl text-blue-500 mb-2">
                    <FaRegImage />
                  </span>
                  <span className="text-blue-700 font-medium text-lg">Select New Banner Image</span>
                </label>
                <input required onChange={imageHandle} className="hidden" type="file" id="image" />
              </div>

              {imageShow && (
                <div className="mb-6">  {/* Increased margin bottom */}
                  <img className="w-full h-48 object-cover rounded-md shadow-md" src={imageShow} alt="Preview" />
                </div>
              )}

              <button
                disabled={loader}
                className="bg-blue-600 w-full text-white rounded-md px-6 py-3 hover:bg-blue-700 disabled:bg-gray-400 text-lg font-medium" 
              >
                {loader ? <CircularProgress className="w-6 h-6 mx-auto" /> : "Update Banner"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBanner;