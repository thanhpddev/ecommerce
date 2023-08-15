import { Outlet, useLocation } from "react-router-dom";

const BookPage = () => {
  const location = useLocation();

  // we can turn the location.search into URLSearchParams
  let params = new URLSearchParams(location.search);
  const id = params.get("id");
  console.log(id);

  return <>book page</>;
};
export default BookPage;
