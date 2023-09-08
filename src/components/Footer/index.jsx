import { BsGlobe, BsTelephoneForward } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";

import "./footer.scss";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-info">
          <h3>BOOKSHOP - SÁCH GÌ CŨNG CÓ, MUA HẾT Ở BOOKSHOP</h3>
          <p>
            Book Shop - website mua sắm trực tuyến thú vị, tin cậy, an toàn và
            miễn phí! Book Shop là nền tảng giao dịch trực tuyến hàng đầu ở Đông
            Nam Á, có trụ sở chính ở Việt Nam, đã có mặt ở khắp các khu vực
            Singapore, Malaysia, Indonesia, Thái Lan, Philippines, Đài Loan,
            Brazil, México & Colombia. Với sự đảm bảo của Book Shop, bạn sẽ mua
            sách trực tuyến an tâm và nhanh chóng hơn bao giờ hết!
          </p>
          <h4>MUA SẮM VÀ BÁN HÀNG ONLINE ĐƠN GIẢN, NHANH CHÓNG VÀ AN TOÀN</h4>
          <p>
            Nếu bạn đang tìm kiếm một trang web để mua sách trực tuyến thì Book
            Shop là một sự lựa chọn tuyệt vời dành cho bạn. Book Shop là trang
            thương mại điện tử cho phép người mua và người bán tương tác và trao
            đổi dễ dàng thông tin về sản phẩm. <br />
            Do đó, việc mua bán trên Book Shop trở nên nhanh chóng và đơn giản
            hơn. Bạn có thể trò chuyện trực tiếp với nhà bán hàng để hỏi trực
            tiếp về mặt hàng cần mua. Còn nếu bạn muốn tìm mua những dòng sản
            phẩm chính hãng, uy tín, Book Shop chính là sự lựa chọn lí tưởng
            dành cho bạn. Để bạn có thể dễ dàng khi tìm hiểu và sử dụng sản
            phẩm, Book Shop - thông tin chính thức của Book Shop - sẽ giúp bạn
            có thể tìm được cho mình các kiến thức về xu hướng thời trang,
            review công nghệ, mẹo làm đẹp, tin tức tiêu dùng và deal giá tốt bất
            ngờ.
          </p>
        </div>
        <div className="footer-contact">
          <div className="card card-contact">
            <h4>LIÊN HỆ</h4>
            <p>
              <BsGlobe />{" "}
              <Link to="https://github.com/thanhpddev" target="blank">
                https://github.com/thanhpddev
              </Link>
            </p>
            <p>
              <AiOutlineMail />
              <Link to="mailto:phandacthanhit@gmail.com" target="blank">
                phandacthanhit@gmail.com
              </Link>
            </p>
            <p>
              <BsTelephoneForward />

              <Link to="tel:0335269723" target="blank">
                <span>0335.269.723</span>
              </Link>
            </p>
          </div>
          <div className="card card-info">
            <h4>THÔNG TIN</h4>
            <ul>
              <li>Giới Thiệu</li>
              <li>Hệ Thống Cửa Hàng</li>
              <li>Điều Khoản Sử Dụng</li>
              <li>Chính Sách Bảo Mật</li>
              <li>Chính Sách Đổi Trả/Hoàn Tiền</li>
            </ul>
          </div>
          <div className="card card-customer">
            <h4>CHĂM SÓC KHÁCH HÀNG</h4>
            <ul>
              <li>Trung Tâm Trợ Giúp</li>
              <li>Hướng Dẫn Mua Hàng</li>
              <li>Vận Chuyển</li>
              <li>Chính Sách Bảo Hành</li>
              <li>Chăm Sóc Khách Hàng</li>
            </ul>
          </div>
          <div className="card card-category">
            <h4>DANH MỤC SẢN PHẨM</h4>
            <ul>
              <li>Arts</li>
              <li>Business</li>
              <li>Comics</li>
              <li>Cooking</li>
              <li>Entertainment</li>
              <li>History</li>
              <li>Music</li>
              <li>Sports</li>
              <li>Teen</li>
              <li>Travel</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="copyright">Copyright © 2023 - All Rights Reserved.</div>
    </footer>
  );
};

export default Footer;
