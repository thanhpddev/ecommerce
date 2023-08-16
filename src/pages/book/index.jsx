import { Outlet, useLocation } from "react-router-dom";
import ViewDetail from "../../components/Book/ViewDetail";
import { useEffect, useState } from "react";
import { callFetchBookById } from "../../services/api";

const BookPage = () => {
  const [dataBookById, setDataBookById] = useState("");
  const location = useLocation();

  // we can turn the location.search into URLSearchParams
  let params = new URLSearchParams(location.search);
  const id = params.get("id");

  useEffect(() => {
    setTimeout(() => {
      fetchBookById();
    }, 1000);
  }, [id]);

  const fetchBookById = async () => {
    const res = await callFetchBookById(id);
    if (res && res.data) {
      let images = [];
      if (res.data.thumbnail) {
        images.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            res.data.thumbnail
          }`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            res.data.thumbnail
          }`,
          originalClass: "original-image",
          thumbnailClass: "thumbnail-image",
        });
      }

      if (res.data.slider) {
        res.data.slider.map((item) => {
          images.push({
            original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
            thumbnail: `${
              import.meta.env.VITE_BACKEND_URL
            }/images/book/${item}`,
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image",
          });
        });
      }

      res.data.items = images;

      //
      setDataBookById(res.data);
    }
  };

  return (
    <>
      <ViewDetail dataBookById={dataBookById} />
    </>
  );
};
export default BookPage;
