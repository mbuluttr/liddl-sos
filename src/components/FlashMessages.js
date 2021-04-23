import { showMessage } from "react-native-flash-message";
import colors from "../colors/Colors";

export const recentQuakesRefresh = () => {
  showMessage({
    message: "Son depremler güncellendi!",
    icon: "info",
    style: {
      backgroundColor: colors.menuBg,
      height: 57,
      alignItems: "center",
    },
    titleStyle: {
      fontSize: 18,
    },
  });
};

export const apiErrorMessage = () => {
  showMessage({
    message: "Bu özelliğin düzgün çalışabilmesi için internet gereklidir!",
    duration: 5000,
    icon: "warning",
    style: {
      backgroundColor: colors.menuBg,
      height: 57,
      alignItems: "center",
    },
    titleStyle: {
      fontSize: 18,
    },
  });
};

export const quakesFromStorage = () => {
  showMessage({
    message: "Son Depremleri güncellemek için internet bağlantısını açın!",
    duration: 5000,
    icon: "warning",
    style: {
      backgroundColor: colors.menuBg,
      height: 57,
      alignItems: "center",
    },
    titleStyle: {
      fontSize: 18,
    },
  });
};

export const removeContactInformation = () => {
  showMessage({
    message: "Kişi acil durum listenizden çıkarıldı !",
    icon: "success",
    duration: 500,
    style: {
      backgroundColor: colors.menuBg,
      height: 57,
      alignItems: "center",
    },
    titleStyle: {
      fontSize: 18,
    },
  });
};

export const contactAlreadyExist = () => {
  showMessage({
    message: "Bu kişi zaten acil durum kişilerinizde ekli !",
    icon: "warning",
    duration: 500,
    style: {
      backgroundColor: colors.menuBg,
      height: 57,
      alignItems: "center",
    },
    titleStyle: {
      fontSize: 18,
    },
  });
};

export const messageEmpty = () => {
  showMessage({
    message: "Lütfen acil durum mesajı yazınız !",
    icon: "warning",
    style: {
      backgroundColor: colors.menuBg,
      height: 57,
      alignItems: "center",
    },
    titleStyle: {
      fontSize: 18,
    },
  });
};

export const messageCorrect = () => {
  showMessage({
    message: "Mesajınız başarıyla kaydedildi !",
    icon: "info",
    style: {
      backgroundColor: colors.menuBg,
      height: 57,
      alignItems: "center",
    },
    titleStyle: {
      fontSize: 18,
    },
  });
};

export const messageSendSuccessfullyWithLocation = () => {
  showMessage({
    message: "Mesajınız ve konumunuz başarıyla gönderildi !",
    icon: "info",
    style: {
      backgroundColor: colors.menuBg,
      height: 57,
      alignItems: "center",
    },
    titleStyle: {
      fontSize: 18,
    },
  });
};
export const messageSendSuccessfullyWithNoLocation = () => {
  showMessage({
    message: "Mesajınız başarıyla gönderildi !",
    icon: "info",
    style: {
      backgroundColor: colors.menuBg,
      height: 57,
      alignItems: "center",
    },
    titleStyle: {
      fontSize: 18,
    },
  });
};

export const openLocationService = () => {
  showMessage({
    message: "Konum bilgisi gönderebilmeniz için GPS'inizi açmalısınız !",
    icon: "info",
    style: {
      backgroundColor: colors.menuBg,
      height: 57,
      alignItems: "center",
    },
    titleStyle: {
      fontSize: 18,
    },
  });
};
export const locationTimeout = () => {
  showMessage({
    message: "GPS'e bağlanılamadı. Mesajınız konumsuz gönderilecektir",
    icon: "info",
    style: {
      backgroundColor: colors.menuBg,
      height: 57,
      alignItems: "center",
    },
    titleStyle: {
      fontSize: 18,
    },
  });
};
