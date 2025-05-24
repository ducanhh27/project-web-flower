import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { RxQuestionMarkCircled } from "react-icons/rx";

const Shipment = () => {
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
                <span className="text-green-600 ">
                  Cách giải quyết trong trường hợp phát sinh chậm trễ khi giao
                  hàng?
                </span>
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <p className="pb-3">
              - Trường hợp chậm trễ so với thời gian đã định, bộ phận CSKH của
              website TMĐT bán hàng Thang Long Farm sẽ chủ động liên lạc đến
              khách hàng sớm nhất có thể thông qua số điện thoại đặt hàng để
              thông báo nguyên nhân và thông tin kịp thời về thời gian giao hàng
              đến quý khách.
            </p>
            <p>
              - Trường hợp giao hàng chậm trễ so với thời gian đã định, khách
              hàng vui lòng chờ thêm một ít thời gian để nhân viên giao hàng đến
              hoặc có quyền hủy nhận hàng nếu thời gian chờ đợi quá lâu.
            </p>
            <p>
              -Trường hợp khách hàng hủy nhận hàng vì lý do giao hàng chậm trễ,
              website TMĐT bán hàng Thang Long Farm sẽ hoàn trả lại tiền cho
              khách hàng trong thời gian theo quy định.
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
                  Các hình thức giao hàng ?
                </span>
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex flex-col gap-3">
              <p>- Tại Thang Long Farm có 2 phương thức giao hàng bao gồm:</p>
              <p>
                <span className="font-semibold">1.Giao hàng tại nhà</span>: Căn
                cứ vào thông tin địa chỉ giao hàng mà bạn cung cấp. Thang Long
                Farm sẽ tiến hành giao hàng cho bạn trong thời gian cam kết.
                Hàng hóa có thể được giao bởi nhân viên cửa hàng hoặc bởi đối
                tác vận chuyển.
              </p>
              <p>
                <span className="font-semibold ">
                  2.Giao hàng ngay tại tại cửa hàng bạn chọn
                </span>
                : Căn cứ vào cửa hàng bạn chọn, nhân viên tại cửa hàng sẽ thực
                hiện việc soạn hàng hóa và bảo quản tại cửa hàng để bạn có thể
                đến nhận một cách nhanh chóng và thuận tiện nhất.(
                <span className="text-red-700 italic">
                  Lưu ý: Liên hệ chúng tôi trước qua hotline nếu bạn muốn lấy
                  tại cửa hàng
                </span>
                )
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
                  Thông tin chi tiết về hình thức và chi phí giao hàng tận nơi?
                </span>
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex flex-col gap-3">
              <p>
                <span className="font-semibold">- Phạm vi phục vụ</span>: Giao
                hàng trong phạm vi bán kính 20km từ cửa hàng bạn chọn mua hoa.
                Những trường hợp giao hàng đặc biệt và khoảng cách xa hơn 20km,
                bạn vui lòng liên hệ trực tiếp tổng đài 1800 1234 (Miễn phí cuộc
                gọi) để được hỗ trợ Chi phí giao hàng tùy thuộc vào khoảng cách,
                giá trị đơn hàng và loại sản phẩm (có tải trọng riêng) mà bạn
                đặt mua, Thăng Long Farm sẽ lựa chọn loại phương tiện phù hợp
                với chi phí và chất lượng tốt nhất dành cho Quý khách.
              </p>
              <p>
                <span className="font-bold">- Chi phí vận chuyển</span> ={" "}
                <span className="font-semibold">
                  Phí vận chuyển theo khoảng cách (1)
                </span>{" "}
                -{" "}
                <span className="font-semibold">
                  Tài trợ cho khách hàng theo giá trị đơn hàng (2)
                </span>
              </p>
              <p>
                *** *Ngoài ra, Khách hàng thành viên & đối tác, doanh nghiệp khi
                mua hoa tại Thang Long Farm sẽ nhận được ưu đãi đặc biệt theo
                từng thời điểm, từng khu vực, từng cửa hàng cụ thể về chi phí
                vận chuyển và được thông báo qua hệ thống ứng dụng Thang Long
                Farm.
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
                  Thông tin chi tiết về hình thức nhận hàng tại cửa hàng?
                </span>
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex flex-col gap-3">
              <p>Hình thức:</p>
              <p>
                Khách hàng đặt hàng và đề xuất nhận hàng tại cửa
                hàng. Nhân viên cửa hàng soạn hàng và thông tin cho khách hàng
                về gói hàng đã sẵn sàng giao qua SMS/SĐT. Khách hàng đến cửa
                hàng: cung cấp mã đơn hàng và SĐT cho nhân viên tiếp nhận để
                nhận hàng đồng thời thanh toán chi phí (nếu chưa thanh toán).
              </p>
            </div>
          </AccordionDetails>
        </Accordion>
        
      </div>
    </div>
  );
};

export default Shipment;
