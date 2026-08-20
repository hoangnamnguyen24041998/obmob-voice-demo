# ObMob Voice Demo

Ứng dụng Expo/React Native demo cuộc gọi thoại WebRTC bằng Daily.

## Chức năng hiện có

- Tham gia phòng thoại bằng Daily room URL
- Bật/tắt microphone
- Chuyển audio route giữa earpiece, speaker và Bluetooth
- Hiển thị số người tham gia từ xa
- Hiển thị chất lượng mạng do Daily cung cấp
- Ghi lại các sự kiện cuộc gọi trong Activity log

Camera luôn tắt. App không chạy bằng Expo Go vì Daily/WebRTC cần native module.

## Yêu cầu

- Node.js 18 trở lên
- Yarn 1.x
- Android Studio cho Android, hoặc Xcode + CocoaPods cho iOS
- Một Daily room URL; có thể tạo miễn phí tại [Daily Dashboard](https://dashboard.daily.co)
- Nên dùng thiết bị thật để kiểm tra microphone, loa thoại và Bluetooth

## Cài đặt

```bash
yarn install
```

Lệnh này cũng chạy bản vá tương thích cho `react-native-background-timer` trên
Android để bổ sung contract `NativeEventEmitter`. Bản vá chỉ loại bỏ cảnh báo
liên quan, không tắt các warning khác.

## Chọn đúng loại Android build

Có hai loại APK với cách chạy khác nhau:

- **Development build:** dùng để debug, không chứa JavaScript bundle và luôn cần
  Metro đang chạy. Nếu chỉ cài APK rồi mở, app sẽ dừng ở màn hình
  **Development servers**.
- **Preview/release build:** chứa JavaScript bundle, cài xong có thể mở trực tiếp
  mà không cần máy tính hoặc Metro.

## Debug Android bằng thiết bị thật

1. Bật Developer options và USB debugging, kết nối điện thoại bằng USB.
2. Kiểm tra máy đã nhận thiết bị:

   ```bash
   adb devices
   ```

   Trạng thái phải là `device`, không phải `unauthorized`.

3. Cài lại development build sau khi dependency/native code thay đổi:

   ```bash
   yarn install
   yarn android
   ```

4. Nếu app mở màn hình **Development servers** nhưng không thấy server, chạy ở
   terminal khác:

   ```bash
   adb reverse tcp:8081 tcp:8081
   yarn start --clear
   ```

   Khi Metro sẵn sàng, nhấn `a` trong terminal để mở app Android. Có thể nhấn vào
   server vừa xuất hiện trên màn hình Development Build.

5. Nhập Daily room URL và nhấn **Join room**. Android sẽ hỏi quyền microphone tại
   bước này; app không xin quyền khi mới mở vì chưa cần thu âm.

### Reset quyền microphone để kiểm tra lại popup

Nếu trước đó đã chọn Allow hoặc Don't allow, Android có thể không hiện popup lại.
Vào **Settings → Apps → ObMob Voice Demo → Permissions → Microphone** để reset,
hoặc dùng:

```bash
adb shell pm revoke com.yourname.obmobvoicedemo android.permission.RECORD_AUDIO
```

Sau đó mở app và nhấn **Join room** lần nữa. Nếu đã chọn “Don't ask again”, phải
bật quyền trong Settings.

## Build APK Android chạy độc lập

### Cách 1: EAS Preview APK

```bash
npx eas login
npx eas build --profile preview --platform android
```

Tải APK từ link EAS và cài lên điện thoại. Bản này mở trực tiếp, không cần chạy
`yarn start`.

Nếu máy đang cài development build với chữ ký khác, gỡ bản cũ trước khi cài APK
mới:

```bash
adb uninstall com.yourname.obmobvoicedemo
```

### Cách 2: Build release APK trên máy

```bash
yarn install
yarn android:release
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

APK local release có sẵn JS bundle và không cần Metro. Cấu hình hiện tại ký bản
release bằng debug keystore, phù hợp để cài demo nội bộ nhưng không dùng để phát
hành Google Play.

## Chạy iOS

Chỉ thực hiện được trên macOS có Xcode:

```bash
yarn ios
```

Chọn simulator hoặc thiết bị trong Xcode nếu Expo không tự chọn đúng thiết bị.
Cho phép quyền microphone khi app yêu cầu.

## Chạy bằng EAS Development Build

Dùng cách này khi không muốn build native trên máy:

```bash
npx eas login
npx eas build --profile development --platform android
# hoặc
npx eas build --profile development --platform ios
```

Sau khi cài file build lên thiết bị, chạy Metro:

```bash
adb reverse tcp:8081 tcp:8081
yarn start
```

Development Build từ EAS vẫn cần Metro; muốn APK chạy độc lập hãy dùng profile
`preview` ở phần Android phía trên.

## Sử dụng và kiểm tra các chức năng

### 1. Tham gia cuộc gọi

1. Tạo một room trong Daily Dashboard và sao chép URL đầy đủ, ví dụ
   `https://your-team.daily.co/demo-room`.
2. Mở app, nhập URL vào ô **Daily room URL**.
3. Nhấn **Join room**.
4. Cho phép microphone khi Android hiển thị hộp thoại quyền.
5. Trạng thái phải chuyển từ **Connecting** sang **Live** và Activity log hiển
   thị `Call connected`.

### 2. Kiểm tra âm thanh hai chiều và số người

1. Trên thiết bị hoặc trình duyệt thứ hai, mở đúng room URL vừa dùng.
2. Cho phép microphone trên thiết bị thứ hai.
3. Khi thiết bị thứ hai tham gia, chỉ số **People** trên app tăng lên và log hiển
   thị `Participant joined`.
4. Nói từ cả hai phía để xác nhận âm thanh hai chiều.

`People` chỉ đếm người tham gia từ xa, không bao gồm chính thiết bị đang chạy app.

### 3. Bật/tắt microphone

1. Khi trạng thái là **Live**, nhấn **Mute**.
2. Chỉ số **Microphone** phải đổi thành **Muted** và phía còn lại không nghe thấy
   âm thanh từ app.
3. Nhấn **Unmute** để bật lại microphone.

### 4. Chuyển audio route

Nhấn nút route để chuyển lần lượt:

```text
Earpiece → Speaker → Bluetooth → Earpiece
```

- **Earpiece:** loa thoại của điện thoại
- **Speaker:** loa ngoài
- **Bluetooth:** tai nghe/loa Bluetooth tương thích đang kết nối

Nên kiểm tra chức năng này trên điện thoại thật. Route Bluetooth có thể báo lỗi
nếu không có thiết bị Bluetooth phù hợp.

### 5. Kiểm tra chất lượng mạng và Activity log

- **Network** cập nhật theo sự kiện `network-quality-change` của Daily.
- Thử chuyển giữa Wi-Fi và mạng di động hoặc thay đổi chất lượng kết nối.
- Activity log hiển thị kết nối, người tham gia, microphone, audio route, chất
  lượng mạng, app message và lỗi từ Daily.

### 6. Kết thúc cuộc gọi

Nhấn **Leave call**. App phải trở về trạng thái **Ready**, reset **People** và
**Network**, đồng thời hủy Daily call object.

## Khi thay đổi native dependency hoặc plugin

Cần build lại native app; reload Metro không cập nhật native binary:

```bash
yarn install
yarn android
# hoặc: yarn ios
```

## Xử lý lỗi thường gặp

- **Chỉ thấy màn hình Development servers:** đây là development build. Chạy
  `adb reverse tcp:8081 tcp:8081` và `yarn start --clear`, hoặc cài preview APK
  nếu cần app chạy độc lập.
- **Bấm Join nhưng không thấy hỏi quyền mic:** kiểm tra Activity log. Nếu log báo
  microphone permission, reset quyền trong Android Settings hoặc dùng lệnh
  `adb shell pm revoke` ở trên.
- **Missing native module / chạy không được trong Expo Go:** dùng local
  development build hoặc EAS development build theo hướng dẫn trên.
- **Vẫn thấy warning `NativeEventEmitter`:** chạy lại `yarn install`, sau đó
  rebuild bằng `yarn android`.
- **Không có âm thanh:** kiểm tra hai phía dùng cùng room URL, đã cấp quyền mic và
  thử route Speaker/Earpiece trước khi thử Bluetooth.
- **Không join được room:** kiểm tra URL đầy đủ, room còn hiệu lực và thiết bị có
  kết nối Internet.
- **`account-missing-payment-method`:** tài khoản Daily sở hữu room chưa có
  payment method. Thêm payment method trong Daily Dashboard hoặc dùng room được
  tạo bởi một Daily account khác đang hoạt động. App không thể bỏ qua kiểm tra
  này từ phía Daily.

## Debug lỗi join room trên Android

Kết nối thiết bị bằng USB, sau đó xóa log cũ trước khi tái hiện:

```bash
yarn android:logs:clear
```

Mở app, nhập URL bằng tay và nhấn **Join room**. Sau đó chạy:

```bash
yarn android:logs
```

Tìm các dòng `Meeting ended in error`. Ví dụ:

```text
Meeting ended in error: account-missing-payment-method
```

Nếu cần lưu log để gửi Daily Support:

```bash
adb logcat -d -v time > daily-join-error.log
```

Khi báo lỗi cho `help@daily.co`, gửi kèm:

- Daily domain và room name, không gửi API key
- Mã lỗi chính xác trong log
- Thời điểm thử join và múi giờ
- Xác nhận đây là audio-only call, không dùng recording/streaming/transcription

Có thể mở cùng room URL trực tiếp trong Chrome trên điện thoại. Nếu Chrome và
app cùng bị từ chối, lỗi nằm ở Daily account/domain chứ không phải React Native.

## Cấu trúc source

```text
App.tsx                         Composition root
src/models/                    Kiểu dữ liệu và hằng số của cuộc gọi
src/services/                  Tích hợp và quản lý vòng đời Daily SDK
src/viewmodels/                State, event mapping và actions
src/views/                     Màn hình, component và styles
plugins/                       Expo config plugin cho native build
scripts/                       Script tương thích chạy sau yarn install
```
