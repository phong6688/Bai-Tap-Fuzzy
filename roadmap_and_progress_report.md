# Báo Cáo Tiến Độ Dự Án Fuzzy (Roadmap & Progress Report)

> [!NOTE]
> Báo cáo này đối chiếu tiến độ hoàn thành thực tế của dự án so với lộ trình 4 ngày (Roadmap) được đề ra cho ứng dụng thương mại điện tử **Fuzzy PWA App**.

---

## 📅 Bảng Theo Dõi Tiến Độ Thực Hiện

| Lộ Trình | Nội Dung Chi Tiết | Trạng Thái | Minh Chứng & File Liên Kết |
| :--- | :--- | :---: | :--- |
| **Ngày 1** | Khởi tạo dự án Next.js (API) + React Vite | **Hoàn thành** | [package.json](file:///D:/Bai%20Tap%20FuZZy/FuZZy/package.json) & [backend/package.json](file:///D:/Bai%20Tap%20FuZZy/FuZZy/backend/package.json) |
| | Cấu hình `manifest.json` và Service Worker cơ bản | **Hoàn thành** | [manifest.json](file:///D:/Bai%20Tap%20FuZZy/FuZZy/public/manifest.json) & [service-worker.js](file:///D:/Bai%20Tap%20FuZZy/FuZZy/public/service-worker.js) |
| | Thiết kế CSDL (User, Product, Category, Order) | **Hoàn thành** | [database.json](file:///D:/Bai%20Tap%20FuZZy/FuZZy/backend/database.json) (Next.js) & LocalStorage (Vite) |
| | Phát triển API Đăng ký, Đăng nhập, Profile | **Hoàn thành** | [apiClient.ts](file:///D:/Bai%20Tap%20FuZZy/FuZZy/src/services/apiClient.ts#L122-L257) (Client) & [backend/pages/api/auth](file:///D:/Bai%20Tap%20FuZZy/FuZZy/backend/pages/api/auth) (Server) |
| | Xử lý lưu Token, quản lý Session | **Hoàn thành** | [apiClient.ts](file:///D:/Bai%20Tap%20FuZZy/FuZZy/src/services/apiClient.ts#L91-L115) (Tự động giải mã & Token expire) |
| **Ngày 2** | API CRUD Sản phẩm + Giao diện Trang chủ, Danh mục | **Hoàn thành** | [productService.ts](file:///D:/Bai%20Tap%20FuZZy/FuZZy/src/services/productService.ts) & [backend/pages/api/products](file:///D:/Bai%20Tap%20FuZZy/FuZZy/backend/pages/api/products) |
| | Infinite Scroll cho danh sách sản phẩm | **Hoàn thành** | [Shop.tsx](file:///D:/Bai%20Tap%20FuZZy/FuZZy/src/Pages/Shop.tsx#L54-L65) (Hỗ trợ lazy loading trên điện thoại) |
| | Tối ưu giao diện Chi tiết sản phẩm | **Hoàn thành** | [ProductDetails.tsx](file:///D:/Bai%20Tap%20FuZZy/FuZZy/src/Pages/ProductDetails.tsx) (Đồng bộ nút Add to Cart Mobile) |
| | Logic thêm/bớt giỏ hàng (LocalStorage + State) | **Hoàn thành** | [Cart.tsx](file:///D:/Bai%20Tap%20FuZZy/FuZZy/src/Pages/Cart.tsx) & [apiClient.ts](file:///D:/Bai%20Tap%20FuZZy/FuZZy/src/services/apiClient.ts#L363-L400) |
| | Hoàn thiện luồng Checkout (Địa chỉ, thanh toán, API) | **Hoàn thành** | [Checkout.tsx](file:///D:/Bai%20Tap%20FuZZy/FuZZy/src/Pages/Checkout.tsx) (Unified 3-Step checkout flow) |
| **Ngày 3 + 4**| Hoàn thiện chức năng Admin duyệt đơn & tồn kho | **Hoàn thành** | [Admin.tsx](file:///D:/Bai%20Tap%20FuZZy/FuZZy/src/Pages/Admin.tsx) & [api/orders/[id].ts](file:///D:/Bai%20Tap%20FuZZy/FuZZy/backend/pages/api/orders/%5Bid%5D.ts) |
| | Tích hợp UX/UI Mobile (Swipe to delete, Bottom Sheet) | **Hoàn thành** | Swipe-to-delete ([Cart.tsx](file:///D:/Bai%20Tap%20FuZZy/FuZZy/src/Pages/Cart.tsx#L10-L60)) & Bottom Sheet ([ProductDetails.tsx](file:///D:/Bai%20Tap%20FuZZy/FuZZy/src/Pages/ProductDetails.tsx#L355-L493)) |
| | Kiểm tra PWA (Install popup A2HS, Offline screen warning)| **Hoàn thành** | Cảnh báo Offline & Hộp thoại cài đặt ứng dụng ([App.tsx](file:///D:/Bai%20Tap%20FuZZy/FuZZy/src/App.tsx#L53-L168)) |
| | Kiểm tra biên dịch & Đóng gói (Testing & Builds) | **Hoàn thành** | Chạy kiểm thử thành công cả client và backend server. |

---

## 🛠️ Chi Tiết Các Hạng Mục Kỹ Thuật Đã Triển Khai

### 1. Progressive Web App (PWA) & Trải Nghiệm Offline
* **Service Worker Cache-First:** Các tài nguyên tĩnh được lưu trữ cục bộ. Khi không có mạng, SW sẽ tự động trả về bộ khung HTML (`/index.html`) từ bộ nhớ cache giúp PWA mở tức thì, triệt tiêu lỗi màn hình trắng của trình duyệt.
* **Cảnh báo mất mạng:** Giao diện hiển thị thanh thông báo lỗi màu đỏ bắt mắt ở góc trên màn hình khi xảy ra sự cố mất kết nối mạng.
* **Popup Add to Home Screen (A2HS):** Nhắc nhở người dùng cài đặt ứng dụng dạng banner trượt phía trên Bottom Nav với thiết kế mượt mà và nút chấp nhận cài đặt nhanh.

### 2. Quản Lý Đơn Hàng & Kho Hàng
* **Trải nghiệm giỏ hàng (Cart UI):** 
  * Vuốt sang trái để hiện nút Xóa (Swipe to delete) dùng CSS Transform tăng độ nhạy cảm ứng.
  * Tăng giảm số lượng sản phẩm bằng các nút `+/-` bất kỳ lúc nào.
* **Quy trình Thanh toán mượt mà (Checkout UI):**
  * Tích hợp cấu trúc 3 bước (Xác nhận Địa chỉ $\rightarrow$ Cổng thanh toán COD/Chuyển khoản/Ví Momo & VNPay $\rightarrow$ Thành công nhận mã đơn hàng) giúp giảm số lần chuyển trang và nhấp chuột tối đa.
* **Xử lý tồn kho trên API:**
  * Endpoint `POST /api/orders` tiếp nhận đơn hàng, tự động đối chiếu và trừ số lượng sản phẩm trong Kho hàng.

### 3. Giao Diện Quản Trị (Admin UI)
* Cho phép truy cập thông qua tuyến đường `#/admin` để quản lý tất cả đơn hàng đã đặt.
* Hỗ trợ cập nhật trạng thái đơn hàng 5 bước: *Chờ xác nhận, Đang chuẩn bị, Đang giao, Hoàn thành, Đã hủy*.
* Tab **Kho hàng** hỗ trợ theo dõi số lượng tồn kho cập nhật trực tiếp theo thời gian thực (hiển thị cảnh báo màu đỏ nếu hết hàng hoặc sắp hết hàng).
