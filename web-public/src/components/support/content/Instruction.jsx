import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { RxQuestionMarkCircled } from "react-icons/rx";

const Instruction = () => {
  return (
    <div className="Content-alignedMid">
      <div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">
              <div className=" flex gap-3">
                <RxQuestionMarkCircled size={30} color="orange" />
                <span className="text-green-600">
                  Làm thế nào để chọn sản phẩm vào giỏ hàng?
                </span>
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <p className="pb-3">
              - Để thêm sản phẩm vào giỏ hàng, bạn chỉ cần chọn sản phẩm mong
              muốn, sau đó nhấn nút “Mua ngay” hoặc “Thêm vào giỏ” để sản phẩm
              được lưu trữ trong giỏ hàng của bạn.
            </p>
            <p>
              <span className="font-semibold">* Lưu ý quan trọng</span>: Trước
              khi thực hiện bất kỳ thao tác nào, bạn cần phải đăng nhập vào tài
              khoản của mình để đảm bảo quá trình mua sắm diễn ra thuận lợi và
              an toàn. Nếu bạn chưa có tài khoản, đừng quên đăng ký để tận hưởng
              các tiện ích ưu đãi!
            </p>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography component="span">
              <div className=" flex gap-3">
                <RxQuestionMarkCircled size={30} color="orange" />
                <span className="text-green-600">
                  Cách tìm kiếm cửa hàng để đặt hàng trên website?
                </span>
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex flex-col gap-3">
              <p>
                - Khách hàng có thể tìm kiếm cửa hàng gần nhà hoặc cửa hàng hoa
                Thang Long Farm mình yêu thích để mua hàng.
              </p>
              <p>
                - Giá bán và danh mục sản phẩm tại các cửa hàng là khác nhau và
                có thể có sự chênh lệch.
              </p>
              <p>
                - Để tìm cửa hàng, bạn có thể dùng thanh công cụ chọn "tìm cửa
                hàng" ở tay phải màn hình.
              </p>
              <p>
                - Mọi thông tin liên hệ vui lòng gọi Hotline 18001234 (miễn phí
                cước gọi) để được hỗ trợ.
              </p>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography component="span">
              <div className=" flex gap-3">
                <RxQuestionMarkCircled size={30} color="orange" />
                <span className="text-green-600">
                  Làm thế nào để tìm kiếm sản phẩm trên website?
                </span>
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex flex-col gap-3">
              <p>
                - Sản phẩm trên Thang Long Farm được cập nhật liên tục và đổi
                mới theo thời gian{" "}
              </p>
              <p>
                - Bạn có thể tìm kiếm sản phẩm mong muốn bằng một trong những
                phương thức sau:{" "}
              </p>
              <p className="font-semibold">1. Tìm theo Phân loại ngành hàng</p>
              <p className="font-semibold">2. Tìm theo Công cụ tìm kiếm </p>
              <p>
                - Chức năng tìm kiếm sản phẩm được thiết kế trên thanh công cụ
                đầu trang. Bạn chỉ việc gõ tên của sản phẩm mong muốn và lập tức
                hệ thống sẽ gợi ý cho bạn tất cả các sản phẩm có liên quan.{" "}
              </p>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography component="span">
              <div className=" flex gap-3">
                <RxQuestionMarkCircled size={30} color="orange" />
                <span className="text-green-600">
                  Tại sao đơn hàng lại bị hủy?
                </span>
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex flex-col gap-3">
              <p>- Đơn hàng của quý khách sẽ bị hủy trong 2 trường hợp</p>
              <p className="font-semibold">Th1.Khách hàng không nhận hàng.</p>
              <p className="font-semibold">
                Th2.Có vấn đề xảy ra đối với sản phẩm.{" "}
              </p>
              <p>
                Lưu ý: Bất kể vì lý do gì nếu đơn hàng của bạn bị hủy đội ngũ
                Thăng Long Far sẽ liên hệ với bạn để giải quyết trước khi đơn
                hàng bị hủy trên hệ thống.
              </p>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography component="span">
              <div className=" flex gap-3">
                <RxQuestionMarkCircled size={30} color="orange" />
                <span className="text-green-600">
                  Đơn hàng sau khi đặt tại website sẽ được xử lý như thế nào?
                </span>
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex flex-col gap-3">
              <p>
                - Sau khi đơn hàng của khách hàng đã được xác nhận, đơn hàng sẽ
                được chuyển đến cửa hàng gần nhất với địa chỉ giao hàng của Quý
                khách
              </p>
              <p>
                - Nhân viên tư vấn sẽ gọi điện xác nhận nếu có bất kì thay đổi
                nào của đơn hàng.Sau đó, nhân viên tại cửa hàng sẽ tiến hành
                chuẩn bị và gửi hàng cho Quý khách trong thời gian đã được cam
                kết.
              </p>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default Instruction;
