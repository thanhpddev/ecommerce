import { Outlet, useLocation } from "react-router-dom";
import ViewDetail from "../../components/Book/ViewDetail";

const BookPage = () => {
  const location = useLocation();

  // we can turn the location.search into URLSearchParams
  let params = new URLSearchParams(location.search);
  const id = params.get("id");
  // console.log(id);

  return (
    <>
      <ViewDetail />
    </>
  );
};
export default BookPage;
